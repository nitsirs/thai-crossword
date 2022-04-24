import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Stack from "@mui/material/Stack";
import Characters from "./Characters";
function Charstack(props) {
  return (
    <div>
    <Droppable droppableId={props.name} direction="horizontal">
      {(provided, snapshot) => (
        <div
          style={{display:"flex", overflow:"auto", justifyContent:"center", alignItems:"center", overflow:"hidden"}}
          className={props.name}
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {props.list.map((x, index) => (
          
              <Characters
                key={index}
                value={x}
                index={index}
                height={props.height}
              />
       
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
    </div>
  );
}
export default Charstack;
