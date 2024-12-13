import React, { useState, useRef, useEffect, ReactNode } from 'react';

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
interface Props {
  Content?: React.FC;
}
const DraggableDiv = (props: Props) => {
  const { Content } = props;
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [nearestEdges, setNearestEdges] = useState<Distance | null>(null);
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = divRef.current?.getBoundingClientRect();
    if (rect) {
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const calculateDistance = () => {
    if (!divRef.current) return;

    const draggableRect = divRef.current.getBoundingClientRect();
    const staticDivs = document.getElementsByClassName('static-div');
    let minTotalDistance = Infinity;
    let closestDiv: Distance | null = null;

    Array.from(staticDivs).forEach((div) => {
      const staticRect = div.getBoundingClientRect();
      const centerDistance = Math.sqrt(
        Math.pow((draggableRect.left + draggableRect.width/2) - (staticRect.left + staticRect.width/2), 2) +
        Math.pow((draggableRect.top + draggableRect.height/2) - (staticRect.top + staticRect.height/2), 2)
      );

      if (centerDistance < minTotalDistance) {
        minTotalDistance = centerDistance;

        // 判断拖动div的位置
        const isAbove = draggableRect.bottom < staticRect.top;
        const isBelow = draggableRect.top > staticRect.bottom;
        const isLeft = draggableRect.right  < staticRect.left;
        const isRight = draggableRect.left > staticRect.right;

        // 根据位置选择要计算的边
        let selectedEdges = [];

        if (isLeft) {
          selectedEdges.push({
            type: 'left' as const,
            distance: Math.abs(draggableRect.right - staticRect.left),
            x1: draggableRect.right,
            y1: draggableRect.top + draggableRect.height/2,
            x2: staticRect.left,
            y2: draggableRect.top + draggableRect.height/2,
            needsExtension: false
          });
        }
        if (isRight) {
          selectedEdges.push({
            type: 'right' as const,
            distance: Math.abs(draggableRect.left - staticRect.right),
            x1: draggableRect.left,
            y1: draggableRect.top + draggableRect.height/2,
            x2: staticRect.right,
            y2: draggableRect.top + draggableRect.height/2,
            needsExtension: false
          });
        }
        if (isAbove) {
          selectedEdges.push({
            type: 'top' as const,
            distance: Math.abs(draggableRect.bottom - staticRect.top),
            x1: draggableRect.left + draggableRect.width/2,
            y1: draggableRect.bottom,
            x2: draggableRect.left + draggableRect.width/2,
            y2: staticRect.top,
            needsExtension: false
          });
        }
        if (isBelow) {
          selectedEdges.push({
            type: 'bottom' as const,
            distance: Math.abs(draggableRect.top - staticRect.bottom),
            x1: draggableRect.left + draggableRect.width/2,
            y1: draggableRect.top,
            x2: draggableRect.left + draggableRect.width/2,
            y2: staticRect.bottom,
            needsExtension: false
          });
        }

        // 如果没有边被选中（说明重叠或部分重叠），选择最近的两条边
        if (selectedEdges.length === 0) {
          selectedEdges = [
            {
              type: 'left' as const,
              distance: Math.abs(draggableRect.left - staticRect.left),
              x1: draggableRect.right,
              y1: draggableRect.top + draggableRect.height/2,
              x2: staticRect.left,
              y2: draggableRect.top + draggableRect.height/2,
              needsExtension: false
            },
            {
              type: 'top' as const,
              distance: Math.abs(draggableRect.top - staticRect.top),
              x1: draggableRect.left + draggableRect.width/2,
              y1: draggableRect.bottom,
              x2: draggableRect.left + draggableRect.width/2,
              y2: staticRect.top,
              needsExtension: false
            }
          ];
        }

        // 如果只有一条边被选中，添加距离最近的另一条边
        if (selectedEdges.length === 1) {
          const otherEdges = [
            {
              type: 'left' as const,
              distance: Math.abs(draggableRect.left - staticRect.left),
              x1: draggableRect.right,
              y1: draggableRect.top + draggableRect.height/2,
              x2: staticRect.left,
              y2: draggableRect.top + draggableRect.height/2,
              needsExtension: false
            },
            {
              type: 'right' as const,
              distance: Math.abs(draggableRect.left - staticRect.right),
              x1: draggableRect.left,
              y1: draggableRect.top + draggableRect.height/2,
              x2: staticRect.right,
              y2: draggableRect.top + draggableRect.height/2,
              needsExtension: false
            },
            {
              type: 'top' as const,
              distance: Math.abs(draggableRect.top - staticRect.top),
              x1: draggableRect.left + draggableRect.width/2,
              y1: draggableRect.bottom,
              x2: draggableRect.left + draggableRect.width/2,
              y2: staticRect.top,
              needsExtension: false
            },
            {
              type: 'bottom' as const,
              distance: Math.abs(draggableRect.top - staticRect.bottom),
              x1: draggableRect.left + draggableRect.width/2,
              y1: draggableRect.top,
              x2: draggableRect.left + draggableRect.width/2,
              y2: staticRect.bottom,
              needsExtension: false
            }
          ].filter(edge => edge.type !== selectedEdges[0].type);

          otherEdges.sort((a, b) => a.distance - b.distance);
          selectedEdges.push(otherEdges[0]);
        }

        // 检查哪条边需要延长线
        selectedEdges.forEach(edge => {
          if (edge.type === 'left' || edge.type === 'right') {
            if (draggableRect.top > staticRect.bottom || draggableRect.bottom < staticRect.top) {
              edge.needsExtension = true;
              // 计算延长线的坐标
              // debugger
              console.log('div', div)
              const extensionY = draggableRect.bottom < staticRect.top ? staticRect.top : staticRect.bottom;
              edge.extensionLine = {
                x1: edge.type === 'left' ? staticRect.left : staticRect.right,
                y1: extensionY,
                x2: edge.type === 'left' ? staticRect.left : staticRect.right,
                y2: edge.y2
              };
            }
          } else {
            if (draggableRect.left > staticRect.right || draggableRect.right < staticRect.left) {
              edge.needsExtension = true;
              // 计算延长线的坐标
              const extensionX = draggableRect.left > staticRect.right ? staticRect.right : staticRect.left;
              edge.extensionLine = {
                x1: extensionX,
                y1: edge.type === 'top' ? staticRect.top : staticRect.bottom,
                x2: edge.x2,
                y2: edge.type === 'top' ? staticRect.top : staticRect.bottom
              };
            }
          }
        });

        closestDiv = {
          div: div as HTMLElement,
          edges: selectedEdges
        };
      }
    });

    setNearestEdges(closestDiv);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - offset.x;
    const newY = e.clientY - offset.y;
    
    setPosition({ x: newX, y: newY });
    calculateDistance();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset]);

  return (
    <>
      {Content ?
        <Content           
          ref={divRef}
          style={{
            position: 'absolute',
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: '100px',
            height: '100px',
            backgroundColor: '#4CAF50',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            zIndex: 1000
          }}
          onMouseDown={handleMouseDown}
        />
        :
        <div
          ref={divRef}
          style={{
            position: 'absolute',
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: '100px',
            height: '100px',
            backgroundColor: '#4CAF50',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            zIndex: 1000
          }}
          onMouseDown={handleMouseDown}
        >
          Drag me
        </div>
      }
      {nearestEdges && nearestEdges.edges.map((edge, index) => (
        <React.Fragment key={index}>
          {/* 测量线 */}
          <div
            className={`distance-line ${edge.type === 'left' || edge.type === 'right' ? 'horizontal' : 'vertical'}`}
            style={{
              left: Math.min(edge.x1, edge.x2),
              top: Math.min(edge.y1, edge.y2),
              width: edge.type === 'left' || edge.type === 'right'
                ? `${Math.abs(edge.x2 - edge.x1)}px`
                : '2px',
              height: edge.type === 'top' || edge.type === 'bottom'
                ? `${Math.abs(edge.y2 - edge.y1)}px`
                : '2px'
            }}
          >
            <span className="distance-label" style={{
              top: edge.type === 'left' || edge.type === 'right' ? '-20px': `${edge.distance / 2}px`,
              left: edge.type === 'left' || edge.type === 'right' ? `${edge.distance / 2}px` : 0
            }}>
              {`${Math.round(edge.distance)}px`}
            </span>
          </div>

          {/* 延长线 */}
          {edge.needsExtension && edge.extensionLine && (
            <div
              className="dotted-line"
              style={{
                left: Math.min(edge.extensionLine.x1, edge.extensionLine.x2),
                top: Math.min(edge.extensionLine.y1, edge.extensionLine.y2),
                width: edge.type === 'left' || edge.type === 'right'
                  ? '1px'
                  : `${Math.abs(edge.extensionLine.x2 - edge.extensionLine.x1)}px`,
                height: edge.type === 'top' || edge.type === 'bottom'
                  ? '1px'
                  : `${Math.abs(edge.extensionLine.y2 - edge.extensionLine.y1)}px`
              }}
            />
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default DraggableDiv;