function hexToRgb(hex) {
  // @src: https://stackoverflow.com/a/5624139/2205532
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function deepClone(e) {
  return JSON.parse(JSON.stringify(e));
}

function initialize() {
  simulationState = { curStage: 1, curWeekIdx: 0, nextMatchIdx: 0, ended: false, teamList: [], $teamEleById: {} };
  undoStack = [];

  let $teams = document.getElementById("teams");
  $teams.innerHTML = "<ul></ul>";
  for (let i in teamData) {
    // Paint team
    let $teamEle = document.createElement("li");
    const teamIconAlt = getTeamIcon(teamData[i], "altDark");
    const teamIcon = teamIconAlt ? teamIconAlt : getTeamIcon(teamData[i], "main");
    $teamEle.innerHTML = `<span class='team-icon'><img src='${teamIcon.svg}'></span>
                      <span class='team-name'>${teamData[i].name}</span>
                      <span class='team-rank'>${INITIAL_ELO_RANK}</span>
                      `;
    const color = hexToRgb(teamData[i].colors[0].color.color); // The color on pos 0 is the real "main" one
    $teamEle.style = `background-color: rgba(${color.r}, ${color.g}, ${color.b}, 0.3);`;
    $teams.children[0].appendChild($teamEle);

    // Init team data
    simulationState.teamList.push({
      id: teamData[i].id,
      name: teamData[i].name, // for debugging purposes primarily
      abbreviatedName: teamData[i].abbreviatedName, // for debugging purposes primarily
      eloRating: INITIAL_ELO_RANK,
      wins: 0,
      losses: 0,
      mapsWon: 0,
      mapsLost: 0,
      mapsTied: 0
    });

    simulationState.$teamEleById[teamData[i].id] = $teamEle;
  }
}

function undoStep() {
  if (undoStack.length == 0) {
    return; // Nothing to undo
  }

  simulationState = undoStack.pop();
  updateRender();
}

function simulateStep() {
  if (simulationState.ended) {
    // We're done. Nothing more to do here.
    return;
  }

  // Save our simulation state before we do anything (so we can go back)
  let simStateCopy = deepClone(simulationState);
  simStateCopy.$teamEleById = simulationState.$teamEleById; // DOM elements cannot be deep copied
  undoStack.push(simStateCopy);

  // Figure out the next match
  const weeks = schedule.data.stages[stageIndexes[simulationState.curStage]].weeks;
  const week = weeks[simulationState.curWeekIdx];
  if (typeof week.matches[simulationState.nextMatchIdx] == 'undefined') {
    // We're done with this week
    simulationState.nextMatchIdx = 0;
    simulationState.curWeekIdx++;
    if (typeof weeks[simulationState.curWeekIdx] == 'undefined' || weeks[simulationState.curWeekIdx].name.includes("layoffs")) {
      // We're also done with this week! (either it doesn't exist or it's playoffs)
      simulationState.curWeekIdx = 0;
      simulationState.curStage++;

      if (simulationState.curStage >= 5) {
        // We're done with everything
        simulationState.ended = true;
        return;
      }
    }
  }

  // we can't use the variables defined above as they may be outdated
  const match = schedule.data.stages[stageIndexes[simulationState.curStage]].weeks[simulationState.curWeekIdx].matches[simulationState.nextMatchIdx];
  if (match.state == "PENDING") {
    // We've reached a scheduled match - we're done!
    simulationState.ended = true;
    return;
  }

  // Take this match into account for rankings
  evaluateMatch(match);
  simulationState.nextMatchIdx++;

  // Update rendering
  updateRender();
}

function evaluateMatch(match) {
  let teamA = simulationState.teamList.find(ele => ele.id == match.competitors[0].id);
  let teamB = simulationState.teamList.find(ele => ele.id == match.competitors[1].id);

  // Update scoreboard (wins/losses)
  if (match.scores[0].value > match.scores[1].value) { // Final score A > B
    teamA.wins++;
    teamB.losses++;
  } else {
    teamB.wins++;
    teamA.losses++;
  }

  // Update map differential
  teamA.mapsWon += match.wins[0];
  teamA.mapsTied += match.ties[0];
  teamA.mapsLost += match.losses[0];
  teamB.mapsWon += match.wins[1];
  teamB.mapsTied += match.ties[1];
  teamB.mapsLost += match.losses[1];

  // Update ELO
  updateEloRatings(teamA, teamB, match.wins, match.ties, match.losses);
}

let offsetsByPos;
function updateRender() {
  // Calculate the Y pos of each rank
  if (typeof offsetsByPos == 'undefined') {
    offsetsByPos = {};
    let pos = 0;
    for (let $ele of document.getElementById("teams").children[0].children) {
      offsetsByPos[pos] = $ele.offsetTop;
      ++pos;
    }
  }

  // Update week/stage
  document.getElementById("stage-num").innerHTML = simulationState.curStage;
  document.getElementById("week-num").innerHTML = simulationState.curWeekIdx + 1;

  // Sort teams by score
  simulationState.teamList.sort((a, b) => {
    if (a.eloRating > b.eloRating) {
      return -1;
    } else if (a.eloRating == b.eloRating) {
      return 0;
    }

    return 1;
  });

  // See if we need to reorder them visually / update their scores
  for (let i in simulationState.teamList) {
    let team = simulationState.teamList[i];
    const $teamEle = simulationState.$teamEleById[team.id];
    if ($teamEle.dataset.pos != i) {
      // We're incorrectly rendered. i is the new position
      anime({
        targets: [$teamEle],
        translateY: offsetsByPos[i] - $teamEle.offsetTop,
        duration: 1000,
        easing: 'easeOutSine'
      });

      $teamEle.dataset.pos = i;
    }

    const $score = $teamEle.children[2];
    if (Math.floor(team.eloRating) != Number($score.innerHTML)) {
      // Our displayed score is outdated! Animate it to reach target
      let o = { score: Number($score.innerHTML) };
      anime({
        targets: o,
        score: team.eloRating,
        round: 1, // remove the decimals
        easing: 'linear',
        update: function () {
          $score.innerHTML = o.score;
        }
      })
    }
  }
}

function updateEloRatings(teamA, teamB, wins, ties, losses) {
  // Get the expected win ratios for each team, then multiply those by the maps played
  // The actual win value will be
  const expectedRatioA = 1 / (1 + Math.pow(10, (teamB.eloRating - teamA.eloRating) / 400));
  const expectedRatioB = 1 / (1 + Math.pow(10, (teamA.eloRating - teamB.eloRating) / 400));

  const mapsPlayed = wins[0] + ties[0] + losses[0];
  const eA = expectedRatioA * mapsPlayed;
  const eB = expectedRatioB * mapsPlayed;
  const sA = wins[0] + 0.5 * ties[0];
  const sB = wins[1] + 0.5 * ties[1];
  const newRatingA = teamA.eloRating + ELO_K * (sA - eA);
  const newRatingB = teamB.eloRating + ELO_K * (sB - eB);

  let trunc = (n, count) => Math.floor(n * Math.pow(10, count || 3)) / Math.pow(10, count || 3); // Truncate to count decimal pos
  console.log(`Match: ${teamA.name} vs ${teamB.name} (${wins[0]} - ${wins[1]}) | (E${trunc(eA)}-${trunc(eB)}, S${trunc(sA)}-${trunc(sB)})`);
  console.log(`  ${teamA.abbreviatedName}: ${Math.floor(teamA.eloRating)} -> ${Math.floor(newRatingA)} (${trunc(newRatingA - teamA.eloRating, 2)})`);
  console.log(`  ${teamB.abbreviatedName}: ${Math.floor(teamB.eloRating)} -> ${Math.floor(newRatingB)} (${trunc(newRatingB - teamB.eloRating, 2)})`);

  teamA.eloRating = newRatingA;
  teamB.eloRating = newRatingB;
}

//////////////////// MAIN \\\\\\\\\\\\\\\\\\\\\\\
const INITIAL_ELO_RANK = 2500;
const ELO_K = 75;

// Global variables
let undoStack;
let simulationState;

// Setup the teams
initialize();

// TODO: Load API data
console.log(schedule.data);

// Cache the stage indexes once (map of stage number [1+] to the stage index)
// This is necessary since the API list includes all stars and such
let stageIndexes;
if (typeof stageIndexes == "undefined") {
  stageIndexes = {};
  for (let i in schedule.data.stages) {
    const stage = schedule.data.stages[i];
    if (stage.id <= 3) { // stages 0 through 3
      stageIndexes[stage.id + 1] = i;
    }
  }
}

// Run
window.addEventListener("keydown", (e) => {
  if (e.code == "ArrowRight") {
    simulateStep();
  }
  else if (e.code == "ArrowLeft") {
    undoStep();
  }
})
