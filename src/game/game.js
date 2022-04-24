import {
  charSet,
  score,
  defaultVal,
  characterScore,
  unlimitedSet,
} from "./boardInfo";
export const ThaiCrossword = {
  setup: () => ({
    cells: score,
    newCells: Array(19)
      .fill(null)
      .map(() => new Array(15).fill(0)),
    charSet: charSet,
    currentIndex: [[null, null, null, null]],
    secret: {
      stack: [],
    },
    players: {
      0: {
        stack: [],
        score: [0],
      },
      1: {
        stack: [],
        score: [0],
      },
    },
    openScore: [false, false],
  }),

  moves: {
    setChar: (G, ctx, d1, d2, char) => {
      G.cells[d1][d2] = char;
      G.newCells[d1][d2] = defaultVal.includes(char)
        ? 0
        : unlimitedSet.includes(char)
        ? 2
        : 1; // 0: default, 1: filled, 2: vowel
    },
    setStack: (G, ctx, playerID, arr) => {
      G.players[playerID].stack = arr;
    },
    setNewCells: (G, ctx) => {
      G.newCells = Array(19)
        .fill(null)
        .map(() => new Array(15).fill(0));
    },
    addScore: (G, ctx, playerID) => {
      const scoreThisTurn = calculateScore(G, ctx, G.newCells, G.cells);
      if (scoreThisTurn === 0) {
        console.log("วางตัวอักษรผิด วางใหม่ครับ");
        return;
      }
      
      fillStack(G, ctx, playerID);
      G.players[playerID].score.push(scoreThisTurn);
      G.openScore[playerID] = true; //TODO: add snackbar to show score
      console.log("ทำคะแนนได้ " + scoreThisTurn+" คะแนน");
      //remove old player cells
      G.newCells.map((_, i) => {
        G.newCells[i].map((_, j) => {
          if (G.newCells[i][j] === 0 && !defaultVal.includes(G.cells[i][j])) {
            console.log("delete", G.cells[i][j]);
            console.log(!defaultVal.includes(G.cells[i][j]));
            G.cells[i][j] = score[i][j];
          }
        });
      });
      // set newCells => 0 TODO: keep this until the end
      G.newCells = Array(19)
        .fill(null)
        .map(() => new Array(15).fill(0));
      ctx.events.endTurn();
    },

    fillStack,
    isValidMove,
    fillLine,
    calculateScore,
  },
  phases: {
    init: {
      moves: { fillStack },
      start: true,
      onBegin: (G, ctx) => {
        if (ctx.random.Die(2) === 1) {
          fillStack(G, ctx, "0");
          fillStack(G, ctx, "1");
        } else {
          fillStack(G, ctx, "1");
          fillStack(G, ctx, "0");
        }
        let i = 0;
        while (G.players["0"].stack[i] == G.players["1"].stack[i]) {
          i++; //skip the same character
          break;
        }
        G.firstPlayer =
          G.players["0"].stack[i] < G.players["1"].stack[i] ? "0" : "1";
        ctx.events.setPhase("play");
      },
    },
    play: {
      turn: {
        order: {
          first: (G, ctx) => G.firstPlayer,
          next: (G, ctx) => (parseInt(ctx.playOrderPos) + 1) % ctx.numPlayers,
        },
      },
    },
  },
  minPlayers: 2,
  maxPlayers: 2,
  endIf: (G, ctx) => {
    if (
      G.charSet.length === 0 &&
      (G.players["0"].stack.length === 0 || G.players["1"].stack.length === 0)
    ) {
      const score = [
        G.players["0"].score.reduce((a, b) => a + b, 0),
        G.players["1"].score.reduce((a, b) => a + b, 0),
      ];
      if (score[0] > score[1]) {
        console.log("Player 0 win!");
        return { winner: "0" };
      } else if (score[0] < score[1]) {
        console.log("Player 1 win!");
        return { winner: "1" };
      } else if (score[0] === score[1]) {
        console.log("Draw!");
        return { draw: true };
      } else {
        console.log("error on endIf");
      }
    }
  },
};

