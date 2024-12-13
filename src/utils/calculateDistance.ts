export interface Edge {
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

export interface Distance {
  div: HTMLElement;
  edges: Edge[];
}

export function calculateDistance(draggableElement: HTMLElement): Distance | null {
  if (!draggableElement) return null;

  const draggableRectInitial = draggableElement.getBoundingClientRect();
  const staticDivs = document.getElementsByClassName('static-div');
  const canvasRect = document.getElementById('canvas-container')!.getBoundingClientRect();
  const draggableRect = {
    top: draggableRectInitial.top - (canvasRect?.top || 0),
    left: draggableRectInitial.left - (canvasRect?.left || 0),
    bottom: draggableRectInitial.bottom,
    right: draggableRectInitial.right - (canvasRect?.left || 0),
    width: draggableRectInitial.width,
    height: draggableRectInitial.height
  };
  let minTotalDistance = Infinity;
  let closestDiv: Distance | null = null;

  Array.from(staticDivs).forEach((div) => {
    const staticRectInitial = div.getBoundingClientRect();
    const staticRect = {
      top: staticRectInitial.top - (canvasRect?.top || 0),
      left: staticRectInitial.left - (canvasRect?.left || 0),
      bottom: staticRectInitial.bottom,
      right: staticRectInitial.right - (canvasRect?.left || 0),
      width: staticRectInitial.width,
      height: staticRectInitial.height
    };
    const centerDistance = Math.sqrt(
      Math.pow((draggableRect.left + draggableRect.width/2) - (staticRect.left + staticRect.width/2), 2) +
      Math.pow((draggableRect.top + draggableRect.height/2) - (staticRect.top + staticRect.height/2), 2)
    );

    if (centerDistance < minTotalDistance) {
      minTotalDistance = centerDistance;

      // 判断拖动div的位置
      const isAbove = draggableRect.bottom < staticRect.top;
      const isBelow = draggableRect.top > staticRect.bottom;
      const isLeft = draggableRect.right < staticRect.left;
      const isRight = draggableRect.left > staticRect.right;

      // 根据位置选择要计算的边
      let selectedEdges: Edge[] = [];
      if (isLeft) {
        selectedEdges.push({
          type: 'left',
          distance: Math.abs(staticRect.left - draggableRect.right),
          x1: draggableRect.right,
          y1: draggableRect.top,
          x2: staticRect.left,
          y2: draggableRect.top,
          needsExtension: false
        });
      }
      if (isRight) {
        selectedEdges.push({
          type: 'right',
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
          type: 'top',
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
          type: 'bottom',
          distance: Math.abs(draggableRect.top - staticRect.bottom),
          x1: draggableRect.left + draggableRect.width/2,
          y1: staticRect.bottom,
          x2: draggableRect.left + draggableRect.width/2,
          y2: draggableRect.top,
          needsExtension: false
        });
      }

      // 如果没有边被选中（说明重叠或部分重叠），选择最近的两条边
      if (selectedEdges.length === 0) {
        selectedEdges = [
          {
            type: 'left',
            distance: Math.abs(draggableRect.left - staticRect.left),
            x1: draggableRect.right,
            y1: draggableRect.top + draggableRect.height/2,
            x2: staticRect.left,
            y2: draggableRect.top + draggableRect.height/2,
            needsExtension: false
          },
          {
            type: 'top',
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
        let otherEdges: Edge[];
        if (selectedEdges[0].type === 'left' || selectedEdges[0].type === 'right') {
          otherEdges = [
            {
              type: 'top',
              distance: Math.abs(draggableRect.top - staticRect.top),
              x1: draggableRect.left + draggableRect.width/2,
              y1: draggableRect.bottom,
              x2: draggableRect.left + draggableRect.width/2,
              y2: staticRect.top,
              needsExtension: false
            },
            {
              type: 'bottom',
              distance: Math.abs(draggableRect.top - staticRect.bottom),
              x1: draggableRect.left + draggableRect.width/2,
              y1: draggableRect.top,
              x2: draggableRect.left + draggableRect.width/2,
              y2: staticRect.bottom,
              needsExtension: false
            }
          ];
        } else {
          otherEdges = [
            {
              type: 'left',
              distance: Math.abs(draggableRect.left - staticRect.left),
              x1: draggableRect.right,
              y1: draggableRect.top + draggableRect.height/2,
              x2: staticRect.left,
              y2: draggableRect.top + draggableRect.height/2,
              needsExtension: false
            },
            {
              type: 'right',
              distance: Math.abs(draggableRect.left - staticRect.right),
              x1: draggableRect.left,
              y1: draggableRect.top + draggableRect.height/2,
              x2: staticRect.right,
              y2: draggableRect.top + draggableRect.height/2,
              needsExtension: false
            }
          ];
        }
        otherEdges = otherEdges.filter(edge => edge.type !== selectedEdges[0].type);
        otherEdges.sort((a, b) => a.distance - b.distance);
        selectedEdges.push(otherEdges[0]);
      }

      // 检查哪条边需要延长线
      selectedEdges.forEach(edge => {
        if (edge.type === 'left' || edge.type === 'right') {
          if (draggableRect.top > staticRect.bottom || draggableRect.bottom < staticRect.top) {
            edge.needsExtension = true;
            const extensionY = draggableRect.bottom < staticRect.top ? draggableRect.bottom : staticRect.bottom;
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

  return closestDiv;
}
