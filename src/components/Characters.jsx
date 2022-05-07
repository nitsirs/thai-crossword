import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Card from "@mui/material/Card";
import { characterScore } from "../game/boardInfo";
import { useDraggable } from "@dnd-kit/core";

function Characters(props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;
  return (
        <div
        ref={setNodeRef} style={style} {...listeners} {...attributes}
        >
          <Card
            className="character-card"
            sx={{
              width: "7vh",
              height: props.height,
              backgroundColor: "#ff5350",
              color: "white",
              borderRadius: "0.5vh",
              marginBottom: "1vh",
              marginRight: "1vh",
              boxShadow: "inset 0px -4px #9e1e18",
              zIndex: 1,
            }}
          >
            <h3
              style={{
                fontSize: "4vh",
                textAlign: "center",
                margin: ["ุ", "ู", "ฺ"].includes(props.value) ? "-20px" : "0px",
              }}
            >
              {props.value}
            </h3>

            <p
              style={{
                fontSize: "1.8vh",
                textAlign: "center",
                marginTop: "-19px",
                marginLeft: "28px",
              }}
            >
              {characterScore[props.value]}
            </p>
          </Card>
        </div>
  );
}
export default Characters;
