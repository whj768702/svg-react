import { useEffect, useState } from 'react';
import './App.css';
import { DndContext } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';

import Draggable from './components/Draggable';
import { drawLine, drawBezierCurve } from './svgUtils/DrawLine';

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

  function initSvg() {
    const svg = document.querySelector('svg');
    const line1 = drawBezierCurve(10, 15, 100, 150);
    line1.setAttribute('id', 'line1');
    svg?.appendChild(line1);
  }
  useEffect(() => {
    initSvg();
  }, []);

  function axisX(x1: number, x2: number) {
    let result = 0;
    if (x2 > x1) {
      result = 10;
    } else if (x2 < x1) {
      result = -10;
    }
    return result;
  }

  function getOffset(x1: number, x2: number) {
    return (x1 - x2) / 10;
  }

  function getYOffset(y1: number, y2: number) {
    return (y1 - y2) / 10;
  }

  useEffect(() => {
    function mouseMove(event: MouseEvent) {
      if (currentLineId) {
        const svg = document.getElementsByTagName('svg')[0];
        const g = svg.querySelector(`#${currentLineId}`);
        const line1 = g?.querySelector('path');
        if (line1) {
          const { x, y } = (line1 as SVGPathElement).getPointAtLength(10);
          const x2 = event.clientX;
          const y2 = event.clientY;
          const xoffset = getOffset(x2, currentLinePosition.x);
          const yoffset = getYOffset(y2, currentLinePosition.y);
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
      <DndContext onDragEnd={handleDragEnd}>
        <Draggable id="draggable-1" top={y} left={x} activeLineId={setCurrentLineId} updatePosition={setCurrentLinePosition} >Drag me 1</Draggable>
        <Draggable id="draggable-2" top={y2} left={x2} activeLineId={setCurrentLineId} updatePosition={setCurrentLinePosition}>Drag me 2</Draggable>
      </DndContext>
    </div>
  );
}

export default App;
