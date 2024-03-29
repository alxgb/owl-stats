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

function getRankBySR(sr) {
  const breakpoints = [
    [1500, "bronze"],
    [2000, "silver"],
    [2500, "gold"],
    [3000, "plat"],
    [3500, "diamond"],
    [4000, "master"],
    [9999, "gm"]
  ];

  for (let breakpoint of breakpoints) {
    if (sr < breakpoint[0]) {
      return breakpoint[1];
    }
  }

  return "bronze";
}

function getTeamsSrFromElo(teamList) {
  // Normalize all team's elos, then just build a distribution from 4.5k to 500
  let sum = 0;
  for (let team of teamList) {
    sum += team.eloRating;
  }
  let mean = sum / teamList.length;

  let stdDevAccum = 0;
  for (let team of teamList) {
    stdDevAccum += Math.pow(team.eloRating - mean, 2);
  }

  const stdDev = Math.sqrt(stdDevAccum / teamList.length);
  let eloRankings = {};
  for (let team of teamList) {
    if (team.wins + team.losses == 0) {
      // Unranked team
      eloRankings[team.id] = 0;
      continue;
    }

    const standarizedRank = (team.eloRating - mean) / stdDev;
    // Slowly inflate rankings overall as teams begin distributing themselves around,
    // center them around 2.5k, and clamp them to the 1 - 5000 range
    eloRankings[team.id] = Math.min(5000, Math.max(1, standarizedRank * (500 + Math.min(50, stdDev) * 10) + 2500));
  }

  return eloRankings;
}

