import { useState, useEffect, RefObject } from 'react';

interface Edge {
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
}

interface SnapResult {
  position: { x: number; y: number };
  snapped: { horizontal: boolean; vertical: boolean };
}

interface UseSnapProps {
  threshold?: number;
  elementRef: RefObject<HTMLElement>;
  edges?: Edge[];
}

export const useSnap = ({ threshold = 5, elementRef, edges = [] }: UseSnapProps) => {
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [snappedEdges, setSnappedEdges] = useState({
    horizontal: false,
    vertical: false
  });

  // 监听 Shift 键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleSnap = (newPosition: { x: number; y: number }): SnapResult => {
    // 如果按住 Shift 键或没有元素引用，返回原始位置
    if (isShiftPressed || !elementRef.current) {
      return {
        position: newPosition,
        snapped: { horizontal: false, vertical: false }
      };
    }

    let snapped = { horizontal: false, vertical: false };
    let finalPosition = { ...newPosition };

    console.log('Snapping with edges:', edges);
    console.log('Current position:', newPosition);

    edges.forEach(edge => {
      console.log('Processing edge:', edge.type, 'distance:', edge.distance);
      if (edge.type === 'left' || edge.type === 'right') {
        // 水平方向的吸附
        if (Math.abs(edge.distance) < threshold) {
          console.log('Snapping horizontally to', edge.type, 'edge');
          if (edge.type === 'left') {
            finalPosition.x = edge.x2;
          } else {
            finalPosition.x = edge.x2;
          }
          snapped.horizontal = true;
        }
      } else {
        // 垂直方向的吸附
        if (Math.abs(edge.distance) < threshold) {
          console.log('Snapping vertically to', edge.type, 'edge');
          if (edge.type === 'top') {
            finalPosition.y = edge.y2;
          } else {
            finalPosition.y = edge.y2;
          }
          snapped.vertical = true;
        }
      }
    });

    console.log('Final position:', finalPosition);
    console.log('Snapped:', snapped);

    // 更新吸附状态
    setSnappedEdges(snapped);

    return { position: finalPosition, snapped };
  };

  return {
    handleSnap,
    snappedEdges,
    isShiftPressed,
  };
};
