import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Card from "@mui/material/Card";
import { characterScore } from "../game/boardInfo";

function Characters(props) {
  return (
    <Draggable
      draggableId={`${props.value}-${props.index}`}
      index={props.index}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
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
              boxShadow: "inset 0px -4px #8a2a21"
            }}
          >
            <h3 style={{fontSize: "4vh", textAlign:"center", margin:["ุ", "ู", "ฺ"].includes(props.value)?"-27px":"0px"}}>{props.value}</h3>

            <p style={{fontSize: "1.8vh", textAlign:"center", marginTop:"-19px", marginLeft:"28px"}}>{characterScore[props.value]}</p>

          </Card>

        </div>
      )}
    </Draggable>
  );
}
export default Characters;
