import { MouseEventHandler, PropsWithChildren } from "react";
import { useDraggable } from "@dnd-kit/core";
import type { MouseEvent } from "react";

type Props = PropsWithChildren<{
  id: string;
  top: number;
  left: number;
  activeLineId: (id: string) => void;
  updatePosition: ({ x, y }: { x: number, y: number; }) => void;
}>;

function Draggable({ id, top, left, activeLineId, updatePosition, children }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  function handleStart(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    console.log('handle start: ', event);
    activeLineId(id);
    updatePosition({ x: event.clientX, y: event.clientY });
    return null;
  }
  function handleEnd(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    console.log('handle end: ', event);
    activeLineId(null);
    return null;
  }

  return (
    <div ref={setNodeRef} style={{ ...style, top, left }} {...attributes} className="relative">
      <div className="absolute w-16 h-16 border border-green-600" {...listeners}>
        {children}
      </div>
      <div className="absolute top-[30%] -left-4 w-4 h-4 bg-green-300" onClick={handleStart}>a</div>
      <div className="absolute top-[30%] left-16 w-4 h-4 bg-green-300" onClick={handleEnd}>b</div>
    </div>

  );
}

export default Draggable;