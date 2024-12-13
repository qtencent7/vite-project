import React, { useState, useRef, useEffect } from 'react';
import { useSnap } from '../utils/useSnap';
import { draggableDiv, distanceLine, distanceLabel, dottedLine } from '../styles/dragDiv';
import { calculateDistance, type Distance } from '../utils/calculateDistance';

interface Props {
  Content?: React.FC<any>;
  initialPosition?: { x: number; y: number };
  onDragStart?: () => void;
  onDragEnd?: () => void;
  className?: string;
}

const DraggableDiv = ({ Content, initialPosition = { x: 100, y: 100 }, onDragStart, onDragEnd, className }: Props) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [nearestEdges, setNearestEdges] = useState<Distance | null>(null);
  const divRef = useRef<HTMLDivElement>(null);

  // 使用磁吸钩子
  const { handleSnap, snappedEdges } = useSnap({
    threshold: 5,
    elementRef: divRef,
    edges: nearestEdges?.edges || []
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    onDragStart?.();
    const rect = divRef.current?.getBoundingClientRect();
    const canvasRect = document.getElementById('canvas-container')?.getBoundingClientRect();
    
    if (rect && canvasRect) {
      setOffset({
        x: e.clientX - (rect.left - canvasRect.left),
        y: e.clientY - (rect.top - canvasRect.top)
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const canvasRect = document.getElementById('canvas-container')?.getBoundingClientRect();
    if (!canvasRect) return;

    const newPosition = {
      x: e.clientX - offset.x,
      y: e.clientY - offset.y - canvasRect.top
    };

    // 先计算最近的边
    if (divRef.current) {
      setNearestEdges(calculateDistance(divRef.current));
    }

    // 然后处理磁吸
    const { position: snappedPosition, snapped } = handleSnap(newPosition);

    // 根据吸附状态设置最终位置
    setPosition({
      x: snapped.horizontal ? snappedPosition.x : newPosition.x,
      y: snapped.vertical ? snappedPosition.y : newPosition.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setNearestEdges(null); // 清除边缘数据
    onDragEnd?.();
  };

  useEffect(() => {
    // if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    // }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset, nearestEdges]);

  return (
    <>
      <div
        ref={divRef}
        className={`${draggableDiv({
          type: 'draggable',
          className: 'inline-block !bg-transparent !shadow-none'
        })} ${className || ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
      >
        {Content ? <Content /> : 'Drag me'}
      </div>

      {
      isDragging && 
      nearestEdges && nearestEdges.edges.map((edge, index) => (
        <React.Fragment key={index}>
          {/* 测量线 */}
          <div
            className={distanceLine({ direction: edge.type === 'left' || edge.type === 'right' ? 'horizontal' : 'vertical' })}
            style={{
              left: edge.x1,
              top: edge.y1,
              width: edge.type === 'left' || edge.type === 'right'
                ? `${Math.abs(edge.x2 - edge.x1)}px`
                : '2px',
              height: edge.type === 'top' || edge.type === 'bottom'
                ? `${Math.abs(edge.y2 - edge.y1)}px`
                : '2px'
            }}
          >
            <span className={distanceLabel({ 
              direction: edge.type === 'left' || edge.type === 'right' ? 'horizontal' : 'vertical' 
            })}>
              {`${Math.round(edge.distance)}px`}
            </span>
          </div>

          {/* 延长线 */}
          {edge.needsExtension && edge.extensionLine && (
            <div
              className={dottedLine({
                direction: edge.type === 'left' || edge.type === 'right' ? 'vertical' : 'horizontal'
              })}
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