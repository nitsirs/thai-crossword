import { useDroppable } from "@dnd-kit/core";
import { Paper } from "@mui/material";
import Characters from "./Characters";

function Droppable(props) {
  const { isOver, setNodeRef } = useDroppable({
    id: `${props.rowIndex}-${props.cellIndex}`,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };
  return (
    <Paper
      ref={setNodeRef}
      style={style}
      sx={{
        width: "7vh",
        height: props.height,
        backgroundColor: props.bgcolor,
        color: "white",
        textAlign: "center",
      }}
      variant="outlined"
      square
    >
      {props.isContained && (
        <Characters
          value={props.cell}
          index={parseInt(`${props.rowIndex}${props.cellIndex}`)}
          height={props.height}
          id={`${props.cell}-${props.rowIndex}-${props.cellIndex}`}
        />
      )}
      <h2 style={{ fontSize: "4.5vh", marginTop: "0" }}>
        {props.cell !== 0 && props.cell !== 1 && props.cell}
      </h2>
    </Paper>
  );
}
export default Droppable;
