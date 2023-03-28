import { MouseEventHandler, PropsWithChildren } from "react";
import { useDraggable } from "@dnd-kit/core";
import type { MouseEvent } from "react";

type Props = PropsWithChildren<{
  id: string;
  top: number;
  left: number;
  activeId: string | null;
  activeLineId: (id: string) => void;
  updatePosition?: ({ x, y }: { x: number, y: number; }) => void;
  updateComponentPosition: (id: string, position: { x: number; y: number; }) => void;
}>;

function Draggable({ id, top, left, activeId, activeLineId, updatePosition, updateComponentPosition, children }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  function handleStart(event: MouseEvent<HTMLDivElement>) {
    console.log('handle start: ', activeId);
    if (activeId) {
      return;
    }
    event.preventDefault();
    console.log('handle start: ', event);
    activeLineId(id);
    // updatePosition({ x: event.clientX, y: event.clientY });
    // updateComponentPosition(id, { x: event.clientX, y: event.clientY });
    return null;
  }
  function handleEnd(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    console.log('handle end: ', event);
    activeLineId('');
    return null;
  }

  return (
    <div ref={setNodeRef} style={{ ...style, top, left }} {...attributes} className="relative">
      <div className="absolute w-16 h-16 border border-green-600" {...listeners}>
        {children}
      </div>
      <div className="absolute top-[30%] left-16 w-4 h-4 bg-green-300" onClick={handleStart}>s</div>
      <div className="absolute top-[30%] -left-4 w-4 h-4 bg-green-300" onClick={handleEnd}>e</div>
    </div>

  );
}

export default Draggable;