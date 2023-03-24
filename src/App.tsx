import { useEffect, useState } from 'react';
import './App.css';
import { DndContext, DragMoveEvent } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { debounce } from 'radash';

import Draggable from './components/Draggable';
import { drawBezierCurve } from './svgUtils/DrawLine';
import StartNode from './components/StartNode';
import { calculateOffsets, getPathEndPoint } from './svgUtils/tools';

function App() {
  const [currentLineId, setCurrentLineId] = useState<string | null>('');
  const [currentLinePosition, setCurrentLinePosition] = useState({ x: 0, y: 0 });
  const [lines, setLines] = useState<string[]>([]);

  const [{ x, y }, setCoordinates] = useState({ x: 0, y: 0 });
  const [{ x: x2, y: y2 }, setCoordinates2] = useState({ x: 0, y: 0 });

  function handleDragEnd(event: DragEndEvent) {
    const { delta, active } = event;
    if (active.id === 'draggable-1') {
      setLines([...lines, active.id]);
      setCoordinates(({ x, y }) => ({ x: x + delta.x, y: y + delta.y }));
    } else {
      setCoordinates2(({ x, y }) => ({ x: x + delta.x, y: y + delta.y }));
    }
  }
  function handleDragMove(event: DragMoveEvent) {
    const { delta, active } = event;
    if (active.id === 'draggable-1') {
      // setCoordinates(({ x, y }) => ({ x: x + delta.x, y: y + delta.y }));
    }
    console.log('moving: (%s, %s)', event.activatorEvent.clientX, event.activatorEvent.clientY);
    console.log('corrdinate: (%s, %s)', x, y);
    updatePath(event);
    // debouncedUpdatePath(event);
  }
  const debouncedUpdatePath = debounce({ delay: 100 }, updatePath);

  function updatePath(event: DragMoveEvent) {
    console.log('updatePath: ', currentLineId);
    const id = event.active.id;
    if (id) {
      const svg = document.getElementsByTagName('svg')[0];
      const g = svg.querySelector(`#${id}`);
      const path = g?.querySelector('path');
      if (path) {
        const endPoint = getPathEndPoint(path);
        // const x2 = event.activatorEvent.clientX;
        // const y2 = event.activatorEvent.clientY;
        const x2 = x + event.delta.x + 80;
        const y2 = y + event.delta.y;
        console.log('endPoint: (%s, %s)', endPoint.x, endPoint.y);
        console.log('moving: (%s, %s)', x2, y2);
        const xoffset = calculateOffsets(endPoint.x, x2);
        const yoffset = calculateOffsets(endPoint.y, y2);
        path.setAttribute("d", `M ${x2} ${y2}
           C ${x2 + 3 * xoffset} ${y2}
             ${x2 + 4 * xoffset} ${y2 + 3 * yoffset}
             ${x2 + 5 * xoffset} ${y2 + 5 * yoffset}
           C ${x2 + 6 * xoffset} ${y2 + 7 * yoffset}
             ${x2 + 7 * xoffset} ${y2 + 10 * yoffset}
             ${endPoint.x} ${endPoint.y},
             `);
      }
    }
  }

  useEffect(() => {
    function mouseMove(event: MouseEvent) {
      if (currentLineId) {
        const svg = document.getElementsByTagName('svg')[0];
        const g = svg.querySelector(`#${currentLineId}`);
        const line1 = g?.querySelector('path');
        if (line1) {
          // const { x, y } = (line1 as SVGPathElement).getPointAtLength(10);
          const x2 = event.clientX;
          const y2 = event.clientY;
          const xoffset = calculateOffsets(x2, currentLinePosition.x);
          const yoffset = calculateOffsets(y2, currentLinePosition.y);
          console.log('起始点: (%s, %s)', currentLinePosition.x, currentLinePosition.y);
          console.log('xoffset', xoffset, 'yoffset', yoffset);
          console.log('终点: (%s, %s)', x2, y2);
          line1.setAttribute("d", `M ${currentLinePosition.x} ${currentLinePosition.y}
           C ${currentLinePosition.x + 3 * xoffset} ${currentLinePosition.y}
             ${currentLinePosition.x + 4 * xoffset} ${currentLinePosition.y + 3 * yoffset}
             ${currentLinePosition.x + 5 * xoffset} ${currentLinePosition.y + 5 * yoffset}
           C ${currentLinePosition.x + 6 * xoffset} ${currentLinePosition.y + 7 * yoffset}
             ${currentLinePosition.x + 7 * xoffset} ${currentLinePosition.y + 10 * yoffset}
             ${x2} ${y2},
             `);
        } else {
          const svg = document.querySelector('svg');
          const line1 = drawBezierCurve(currentLinePosition.x, currentLinePosition.y, event.clientX, event.clientY);
          line1.setAttribute('id', currentLineId);
          svg?.appendChild(line1);
        }
      }
    }
    window.addEventListener('mousemove', mouseMove);
    return () => {
      window.removeEventListener('mousemove', mouseMove);
    };
  }, [currentLineId]);

  return (
    <div className='relative'>
      <svg className='w-screen h-screen absolute'></svg>
      <DndContext onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
        <StartNode id="draggable-1" top={y} left={x} activeId={currentLineId} activeLineId={setCurrentLineId} updatePosition={setCurrentLinePosition} >Drag me 1</StartNode>
        {/* <Draggable id="draggable-1" top={y} left={x} activeLineId={setCurrentLineId} updatePosition={setCurrentLinePosition} >Drag me 1</Draggable> */}
        <Draggable id="draggable-2" top={y2} left={x2} activeId={currentLineId} activeLineId={setCurrentLineId} updatePosition={setCurrentLinePosition}>Drag me 2</Draggable>
      </DndContext>
    </div>
  );
}

export default App;