function fillStack(G, ctx, playerID) {
  const newCharSet = ctx.random.Shuffle(G.charSet);
  const newStack = Array.from(G.players[playerID].stack);
  let i = 0;
  while (newStack.length < 9) {
    if (newCharSet[i] === undefined) {
      break;
    }
    newStack.push(newCharSet[i]);
    i++;
  }
  newCharSet.splice(0, i);
  G.charSet = newCharSet;
  G.players[playerID].stack = newStack;
}

function isValidMove(G, ctx) {
  const arr = Array.from(G.newCells);
  const arrTrans = arr[0].map((_, i) => arr.map((row) => row[i]));
  const cells = Array.from(G.cells);
  const cellsTrans = cells[0].map((_, i) => cells.map((row) => row[i]));
  console.log(arr);
  const linearCount = [0, 0];
  const index = [0, 0, 0, 0]; //[first, last, rowNum/colNum, dimension] && index[0]=-1 when move is not valid

  let isValid = true;

  //horizontal check
  arr.map((_, i) => {
    if (arr[i].indexOf(1) !== arr[i].lastIndexOf(1)) {
      //if there is only one 1; index=lastIndex => false; if there is no 1 -1=-1 => false
      linearCount[0]++;
      index[0] = arr[i].indexOf(1);
      index[1] = arr[i].lastIndexOf(1);
      index[2] = i;
      index[3] = 0; //row
    }
  });
  //vertical check (same as horizontal with transposed array)
  arrTrans.map((_, i) => {
    if (arrTrans[i].indexOf(1) !== arrTrans[i].lastIndexOf(1)) {
      //if there is only one 1; index=lastIndex => false; if there is no 1 -1=-1 => false
      linearCount[1]++;
      index[0] = arrTrans[i].indexOf(1);
      index[1] = arrTrans[i].lastIndexOf(1);
      index[2] = i;
      index[3] = 1; //col
    }
  });
  //check if there is the odd one
  //!!before that check if there is only one 1
  let oneCount = 0;
  const onceIndex = [0, 0];
  arr.map((row, i) => {
    row.map((cell, j) => {
      if (cell === 1) {
        oneCount++;
        onceIndex[0] = i;
        onceIndex[1] = j; //row, col
      }
    });
  });
  if (oneCount === 1) {
    console.log("oneCount", oneCount);
    const horizontalIntersect = cells[onceIndex[0]].filter((value) =>
      charSet.includes(value)
    );
    const verticalIntersect = cellsTrans[onceIndex[1]].filter((value) =>
      charSet.includes(value)
    );
    if (horizontalIntersect.length > 1 && verticalIntersect.length <= 1) {
      //horizontal
      index[3] = 0;
      index[2] = onceIndex[0];
      index[0] = onceIndex[1];
      index[1] = onceIndex[1];
    } else if (
      verticalIntersect.length > 1 &&
      horizontalIntersect.length <= 1
    ) {
      //vertical
      index[3] = 1;
      index[2] = onceIndex[1];
      index[0] = onceIndex[0];
      index[1] = onceIndex[0];
    } else {
      isValid = false;
    }
  } else if (oneCount > 1) {
    //map arr 2d array
    arr.map((_, i) => {
      arr[i].map((_, j) => {
        if (arr[i][j] === 1) {
          let blankAxis = 0;
          if (arr[i].indexOf(1) == arr[i].lastIndexOf(1)) blankAxis++;
          if (arrTrans[j].indexOf(1) == arrTrans[j].lastIndexOf(1)) blankAxis++;
          if (blankAxis > 1) isValid = false;
        }
      });
    });
  }

  

  if (isValid === false) {
    console.log("Invalid move: isValid is false: maybe blank axis>1");
    index[0] = -1;
    //return;
  } else if (
    JSON.stringify(linearCount) == JSON.stringify([0, 1]) ||
    JSON.stringify(linearCount) == JSON.stringify([1, 0])
  ) {
    const valid = fillLine(G, ctx, index);
    if (valid === false) {
      console.log("Invalid move: fillLine return false");
      index[0] = -1;
      //return;
    }
  } else if (oneCount == 1) {
    const valid = fillLine(G, ctx, index);
    if (valid === false) {
      console.log("Invalid move: fillLine return false");
      index[0] = -1;
      //return;
    }
  } else {
    console.log("Invalid move: unknown error in isValidMove()", linearCount);
    index[0] = -1;
    //return;
  }

  G.currentIndex.push(index);
}
function fillLine(G, ctx, index) {
  const arr = Array.from(G.newCells);
  if (index === false) return false;
  // index from isValidMove [first, last, rowNum/colNum, dimension]
  // fill all arr with 0

  arr.map((_, i) => {
    arr[i] = Array.from(arr[i]).map((_, j) => 0);
  });
  //const newArr = Array.from(arr);
  //console.log(newArr);

  if (index[3] === 0) {
    //row (horizontal)
    for (let i = index[0]; i <= index[1]; i++) {
      //check if there is a blank cell -> break; return false;
      if (defaultVal.includes(G.cells[index[2]][i])) {
        return false;
      } else if (G.newCells[index[2]][i] === 1) {
        arr[index[2]][i] = 1;
      } else {
        arr[index[2]][i] = -1;
      }
    }
  } else if (index[3] === 1) {
    //col (vertical)
    for (let i = index[0]; i <= index[1]; i++) {
      //check if there is a blank cell -> break; return false;
      if (i % 2 === 0) {
        // small row (even); check if there is vowel then set to -2
        if (unlimitedSet.includes(G.cells[i][index[2]])) {
          arr[i][index[2]] = -2;
        }
        continue;
      } else if (defaultVal.includes(G.cells[i][index[2]])) {
        return false;
      } else if (G.newCells[i][index[2]] === 1) {
        arr[i][index[2]] = 1;
      } else {
        arr[i][index[2]] = -1;
      }
    }
  } else {
    console.log("Invalid move: unknown error in fillLine");
    return false;
  }
  //extend the array (fill the cells with -1 | in case vowel: -2) TODO: WARNING do after calculate the score
  console.log(index);
  for (let x = 1; x < arr.length; x++) {
    //horizontal
    if (index[3] === 0) {
      if (
        !defaultVal.includes(G.cells[index[2]][index[0] - x]) &&
        G.cells[index[2]][index[0] - x] !== undefined
      ) {
        //left
        arr[index[2]][index[0] - x] = -1;
        //check if vowel row is not undefined
        if (
          arr[index[2] + 1] !== undefined &&
          arr[index[2] - 1] !== undefined
        ) {
          arr[index[2] + 1][index[0] - x] = -2; //vowel below
          arr[index[2] - 1][index[0] - x] = -2; //vowel above
        }
      } else if (
        !defaultVal.includes(G.cells[index[2]][index[1] + x]) &&
        G.cells[index[2]][index[1] + x] !== undefined
      ) {
        //right
        arr[index[2]][index[1] + x] = -1;
        //check if vowel row is not undefined
        if (
          arr[index[2] + 1] !== undefined &&
          arr[index[2] - 1] !== undefined
        ) {
          arr[index[2] + 1][index[1] + x] = -2; //vowel below
          arr[index[2] - 1][index[1] + x] = -2; //vowel above
        }
      } else {
        break;
      }
    }
    //vertical
    if (index[3] === 1) {
      if (
        G.cells[index[0] - x] /*[index[2]]*/ !== undefined &&
        !defaultVal.includes(G.cells[index[0] - x][index[2]])
      ) {
        //up 1 cells
        arr[index[0] - x][index[2]] = -1;
      } else if (
        G.cells[index[0] - (x + 1)] /*[index[2]]*/ !== undefined &&
        !defaultVal.includes(G.cells[index[0] - (x + 1)][index[2]])
      ) {
        //up 2 cells
        arr[index[0] - (x + 1)][index[2]] = -1;
      } else if (
        G.cells[index[1] + x] /*[index[2]]*/ !== undefined &&
        !defaultVal.includes(G.cells[index[1] + x][index[2]])
      ) {
        //down 1 cells
        arr[index[1] + x][index[2]] = -1;
      } else if (
        G.cells[index[1] + (x + 1)] /*[index[2]]*/ !== undefined &&
        !defaultVal.includes(G.cells[index[1] + (x + 1)][index[2]])
      ) {
        //down 2 cells
        arr[index[1] + (x + 1)][index[2]] = -1;
      } else {
        break;
      }
    }
  }
  // check and remain vowel horizontally (index = [first, last, rowNum/colNum, dimension])
  if (index[3] === 0) {
    //FIXME: check if not undefined
    for (let i = index[0]; i <= index[1]; i++) {
      if (
        unlimitedSet.includes(G.cells[index[2] + 1][i]) &&
        G.cells[index[2] + 1] !== undefined
      ) {
        arr[index[2] + 1][i] = 2;
      }
      if (
        unlimitedSet.includes(G.cells[index[2] - 1][i]) &&
        G.cells[index[2] - 1] !== undefined
      ) {
        arr[index[2] - 1][i] = 2;
      }
    }
  }

  console.log(arr);
  G.newCells = arr;
}
function calculateScore(G, ctx, arr, gcells) {
  // check if lastest index is not valid
  if(G.currentIndex.at(-1)[0] === -1){
    // delete invalid index from currentIndex
    const newIndexArray = Array.from(G.currentIndex);
    newIndexArray.splice(-1,1);
    G.currentIndex = newIndexArray;
    return 0;
  }
  const cells = gcells.filter((_, i) => i % 2 === 1);
  const cellsTrans = cells[0].map((_, i) => cells.map((row) => row[i]));
  const newArr = arr.filter((_, i) => i % 2 === 1);
  const newArrTrans = newArr[0].map((_, i) => newArr.map((row) => row[i]));
  let newScore = 0;
  const multiplier = score.filter((_, i) => i % 2 === 1);
  let wordMultiplier = 1;
  const multiplierTrans = newArr[0].map((_, i) => newArr.map((row) => row[i]));
  let oneCount = 0; //move count (Bingo condition)
  // main linear
  newArr.map((row, i) => {
    row.map((cell, j) => {
      if (cell === 1 && characterScore[cells[i][j]] !== undefined) {
        oneCount++;
        console.log(cells[i][j], " : ", characterScore[cells[i][j]]);
        console.log("multiplier: ", multiplier[i][j]);
        if (typeof multiplier[i][j] === "number") {
          newScore += multiplier[i][j] * characterScore[cells[i][j]]; //with multiplier
          console.log("score: ", newScore);
        } else if (typeof multiplier[i][j] === "string") {
          wordMultiplier = multiplier[i][j] === "2x" ? 2 : 3; //with word multiplier
          newScore += characterScore[cells[i][j]];
          console.log("wordMultiplier: ", wordMultiplier);
        }
      } else if (cell === -1 && characterScore[cells[i][j]] !== undefined) {
        console.log(cells[i][j], " : ", characterScore[cells[i][j]]);
        console.log("multiplier: without");
        newScore += characterScore[cells[i][j]];
      }
    });
  });
  newScore *= wordMultiplier;
  console.log("newScore*multiplier: ", newScore);
  wordMultiplier = 1; //reset word multiplier

  // check other axis words in case user input is "parallel" to old character
  // which axis? (row or column)
  // check if row or column
  let parallelMove = false;

  let additionalScore = 0;
  let horizontalIntersect = 0;
  let verticalIntersect = 0;
  newArr.map((row, i) => {
    let count = 0;
    row.map((cell, j) => {
      if (cell === 1) {
        count++;
      }
    });
    count > 1 ? horizontalIntersect++ : null;
  });
  newArrTrans.map((row, i) => {
    let count = 0;
    row.map((cell, j) => {
      if (cell === 1) {
        count++;
      }
    });
    count > 1 ? verticalIntersect++ : null;
  });

  // check parallel move

  if (G.currentIndex.at(-2)[0]) { // not first move (not null)
    if (G.currentIndex.at(-2)[0] !== G.currentIndex.at(-2)[1]) {
      console.log(G.currentIndex.at(-2)[3]);
      //screen out once move
      if (
        G.currentIndex.at(-2)[3] === 0 &&
        horizontalIntersect >= 1 &&
        verticalIntersect == 0
      ) {
        //row
        parallelMove = true;
      } else if (
        G.currentIndex.at(-2)[3] === 1 &&
        verticalIntersect >= 1 &&
        horizontalIntersect == 0
      ) {
        //column
        parallelMove = true;
      }
    }
  }

  if (horizontalIntersect >= 1 && verticalIntersect == 0 && parallelMove) {
    //row axis => check new words "vertically"
    console.log(cellsTrans);
    cellsTrans.map((row, i) => {
      const charCount = row.filter((value) => charSet.includes(value));
      if (charCount.length > 1) {
        let newAdditionalScore = 0;
        row.map((cell, j) => {
          if (charSet.includes(cell) && newArrTrans[i][j] === 1) {
            console.log(cell, " : ", characterScore[cell]);
            console.log("multiplier: ", multiplierTrans[i][j]);
            if (typeof multiplierTrans[i][j] === "number") {
              newAdditionalScore +=
                multiplierTrans[i][j] * characterScore[cell]; // with multiplier
            } else if (typeof multiplierTrans[i][j] === "string") {
              wordMultiplier = multiplierTrans[i][j] === "2x" ? 2 : 3; // with word multiplier
              newAdditionalScore += characterScore[cell];
            }
          } else if (charSet.includes(cell) && newArrTrans[i][j] === 0) {
            console.log(cell, " : ", characterScore[cell]);
            console.log("multiplier: without", multiplierTrans[i][j]); // without multiplier
            newAdditionalScore += characterScore[cell];
          }
        });
        newAdditionalScore *= wordMultiplier;
        console.log("newAdditionalScore*multiplier: ", newAdditionalScore);
        additionalScore += newAdditionalScore;
      }
    });
  } else if (
    verticalIntersect >= 1 &&
    horizontalIntersect == 0 &&
    parallelMove
  ) {
    //column axis => check new words "horizontally"
    cells.map((row, i) => {
      const charCount = row.filter((value) => charSet.includes(value));
      if (charCount.length > 1) {
        let newAdditionalScore = 0;
        row.map((cell, j) => {
          if (charSet.includes(cell) && newArr[i][j] === 1) {
            console.log(cell, " : ", characterScore[cell]);
            console.log("multiplier: ", multiplier[i][j]);
            if (typeof multiplier[i][j] === "number") {
              newAdditionalScore += multiplier[i][j] * characterScore[cell]; // with multiplier
            } else if (typeof multiplier[i][j] === "string") {
              wordMultiplier = multiplier[i][j] === "2x" ? 2 : 3; // with word multiplier
              newAdditionalScore += characterScore[cell];
            }
          } else if (charSet.includes(cell) && newArr[i][j] === 0) {
            console.log(cell, " : ", characterScore[cell]);
            console.log("multiplier: without");
            newAdditionalScore += characterScore[cell]; // without multiplier
          }
        });
        newAdditionalScore *= wordMultiplier;
        console.log("newAdditionalScore*multiplier: ", newAdditionalScore);
        additionalScore += newAdditionalScore;
      }
    });

  }
  newScore += additionalScore;

  //Bingo Condition
  switch(oneCount) {
    case 6:
      newScore += 40;
      console.log("Bingo! +40");
      break;
    case 7:
      newScore += 50;
      console.log("Bingo! +50");
      break;
    case 8:
      newScore += 70;
      console.log("Bingo! +70");
      break;
    case 9:
      newScore += 90;
      console.log("Bingo! +90");
      break;
    default:
      break;
  }
  

  console.log("all score: ", newScore);

  return newScore;
}
