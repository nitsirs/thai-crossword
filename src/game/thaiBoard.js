import Board from "../components/Board";
import { DragDropContext } from "react-beautiful-dnd";
import { Button } from "@mui/material";
import Charstack from "../components/Charstack";
import { score, defaultVal, unlimitedSet } from "./boardInfo";
import { Stack } from "@mui/material";
import { Grid } from "@mui/material";
import { Divider } from "@mui/material";
import Container from '@mui/material/Container';

//FIXME: https://joshwcomeau.github.io/react-flip-move/examples/#/scrabble?_k=omfsxv more robust and beautiful board
// https://github.com/joshwcomeau/react-flip-move/blob/gh-pages/examples/components/3_Scrabble.jsx
function ThaiBoard(props) {
  function handleOnDragEnd(result) {
    // dropped outside the list or dropped on the same cell
    if (
      !result.destination ||
      (result.destination.index == result.source.index &&
        result.destination.droppableId == result.source.droppableId)
    )
      return;

    // dropped inside character zone
    if (result.destination.droppableId === "characters") {
      const items = Array.from(props.G.players[props.playerID].stack);
      if (result.source.droppableId === "unlimited") {
        return;
      }
      // if drag from inside; reorder the characters
      if (result.source.droppableId === "characters") {
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
      } // if from outside; add the character to the array
      else {
        //get the character value (draggable ID of character card is in "character-index" form)
        let value = result.draggableId.split("-")[0];
        items.splice(result.destination.index, 0, value);
        //if dragged form the board, remove the character from the original cell

        //const newBoard = Array.from(props.G.cells);
        const originalPosition = result.source.droppableId.split("-");
        originalPosition.forEach((x, i) => {
          originalPosition[i] = parseInt(x); // "0-0" => ["0","0"] => [0,0]
        });
        if (
          unlimitedSet.includes(
            props.G.cells[originalPosition[0]][originalPosition[1]]
          )
        ) {
          return;
        }
        //set original position to default
        props.moves.setChar(
          originalPosition[0],
          originalPosition[1],
          score[originalPosition[0]][originalPosition[1]]
        );
      }
      props.moves.setStack(props.playerID, items);
    }
    // dropped inside the the board zone; add the character card to the specified cell
    // and remove it from characters stack
    else if (result.destination.droppableId.match("\\d-\\d")) {
      const position = result.destination.droppableId.split("-");
      //turn all of position to int
      position.forEach((x, i) => {
        position[i] = parseInt(x); // "0-0" => ["0","0"] => [0,0]
      });

      //make sure that the target cell doesn't have characters yet
      console.log(props.G.cells[position[0]][position[1]]);
      if (!defaultVal.includes(props.G.cells[position[0]][position[1]])) {
        console.log("cell is occupied");
        /*if(confirm("ต้องการแทนที่หรือไม่? \nแทนที่แล้วเปลี่ยนกลับไม่ได้นะจ๊ะ")){
          TODO: implement this
        }else{return}*/ 
        return;

      }
      //get the character value (draggable ID of character card is in "character-index" form)
      let value = result.draggableId.split("-")[0];
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
      //add the character to the board
      props.moves.setChar(position[0], position[1], value);

      //if drag from charstack remove the character from characters stack
      console.log(result);
      if (result.source.droppableId === "characters") {
        const items = Array.from(props.G.players[props.playerID].stack);
        items.splice(result.source.index, 1);
        props.moves.setStack(props.playerID, items);
      }

      //if draging inside the board, remove the character from the original cell
      if (
        result.source.droppableId.match("\\d-\\d") &&
        result.source.droppableId !== result.destination.droppableId
      ) {
        const originalPosition = result.source.droppableId.split("-");
        originalPosition.forEach((x, i) => {
          originalPosition[i] = parseInt(x); // "0-0" => ["0","0"] => [0,0]
        });
        props.moves.setChar(
          originalPosition[0],
          originalPosition[1],
          score[originalPosition[0]][originalPosition[1]]
        );
      }
    }
    if (result.destination.droppableId === "unlimited") {
      if (result.source.droppableId === "characters") {
        return;
      }
      if (result.source.droppableId.match("\\d-\\d")) {
        const originalPosition = result.source.droppableId.split("-");
        originalPosition.forEach((x, i) => {
          originalPosition[i] = parseInt(x); // "0-0" => ["0","0"] => [0,0]
        });
        if (
          unlimitedSet.includes(
            props.G.cells[originalPosition[0]][originalPosition[1]]
          )
        ) {
          props.moves.setChar(
            originalPosition[0],
            originalPosition[1],
            score[originalPosition[0]][originalPosition[1]]
          );
        }
      }
    }
  }

  function switchTurn() {
    props.moves.isValidMove();
    props.moves.addScore(props.playerID);
  }

  return (
    <div>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Container >
        <Stack
          direction="row"
          spacing={{xl:3, lg:2, md:1, sm:1, xs:1}}
          
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
                {props.G.players[props.playerID].score.reduce(function (a, b) {
                  return a + b;
                }, 0)}{" "}
                แต้ม
              </div>
            </h1>

            {props.playerID == props.ctx.currentPlayer && (
              <h2 className="turn">ถึงตาคุณแล้ว! </h2>
            )}
            {props.playerID != props.ctx.currentPlayer && (
              <h2 className="turn">
                ยังไม่ถึงตาคุณ <br />
                🤫 หุบปาก อย่ารบกวน คู้ต่อสู้กำลังใช้ความคิด... <br />
                {props.G.players[props.playerID].score.reduce(function (a, b) {
                  return a + b;
                }, 0) >=
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
                list={unlimitedSet.slice(0, 6)}
                height="3vh"
                name="unlimited"
              />
              <Charstack
                list={unlimitedSet.slice(6, 13)}
                height="3vh"
                name="unlimited"
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
      </DragDropContext>
    </div>
  );
}
export default ThaiBoard;
