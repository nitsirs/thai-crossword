import Board from "../components/Board";
import { Button } from "@mui/material";
import Charstack from "../components/Charstack";
import { score, defaultVal, unlimitedSet, charSet } from "./boardInfo";
import { Stack } from "@mui/material";
import { Grid } from "@mui/material";
import { Divider } from "@mui/material";
import Container from "@mui/material/Container";
import { DndContext } from "@dnd-kit/core";
import Characters from "../components/Characters";
import { useState } from "react";
import {
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

function ThaiBoard(props) {
  function handleDragEnd(event) {
    /* Note about id:
     * Droppable component's id (in the board) is in the form of "rowIndex-cellIndex"
     * SortableItem component's id is in the form of "value-index"
     * Draggable component's id
     *   - in the stack is in the form of "value-index"
     *   - in the board is in the form of "value-rowIndex-cellIndex"
     */
    console.log(event);
    const { active, over } = event;

    // dropped inside the board
    if (over && over.id.match("\\d{1,2}-\\d{1,2}")) {
      const position = over.id.split("-");
      //turn all of position to int
      position.forEach((x, i) => {
        position[i] = parseInt(x); // "0-0" => ["0","0"] => [0,0]
      });
      //make sure that the target cell doesn't have characters yet

      if (!defaultVal.includes(props.G.cells[position[0]][position[1]])) {
        console.log("cell is occupied");
        /*if (
          confirm("ต้องการแทนที่หรือไม่? \nแทนที่แล้วเปลี่ยนกลับไม่ได้นะจ๊ะ") //TODO: Implement this
        ) {
        } else {
          return;
        }*/
        return;
      }

      let value = active.id.split("-")[0];
      //get the character value (draggable ID of character card is in "character-index" form)
      //prevent dropping vowel on consonant or vice versa
      if (
        score[position[0]][position[1]] === 0 &&
        !unlimitedSet.includes(value)
      ) {
        console.log("consonant cannot be placed on vowel");
        return;
      } else if (
        score[position[0]][position[1]] !== 0 &&
        unlimitedSet.includes(value)
      ) {
        console.log("vowel cannot be placed on consonant");
        return;
      }
      //remove character
      if (active.id.match("\\D-\\d{1,2}\\-\\d{1,2}")) {
        // from original cell
        props.moves.setChar(
          active.id.split("-")[1],
          active.id.split("-")[2],
          score[active.id.split("-")[1]][active.id.split("-")[2]]
        );
      } else if (active.id.match("\\D-\\d{1,2}") && charSet.includes(active.id.split("-")[0]) ) {
        // from stack
        const stack = Array.from(props.G.players[props.playerID].stack);
        console.log(stack);
        console.log(active.id.split("-")[1]);
        stack.splice(active.id.split("-")[1], 1);

        props.moves.setStack(props.playerID, stack);
      }
      //add character
      props.moves.setChar(position[0], position[1], value);
    }
    // drop inside the stack
    else if(over.id.match("\\D-\\d{1,2}")) {
      console.log(active.id, over.id);
      if (active.id.match("\\D-\\d{1,2}\\-\\d{1,2}")) {
        // from board; add to stack; remove from original cell
        const stack = Array.from(props.G.players[props.playerID].stack);
        if (unlimitedSet.includes(active.id.split("-")[0])) {
        } else {
          stack.splice(over.id.split("-")[1], 0, active.id.split("-")[0]);
        }

        props.moves.setChar(
          active.id.split("-")[1],
          active.id.split("-")[2],
          score[active.id.split("-")[1]][active.id.split("-")[2]]
        );
        props.moves.setStack(props.playerID, stack);
      } else if (active.id.match("\\D-\\d{1,2}")) {
        // from stack; reorder stack
        const oldIndex = props.G.players[props.playerID].stack.indexOf(
          active.id.split("-")[0]
        );
        const newIndex = props.G.players[props.playerID].stack.indexOf(
          over.id.split("-")[0]
        );
        props.moves.setStack(
          props.playerID,
          arrayMove(props.G.players[props.playerID].stack, oldIndex, newIndex)
        );
      }
    }
  }
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  function switchTurn() {
    props.moves.isValidMove();
    props.moves.addScore(props.playerID);
  }

  return (
    <div>
      <DndContext
        onDragEnd={handleDragEnd}
        sensors={sensors}
        collisionDetection={closestCenter}
      >
        <Container>
          <Stack
            direction="row"
            spacing={{ xl: 3, lg: 2, md: 1, sm: 1, xs: 1 }}
          >
            <Board skeleton={props.G.cells} />
            <Stack
              direction="column"
              alignItems="center"
              justifyContent="space-evenly"
            >
              <h1 className="score">
                คะแนนของคุณตอนนี้:{" "}
                <div className="rounded-text">
                  {props.G.players[props.playerID].score.reduce(function (
                    a,
                    b
                  ) {
                    return a + b;
                  },
                  0)}{" "}
                  แต้ม
                </div>
              </h1>

              {props.playerID == props.ctx.currentPlayer && (
                <h2 className="turn">ถึงตาคุณแล้ว! </h2>
              )}
              {props.playerID != props.ctx.currentPlayer && (
                <h2 className="turn">
                  ยังไม่ถึงตาคุณ <br />
                  🤫 หุบปาก อย่ารบกวน คู่ต่อสู้กำลังใช้ความคิด... <br />
                  {props.G.players[props.playerID].score.reduce(function (
                    a,
                    b
                  ) {
                    return a + b;
                  },
                  0) >=
                  props.G.players[
                    (parseInt(props.playerID) + 1) % 2
                  ].score.reduce(function (a, b) {
                    return a + b;
                  }, 0)
                    ? "คะแนนของคุณ นำศัตรูอยู่หลายโยชน์ "
                    : "คะแนนของคุณน้อยกว่าคู่ต่อสู้"}
                </h2>
              )}

              <Stack
                className="charstack-container"
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                <Charstack
                  list={props.G.players[props.playerID].stack}
                  height="7vh"
                  name="characters"
                />
                <Divider className="divider">
                  สระข้างล่าง มีไม่จำกัด หยิบไปใส่ตามสบาย
                </Divider>
                <Charstack
                  list={unlimitedSet.slice(0,6)}
                  height="3.5vh"
                  name="characters"
                />
                <Charstack
                  list={unlimitedSet.slice(6,14)}
                  height="3.5vh"
                  name="characters"
                />
              </Stack>

              {props.playerID == props.ctx.currentPlayer && (
                <h2 className="turn">ลากตัวอักษรข้างบน 🖕🏿 ไปใส่กระดาน</h2>
              )}
              <Button variant="outlined" onClick={switchTurn}>
                Turn
              </Button>
            </Stack>
          </Stack>
        </Container>
      </DndContext>
    </div>
  );
}
export default ThaiBoard;
