如何判断拖动的div在静态div的上侧：
如果，draggableDiv.top + draggableDiv.height < staticDiv.top，则在静态div上方

如何判断拖动的div在静态div的左侧：
如果，draggableDiv.left + draggableDiv.width < staticDiv.left，则在静态div左侧

如何判断拖动的div在静态div的右侧：
如果，draggableDiv.left > staticDiv.left + staticDiv.width，则在静态div右侧

如何判断拖动的div在静态div的下方：
如果，draggableDiv.top > staticDiv.top + staticDiv.height，则在静态div下方


对于拖动div而言：

如果同时在静态div的左侧和上侧，则计算拖动div到静态div的左侧和上侧的距离；

如果同时在静态div的左侧和下侧，则计算拖动div到静态div的左侧和下侧的距离；

如果同时在静态div的右侧和上侧，则计算拖动div到静态div的右侧和上侧的距离；

如果同时在静态div的右侧和下侧，则计算拖动div到静态div的右侧和下侧的距离；

```javascript
import React, { useState, useRef, useEffect, forwardRef, ComponentType, ForwardRefRenderFunction } from 'react';

interface Distance {
  div: HTMLElement;
  edges: {
    type: 'left' | 'right' | 'top' | 'bottom';
    distance: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    needsExtension: boolean;
    extensionLine?: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    };
  }[];
}

interface DraggableDivProps {
  Content?: ComponentType<any>;
  style?: React.CSSProperties;
  defaultPosition?: { x: number; y: number };
}

interface DraggableContentProps extends React.HTMLAttributes<HTMLDivElement> {
  ref: React.Ref<HTMLDivElement>;
  style: React.CSSProperties;
}

const DraggableDiv: React.FC<DraggableDivProps> = ({ Content, style: customStyle, defaultPosition = { x: 100, y: 100 } }) => {
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [nearestEdges, setNearestEdges] = useState<Distance | null>(null);
  const divRef = useRef<HTMLDivElement>(null);
{{ ... }}
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: '100px',
    height: '100px',
    backgroundColor: '#4CAF50',
    cursor: isDragging ? 'grabbing' : 'grab',
    userSelect: 'none',
    zIndex: 1000,
    ...customStyle
  };

  const CustomContent = Content ? forwardRef<HTMLDivElement, DraggableContentProps>((props, ref) => (
    <Content {...props} ref={ref} />
  )) : null;

  return (
    <>
      {CustomContent ? (
        <CustomContent
          ref={divRef}
          style={baseStyle}
          onMouseDown={handleMouseDown}
        />
      ) : (
        <div
          ref={divRef}
          style={baseStyle}
          onMouseDown={handleMouseDown}
        >
          Drag me
        </div>
      )}

import DraggableDiv from './custom-components/DragDiv';
import './App.css';
import { forwardRef } from 'react';

function App() {
  const DraggableContent = forwardRef<HTMLDivElement>((props, ref) => {
    return (
      <div {...props} ref={ref} className="custom-draggable">
        <button className="drag-button">
          Drag Me
        </button>
      </div>
    );
  });

  return (
    <div className="container">
      <div className="static-div" style={{ top: '50px', left: '50px' }}>Div 1</div>
      <div className="static-div" style={{ top: '50px', right: '50px' }}>Div 2</div>
      <div className="static-div" style={{ bottom: '50px', left: '50px' }}>Div 3</div>
      <div className="static-div" style={{ bottom: '50px', right: '50px' }}>Div 4</div>
      
      {/* 默认内容的拖动组件 */}
      <DraggableDiv defaultPosition={{ x: 100, y: 100 }} />
      
      {/* 自定义内容的拖动组件 */}
      <DraggableDiv 
        Content={DraggableContent} 
        defaultPosition={{ x: 300, y: 100 }}
        style={{
          width: '120px',
          height: '40px',
          backgroundColor: 'transparent'
        }}
      />
    </div>
  );
}

export default App;
```