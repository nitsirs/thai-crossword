import Paper from "@mui/material/Paper";
import ImageList from "@mui/material/ImageList";
import Characters from "./Characters";
import { unlimitedSet } from "../game/boardInfo";
import Droppable from "./Droppable";

function Board(props) {
  return (
    <div>
      <ImageList
        sx={{
          border: "3vh solid #fe767f",
          boxShadow: "1vh 1vh #ff5350",
          borderRadius: "5vh",
          overflow: "hidden",
        }}
        cols={15}
        gap={0}
      >
        {props.skeleton.map((row, rowIndex) =>
          row.map((cell, cellIndex) => {
            let isContained = false; //if the cell need to show character card
            let bgcolor;
            let height = "7vh";
            switch (cell) {
              case 0:
                bgcolor = "white";
                height = "3vh";
                break;
              case 1:
                bgcolor = "white";
                break;
              case 2:
                bgcolor = "#a3d3f7";
                break;
              case 3:
                bgcolor = "#a0dbc0";
                break;
              case 4:
                bgcolor = "#e5aee6";
                break;
              case 5:
                bgcolor = "#c9b5e8";
                break;
              case "2x":
                bgcolor = "#fca9c3";
                break;
              case "3x":
                bgcolor = "#fa8287";
                break;
              default:
                isContained = true;
                if (unlimitedSet.includes(cell)) {
                  height = "3vh";
                }
            }

            return (
                  <Droppable key={`${rowIndex}-${cellIndex}`} height={height} bgcolor={bgcolor} isContained={isContained} cell={cell} row={row} cellIndex={cellIndex} rowIndex={rowIndex}/>

            );
          })
        )}
      </ImageList>
    </div>
  );
}
export default Board;
