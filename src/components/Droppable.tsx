import { PropsWithChildren } from 'react';
import { useDroppable } from '@dnd-kit/core';

function Droppable(props: PropsWithChildren) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'Droppable',
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="border border-gray-800 h-screen w-screen">
      {props.children}
    </div>
  );
}

export default Droppable;