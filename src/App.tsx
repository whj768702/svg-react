import { useEffect, useState } from 'react';
import './App.css';
import { DndContext, DragMoveEvent } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { debounce } from 'radash';

import Draggable from './components/Draggable';
import { drawBezierCurve } from './svgUtils/DrawLine';
import StartNode from './components/StartNode';
import { calculateOffsets, getPathEndPoint } from './svgUtils/tools';
import { create } from 'zustand';
import { v4 as uuidv4 } from "uuid";
import { produce } from 'immer';

type ComponentNode = {
  type: 'START' | 'END' | 'NORMAL';
  id: string;
  position: {
    x: number;
    y: number;
  };
  data: {};
  related: { from: string | null; to: string | null; }[];
};
type State = {
  components: { [id: string]: ComponentNode; };
};
type Action = {
  addComponent: (id: string, node: ComponentNode) => void;
  getComponentById: (id: string) => ComponentNode | undefined;
  updateComponentPosition: (id: string, position: { x: number; y: number; }) => void;
};
// @ts-ignore
// const store = state => ({
//   components: {},
//   addComponent: (id: string, node: ComponentNode) => {
//     state.components[id] = node;
//   },
//   getComponentById: (id: string) => {
//     return state.components[id];
//   },
//   updateComponentPosition: (id: string, position: { x: number; y: number; }) => {
//     state.components[id].position = position;
//   }
// });

// const useStore = create(store);
const useStore = create<State & Action>((set, get) => ({
  components: {},
  addComponent: (id: string, node: ComponentNode) =>
    set(produce((state) => {
      state.components[id] = node;
      return state;
    }
      // { components: { ...state.components, [id]: node } })
    )),
  getComponentById: (id: string) => {
    return get().components[id];
  },
  updateComponentPosition: (id: string, position: { x: number; y: number; }) => {
    const node = get().getComponentById(id);
    console.log('updateComponentPosition: ', id, position);
    set(produce((state) => {
      const oldPosition = state.components[id].position;
      state.components[id].position = { x: oldPosition.x + position.x, y: oldPosition.y + position.y };
      return state;
    }));
    // if (node) {
    //   node.position = position;
    // set((state) => (
    //   { components: { ...state.components, [id]: node } })
    // );
    // }
  }
}));

function App() {
  const { components, addComponent, updateComponentPosition, getComponentById } = useStore((state) => ({
    components: state.components,
    addComponent: state.addComponent,
    updateComponentPosition: state.updateComponentPosition,
    getComponentById: state.getComponentById
  }));
  const [currentLineId, setCurrentLineId] = useState<string | null>('');
  const [currentLinePosition, setCurrentLinePosition] = useState({ x: 0, y: 0 });
  const [lines, setLines] = useState<string[]>([]);

  const [{ x, y }, setCoordinates] = useState({ x: 0, y: 0 });
  const [{ x: x2, y: y2 }, setCoordinates2] = useState({ x: 0, y: 0 });

  function handleDragEnd(event: DragEndEvent) {
    const { delta, active } = event;
    console.log('handleDragEnd: ', event);
    updateComponentPosition(active.id as string, { x: delta.x, y: delta.y });
    // if (active.id === 'draggable-1') {
    //   setLines([...lines, active.id]);
    //   setCoordinates(({ x, y }) => ({ x: x + delta.x, y: y + delta.y }));
    // } else {
    //   setCoordinates2(({ x, y }) => ({ x: x + delta.x, y: y + delta.y }));
    // }
  }
  function handleDragMove(event: DragMoveEvent) {
    // const { delta, active } = event;
    // if (active.id === 'draggable-1') {
    //   // setCoordinates(({ x, y }) => ({ x: x + delta.x, y: y + delta.y }));
    // }
    // console.log('moving: (%s, %s)', event.activatorEvent.clientX, event.activatorEvent.clientY);
    // console.log('corrdinate: (%s, %s)', x, y);
    // updatePath(event);
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
      console.log('currentLineId: ', currentLineId);
      if (currentLineId) {
        const svg = document.getElementsByTagName('svg')[0];
        const g = svg?.querySelector(`#${currentLineId}`);
        const line1 = g?.querySelector('path');
        if (line1) {
          // const { x, y } = (line1 as SVGPathElement).getPointAtLength(10);
          const x2 = event.clientX;
          const y2 = event.clientY;
          const position = getComponentById(currentLineId)?.position;
          const xoffset = calculateOffsets(x2, position!.x);
          const yoffset = calculateOffsets(y2, position!.y);
          console.log('起始点: (%s, %s)', currentLinePosition.x, currentLinePosition.y);
          console.log('xoffset', xoffset, 'yoffset', yoffset);
          console.log('终点: (%s, %s)', x2, y2);
          line1.setAttribute("d", `M ${position!.x} ${position!.y}
           C ${position!.x + 3 * xoffset} ${position!.y}
             ${position!.x + 4 * xoffset} ${position!.y + 3 * yoffset}
             ${position!.x + 5 * xoffset} ${position!.y + 5 * yoffset}
           C ${position!.x + 6 * xoffset} ${position!.y + 7 * yoffset}
             ${position!.x + 7 * xoffset} ${position!.y + 10 * yoffset}
             ${x2} ${y2},
             `);
        } else {
          const position = getComponentById(currentLineId)?.position;
          console.log('position', position);
          const svg = document.querySelector('svg');
          const line1 = drawBezierCurve(position!.x, position!.y, event.clientX, event.clientY);
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

  const handleAddClick = (type: 'START' | 'NORMAL') => {
    const id = uuidv4();
    console.log('id', id);
    addComponent(type + id, {
      id,
      type,
      position: { x: 0, y: 0 },
      data: {},
      related: [],
    });
  };

  return (
    <div className='relative'>
      <svg className='w-screen h-screen absolute'></svg>
      <DndContext onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
        {Object.values(components).map((component) => {
          switch (component.type) {
            case 'START': {
              return <StartNode id={component.type + component.id} top={component.position.y} left={component.position.x} key={component.id}
                activeId={currentLineId} activeLineId={setCurrentLineId} updateComponentPosition={updateComponentPosition}>
                {component.id}
              </StartNode>;
            }
            case 'NORMAL': {
              return <Draggable id={component.type + component.id} top={component.position.y} left={component.position.x} key={component.id}
                activeId={currentLineId} activeLineId={setCurrentLineId} updateComponentPosition={updateComponentPosition}>
                {component.id}
              </Draggable>;
            }
            default: {
              return <></>;
            }
          }
        })}
        {/* <StartNode id="draggable-1" top={y} left={x} activeId={currentLineId} activeLineId={setCurrentLineId} updatePosition={setCurrentLinePosition} >Drag me 1</StartNode> */}
        {/* <Draggable id="draggable-1" top={y} left={x} activeLineId={setCurrentLineId} updatePosition={setCurrentLinePosition} >Drag me 1</Draggable> */}
        {/* <Draggable id="draggable-2" top={y2} left={x2} activeId={currentLineId} activeLineId={setCurrentLineId} updatePosition={setCurrentLinePosition}>Drag me 2</Draggable> */}
      </DndContext>
      <div className='fixed right-0 w-20 h-screen border'>
        <button onClick={() => handleAddClick('START')}>add</button>
        <button onClick={() => handleAddClick('NORMAL')}>add</button>
      </div>
    </div>
  );
}

export default App;