function initialize() {
  simulationState = { curStage: 1, curWeekIdx: 0, nextMatchIdx: 0, ended: false, teamList: [], $teamEleById: {}, matchList: [] };
  undoStack = [];

  let $teams = document.getElementById("teams");
  $teams.innerHTML = "<ul></ul>";
  for (let i in teamData) {
    // Paint team
    let $teamEle = document.createElement("li");
    const teamIconAlt = getTeamIcon(teamData[i], "altDark");
    const teamIcon = teamIconAlt ? teamIconAlt : getTeamIcon(teamData[i], "main");
    $teamEle.innerHTML = `<span class='team-icon'><img src='${teamIcon.svg}'></span>
                      <span class='team-name'>
                        <span class='team-name-full'>${teamData[i].name}</span>
                        <span class='team-name-abbrv'>${teamData[i].abbreviatedName}</span>
                      </span>
                      <span class='team-rank' data-score="0">
                        <span class='team-rank-icon'></span>
                        <span class='team-rank-value'>-</span>
                      </span>
                      <span class='team-internal-rank' data-value="0">-</span>
                      <span class='team-record'>0 - 0</span>
                      `;
    const color = hexToRgb(teamData[i].colors[0].color.color); // The color on pos 0 is the real "main" one
    $teamEle.style = `background-color: rgba(${color.r}, ${color.g}, ${color.b}, 0.3);`;
    $teams.children[0].appendChild($teamEle);

    // Init team data
    simulationState.teamList.push({
      id: teamData[i].id,
      name: teamData[i].name, // for debugging purposes primarily
      abbreviatedName: teamData[i].abbreviatedName, // for debugging purposes primarily
      eloRating: settings.initialEloRank,
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
  render();
}

function simulateStep(updateView) {
  updateView = typeof updateView !== 'undefined' ? updateView : true;
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
  simulationState.matchList.push(match);
  simulationState.nextMatchIdx++;

  if (updateView) {
    render();
  }
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
let lastSliceStart = 0;
function render() {
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

  // Update matches (only show the last 5). Implemented by using a sliding slice
  const $matches = document.getElementById("matches");
  const sliceStart = Math.max(0, simulationState.matchList.length - 5);
  const matchHistory = simulationState.matchList.slice(sliceStart, sliceStart + 5).reverse();
  if (sliceStart - lastSliceStart != 0 && sliceStart - lastSliceStart != 1) {
    $matches.innerHTML = ""; // Either backwards or a jump, rerender all
  }
  lastSliceStart = sliceStart;

  let renderedMatches = {};
  for (let $matchEle of $matches.children) {
    let associatedMatch = matchHistory.find((m) => m.id == $matchEle.dataset.id);
    if (typeof associatedMatch == "undefined") {
      // This match no longer exists
      if ($matches.children.length > 6) {
        $matchEle.remove(); // instaremove, too many
      } else {
        anime({ // fade it out & remove it after
          targets: $matchEle,
          opacity: 0,
          easing: 'easeOutSine',
          duration: 1000 / settings.animationSpeed,
          complete: function (anim) {
            $matchEle.remove();
          }
        });
      }
      continue;
    }

    const associatedMatchIdx = matchHistory.indexOf(associatedMatch);
    if ($matchEle.dataset.idx != associatedMatchIdx) {
      $matchEle.dataset.idx = associatedMatchIdx;
    }

    renderedMatches[associatedMatch.id] = true;
  }

  for (let matchIdx in matchHistory) {
    const match = matchHistory[matchIdx];
    if (renderedMatches[match.id]) {
      continue;
    }

    let teamDataA = findTeamDataById(match.competitors[0].id);
    let teamDataB = findTeamDataById(match.competitors[1].id);
    let $matchEle = document.createElement("div");
    $matchEle.className = 'match-wrapper';
    $matchEle.dataset.idx = matchIdx;
    $matchEle.dataset.id = match.id;
    $matchEle.innerHTML = `
      <div class='match'>
        <span class='match-team-wrapper'>
          <div class='match-team-icon'><img src="${getTeamAltIcon(match.competitors[0].id).svg}"></div>
          <div class='match-team-name'>${teamDataA.abbreviatedName}</div>
        </span>
        <span class='match-team-result'>${match.scores[0].value} - ${match.scores[1].value}</span>
        <span class='match-team-wrapper'>
          <div class='match-team-icon'><img src="${getTeamAltIcon(match.competitors[1].id).svg}"></div>
          <div class='match-team-name'>${teamDataB.abbreviatedName}</div>
        </span>
      </div>
    `;

    if (Object.keys(renderedMatches).length >= Math.min(sliceStart, 4)) {
      $matches.prepend($matchEle);
    } else {
      $matches.append($matchEle);
    }
  }


  // Sort teams by score
  simulationState.teamList.sort((a, b) => {
    if (a.eloRating > b.eloRating) {
      return -1;
    } else if (a.eloRating == b.eloRating) {
      return 0;
    }

    return 1;
  });

  let srByTeam = getTeamsSrFromElo(simulationState.teamList);

  // See if we need to reorder them visually / update their scores
  for (let i in simulationState.teamList) {
    let team = simulationState.teamList[i];
    const $teamEle = simulationState.$teamEleById[team.id];
    if ($teamEle.dataset.pos != i) {
      // We're incorrectly rendered. i is the new position
      anime({
        targets: [$teamEle],
        translateY: offsetsByPos[i] - $teamEle.offsetTop,
        duration: 1000 / settings.animationSpeed,
        easing: 'easeOutSine'
      });

      $teamEle.dataset.pos = i;
    }

    // ELO / SR
    const $score = $teamEle.children[2];
    let teamSR = srByTeam[team.id];
    if (settings.roundTeamSR) {
      teamSR = Math.round(teamSR / 100) * 100;
    }

    if (teamSR != Number($score.dataset.score)) {
      // Our displayed score is outdated! Animate it to reach target
      anime({
        targets: $score.dataset,
        score: teamSR,
        round: 1, // remove the decimals
        easing: settings.roundTeamSR ? 'steps(5)' : 'steps(10)',
        duration: 1000 / (settings.animationSpeed * 1.5),
        update: function () {
          $score.children[1].innerHTML = $score.dataset.score;
          if (getRankBySR($score.dataset.score) != $score.dataset.rank) {
            $score.dataset.rank = getRankBySR($score.dataset.score);
            $score.children[0].innerHTML = "<img src='img/ow_" + getRankBySR($score.dataset.score) + ".png'>";
          }
        }
      });
    }

    const $internalScore = $teamEle.children[3];
    if (team.eloRating != Number($internalScore.dataset.value)) {
      anime({
        targets: $internalScore.dataset,
        value: team.eloRating,
        round: 1, // remove the decimals
        easing: 'linear',
        duration: 1000 / settings.animationSpeed,
        update: function () {
          $internalScore.innerHTML = $internalScore.dataset.value;
        }
      });
    }

    // WL
    const $wl = $teamEle.children[4];
    $wl.innerHTML = `${team.wins} - ${team.losses}`;
  }
}

function updateEloRatings(teamA, teamB, wins, ties, losses) {
  // Get the expected win ratios for each team, then multiply those by the maps played
  // The actual win value will be
  const expectedRatioA = 1 / (1 + Math.pow(10, (teamB.eloRating - teamA.eloRating) / 400));
  const expectedRatioB = 1 / (1 + Math.pow(10, (teamA.eloRating - teamB.eloRating) / 400));

  const mapsPlayed = wins[0] + ties[0] + losses[0];
  const eA = expectedRatioA;
  const eB = expectedRatioB;
  const mapWrA = (wins[0] + 0.5 * ties[0]) / mapsPlayed;
  const mapWrB = (wins[1] + 0.5 * ties[1]) / mapsPlayed;
  let sA, sB;
  if (settings.onlyWeighMapWins) {
    // If we're only weighing map wins, we don't care whether this team won or lost
    sA = mapWrA;
    sB = mapWrB;
  } else {
    // Otherwise, half of our score is from map wins, half is from actually winning games
    sA = mapWrA * 1 / 2 + (wins[0] > wins[1] ? 1 / 2 : 0);
    sB = mapWrB * 1 / 2 + (wins[1] > wins[0] ? 1 / 2 : 0);
  }

  const newRatingA = teamA.eloRating + settings.eloK_byStage[simulationState.curStage] * (sA - eA);
  const newRatingB = teamB.eloRating + settings.eloK_byStage[simulationState.curStage] * (sB - eB);

  let trunc = (n, count) => Math.floor(n * Math.pow(10, count || 3)) / Math.pow(10, count || 3); // Truncate to count decimal pos
  console.log(`Match: ${teamA.name} vs ${teamB.name} (${wins[0]} - ${wins[1]}) | ` +
    `(E${trunc(eA * mapsPlayed, 1)}-${trunc(eB * mapsPlayed, 1)}, S${trunc(sA * mapsPlayed, 1)}-${trunc(sB * mapsPlayed, 1)})`);
  console.log(`  ${teamA.abbreviatedName}: ${Math.floor(teamA.eloRating)} -> ${Math.floor(newRatingA)} (${trunc(newRatingA - teamA.eloRating, 2)})`);
  console.log(`  ${teamB.abbreviatedName}: ${Math.floor(teamB.eloRating)} -> ${Math.floor(newRatingB)} (${trunc(newRatingB - teamB.eloRating, 2)})`);

  teamA.eloRating = newRatingA;
  teamB.eloRating = newRatingB;
}

function updateSettingsDisplay() {
  if (settings.autoplay) {
    document.getElementById("controls-play").style = 'display: none';
    document.getElementById("controls-pause").style = '';
  } else {
    document.getElementById("controls-pause").style = 'display: none';
    document.getElementById("controls-play").style = '';
  }

  document.getElementsByName("play-speed").forEach((e) => {
    e.checked = false;
  });
  document.getElementById("play-x" + settings.playSpeed).checked = true;
  document.getElementById("round-sr").checked = settings.roundTeamSR;
  document.getElementById("only-weigh-map-wins").checked = settings.onlyWeighMapWins;

  for (let stage of [1, 2, 3, 4]) {
    document.getElementById("elo-k-stage-" + stage).value = settings.eloK_byStage[stage];
  }
}

function setupAutoplay() {
  let playSimulation = () => {
    if (simulationState.ended || !settings.autoplay) {
      return;
    }

    simulateStep();
  }

  if (typeof autoplayInterval !== "undefined" && autoplayInterval) {
    clearInterval(autoplayInterval);
  }

  if (settings.autoplay) {
    autoplayInterval = setInterval(playSimulation, 500 / (2 / 3 * settings.playSpeed));
  } else {
    autoplayInterval = null;
  }
}

function recalculateToCurrentState() {
  // Redo everything from the start, silently simulate until our current point, then render
  const finalStage = simulationState.curStage;
  const finalWeek = simulationState.curWeekIdx;
  const nextMatchIdx = simulationState.nextMatchIdx;

  initialize();
  while (simulationState.ended == false
    && (finalStage == simulationState.curStage
      && finalWeek == simulationState.curWeekIdx
      && nextMatchIdx == simulationState.nextMatchIdx) == false) {

    simulateStep(false); // Simulate without rendering
  }

  render();
}

// Global variables
let schedule;
let undoStack;
let settings;
let simulationState;
let stageIndexes;
let autoplayInterval;

window.onload = function () {
  //////////////////// MAIN \\\\\\\\\\\\\\\\\\\\\\\
  settings = {
    initialEloRank: 1000,
    eloK_byStage: {
      1: 75,
      2: 50,
      3: 50,
      4: 125
    },
    onlyWeighMapWins: false,
    autoplay: window.location.hash.includes("no-autoplay") == false,
    roundTeamSR: true,
    animationSpeed: 1.5,
    playSpeed: 1,
  };
  updateSettingsDisplay();
  setupAutoplay(); // Autoplay logic, we'll just look at it every 500ms no matter what

  // Setup the teams
  fetch("https://api.overwatchleague.com/schedule?locale=en-us&season=2019&separateStagePlayoffsWeek=true")
    .then((data) => data.json())
    .then((json) => {
      schedule = json;
      initialize();

      // Cache the stage indexes once (map of stage number [1+] to the stage index)
      // This is necessary since the API list includes all stars and such
      if (typeof stageIndexes == "undefined") {
        stageIndexes = {};
        for (let i in schedule.data.stages) {
          const stage = schedule.data.stages[i];
          if (stage.id <= 3) { // stages 0 through 3
            stageIndexes[stage.id + 1] = i;
          }
        }
      }
    });

  // Setup key listeners for manual control
  window.addEventListener("keydown", (e) => {
    if (e.code == "ArrowRight") {
      simulateStep();
    }
    else if (e.code == "ArrowLeft") {
      undoStep();
    }
  });

  // Setup button interactions
  document.getElementById("controls-play").addEventListener("click", function () {
    settings.autoplay = true;
    window.location.hash = "#";
    setupAutoplay();
    updateSettingsDisplay();
  });

  document.getElementById("controls-pause").addEventListener("click", function () {
    settings.autoplay = false;
    window.location.hash = "#no-autoplay";
    setupAutoplay();
    updateSettingsDisplay();
  });

  document.getElementById("controls-backward").addEventListener("click", function () {
    undoStep();
  });

  document.getElementById("controls-forward").addEventListener("click", function () {
    simulateStep();
  });

  document.getElementById("controls-jump-forward").addEventListener("click", function () {
    const startingStage = simulationState.curStage;
    const startingWeek = simulationState.curWeekIdx;
    while (simulationState.ended == false
      && startingStage == simulationState.curStage
      && startingWeek == simulationState.curWeekIdx) {

      simulateStep(false); // Simulate without updating
    }

    render();
  });

  for (let $radioSpeedEle of document.getElementsByName("play-speed")) {
    $radioSpeedEle.addEventListener("change", function (e) {
      settings.playSpeed = e.target.value;
      if (settings.playSpeed >= 2) {
        settings.animationSpeed = 2.5;
      } else {
        settings.animationSpeed = 1.5;
      }

      setupAutoplay();
      updateSettingsDisplay();
    });
  }

  document.getElementById("round-sr").addEventListener("change", function (e) {
    settings.roundTeamSR = e.target.checked;
    render();
  });

  document.getElementById("only-weigh-map-wins").addEventListener("change", function (e) {
    settings.onlyWeighMapWins = e.target.checked;
    recalculateToCurrentState();
  });

  for (let stage of [1, 2, 3, 4]) {
    document.getElementById("elo-k-stage-" + stage).addEventListener("keyup", function (e) {
      settings.eloK_byStage[stage] = Math.max(1, Number(e.target.value));
      recalculateToCurrentState();
    });
  }
};
