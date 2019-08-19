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
      mapsTied: 0,
      k: FIRST_GAMES_K,
    });

    simulationState.$teamEleById[teamData[i].id] = $teamEle;
  }
}

function undoStep() {
  if (undoStack.length == 0) {
    return; // Nothing to undo
  }

  console.log(simulationState);
  simulationState = undoStack.pop();
  console.log(simulationState);

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
  const teamA = simulationState.teamList.find(ele => ele.id == match.competitors[0].id);
  const teamB = simulationState.teamList.find(ele => ele.id == match.competitors[1].id);
  const resultA = match.scores[0].value;
  const resultB = match.scores[1].value;

  // Update scoreboard (wins/losses)
  if (resultA > resultB) {
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
  updateEloRatings(teamA, teamB, resultA, resultB, match.conclusionValue);
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
      // Our team score is outdated!
      $score.innerHTML = Math.floor(team.eloRating);
    }
  }
}

function updateEloRatings(teamA, teamB, resultA, resultB, conclusionValue) {
  // Get the expected ratios for each team, multiply them for the conclusionValue to
  // get the expected points for our team (conclusionValue is either 4 or 5)
  const expectedRatioA = 1 / (1 + Math.pow(10, (teamB.eloRating - teamA.eloRating) / 400));
  const expectedRatioB = 1 / (1 + Math.pow(10, (teamA.eloRating - teamB.eloRating) / 400));

  const draws = conclusionValue - resultA - resultB; // Get the amount of draws that took place. These are worth a virtual 0.5 to each team
  const eA = expectedRatioA * conclusionValue;
  const eB = expectedRatioB * conclusionValue;
  const newRatingA = teamA.eloRating + teamA.k * (resultA + 0.5 * draws - eA);
  const newRatingB = teamB.eloRating + teamB.k * (resultB + 0.5 * draws - eB);

  console.log(`Match: ${teamA.name} vs ${teamB.name} (${resultA} - ${resultB}) - (${eA} - ${eB})`);
  console.log(`  ${teamA.abbreviatedName}: ${teamA.eloRating} -> ${newRatingA} (${newRatingA - teamA.eloRating})`);
  console.log(`  ${teamB.abbreviatedName}: ${teamB.eloRating} -> ${newRatingB} (${newRatingB - teamB.eloRating})`);

  teamA.eloRating = newRatingA;
  teamB.eloRating = newRatingB;

  // Update teams' K if necessary
  for (let team of [teamA, teamB]) {
    if (team.wins + team.losses >= K_ESTABLISHED_SWITCH_AFTER_GAMES && team.k != K_ESTABLISHED) {
      console.log(`Setting ${team.name}'s k to established k: ${K_ESTABLISHED}`);
      team.k = K_ESTABLISHED;
    }
  }
}

//////////////////// MAIN \\\\\\\\\\\\\\\\\\\\\\\
const INITIAL_ELO_RANK = 2500;
const FIRST_GAMES_K = 100;
const K_ESTABLISHED_SWITCH_AFTER_GAMES = 5;
const K_ESTABLISHED = 40;

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
