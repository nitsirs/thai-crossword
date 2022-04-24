import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import ImageList from "@mui/material/ImageList";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Characters from "./Characters";
import { unlimitedSet } from "../game/boardInfo";

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
              <Droppable
                droppableId={`${rowIndex}-${cellIndex}`}
                key={`${rowIndex}-${cellIndex}`}
              >
                {(provided, snapshot) => (
                  <Paper
                    sx={{
                      width: "7vh",
                      height: height,
                      backgroundColor: bgcolor,
                      color: "white",
                      textAlign: "center",
                    }}
                    variant="outlined"
                    square
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {isContained && (
                      <Characters
                        value={cell}
                        index={parseInt(`${rowIndex}${cellIndex}`)}
                        height={height}
                      />
                    )}
                    <h2 style={{ fontSize: "4.5vh", marginTop: "0" }}>
                      {cell !== 0 && cell !== 1 && cell}
                    </h2>

                    {provided.placeholder}
                  </Paper>
                )}
              </Droppable>
            );
          })
        )}
      </ImageList>
    </div>
  );
}
export default Board;
