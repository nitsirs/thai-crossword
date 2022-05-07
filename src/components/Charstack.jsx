import Characters from "./Characters";
import SortableItem from "./SortableItem";
import {
  DndContext,
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
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";


function Charstack(props) {
  return (
    <SortableContext items={props.list}
    strategy={horizontalListSortingStrategy}>
    <div style={{ display: "flex" }}>
      {props.list.map((x, index) => (
        <SortableItem id = {`${x}-${index}`} key={`${x}-${index}`} value={x} index={index} height={props.height}/>
      ))}
    </div>
    </SortableContext>
  );
}
export default Charstack;
