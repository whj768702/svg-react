import { useEffect, useState } from 'react';
import './App.css';
import { DndContext } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';

import Draggable from './components/Draggable';
import Droppable from './components/Droppable';
import { drawLine } from './svgUtils/DrawLine';

function App() {
  const [isDropped, setIsDropped] = useState(false);

  const [currentLineId, setCurrentLineId] = useState<string | null>('');
  const [currentLinePosition, setCurrentLinePosition] = useState({ x: 0, y: 0 });
  const [lines, setLines] = useState<string[]>([]);

  const [{ x, y }, setCoordinates] = useState({ x: 0, y: 0 });
  const [{ x: x2, y: y2 }, setCoordinates2] = useState({ x: 0, y: 0 });

  // const draggableMarkup = (
  //   <Draggable id="draggable" top={y} left={x} >Drag me 0</Draggable>
  // );

  function handleDragEnd(event: DragEndEvent) {
    console.log('event: ', event);
    const { delta, active } = event;
    if (active.id === 'draggable-1') {
      // setCurrentLineId(active.id);
      setLines([...lines, active.id]);
      setCoordinates(({ x, y }) => ({ x: x + delta.x, y: y + delta.y }));
    } else {
      setCoordinates2(({ x, y }) => ({ x: x + delta.x, y: y + delta.y }));
    }
    // if (event.over && event.over.id === 'Droppable') {
    //   setIsDropped(true);
    // }
  }

  function initSvg() {
    const svg = document.querySelector('svg');
    const line1 = drawLine(10, 10, 100, 100);
    line1.setAttribute('id', 'line1');
    svg?.appendChild(line1);
  }
  useEffect(() => {
    initSvg();
  }, []);

  useEffect(() => {
    console.log('currentLineId: ', currentLineId);
    function mouseMove(event: MouseEvent) {
      if (currentLineId) {
        const line1 = document.getElementById(currentLineId);
        if (line1?.getAttribute('x1')) {
          line1?.setAttribute('x2', event.clientX.toString());
          line1?.setAttribute('y2', event.clientY.toString());
        } else {
          const svg = document.querySelector('svg');
          const line1 = drawLine(currentLinePosition.x, currentLinePosition.y, event.clientX, event.clientY);
          line1.setAttribute('id', currentLineId);
          svg?.appendChild(line1);
        }
      }
    }
    window.addEventListener('mousemove', mouseMove);
    return () => {
      console.log('remove mousemove');
      window.removeEventListener('mousemove', mouseMove);
    };
  }, [currentLineId]);

  return (
    <div className='relative'>
      <svg className='w-screen h-screen absolute'></svg>
      <DndContext onDragEnd={handleDragEnd}>
        {/* {!isDropped ? draggableMarkup : null} */}
        <Draggable id="draggable-1" top={y} left={x} activeLineId={setCurrentLineId} updatePosition={setCurrentLinePosition} >Drag me 1</Draggable>
        <Draggable id="draggable-2" top={y2} left={x2} activeLineId={setCurrentLineId} updatePosition={setCurrentLinePosition}>Drag me 2</Draggable>
        {/* <Draggable id="draggable-1">Drag me 1</Draggable>
      <Draggable id="draggable-2">Drag me 2</Draggable>
      <Draggable id="draggable-3">Drag me 3</Draggable> */}
        {/* <Droppable>
        {isDropped ? draggableMarkup : 'Drop here'}
      </Droppable> */}
      </DndContext>
    </div>
  );
}

export default App;
