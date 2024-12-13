import React, { useState } from 'react'
import DraggableDiv from './custom-components/DragDiv'
import { Button } from './components/ui/button'
import { Form } from './components/ui/form'

type ComponentType = {
  id: string;
  type: string;
  component: React.FC;
  isStatic: boolean;
}

function App() {
  const [droppedComponents, setDroppedComponents] = useState<ComponentType[]>([]);
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);

  const components = {
    'button': Button,
    'form': Form,
  };

  const handleDragStart = (componentType: string) => (e: React.DragEvent) => {
    e.dataTransfer.setData('componentType', componentType);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData('componentType');
    if (componentType && components[componentType as keyof typeof components]) {
      const newComponent: ComponentType = {
        id: `${componentType}-${Date.now()}`,
        type: componentType,
        component: components[componentType as keyof typeof components],
        isStatic: true
      };
      setDroppedComponents(prev => [...prev, newComponent]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleComponentDragStart = (id: string) => {
    setDraggedComponent(id);
    setDroppedComponents(prev =>
      prev.map(comp =>
        comp.id === id ? { ...comp, isStatic: false } : comp
      )
    );
  };

  const handleComponentDragEnd = (id: string) => {
    setDraggedComponent(null);
    setDroppedComponents(prev =>
      prev.map(comp =>
        comp.id === id ? { ...comp, isStatic: true } : comp
      )
    );
  };

  return (
    <div className="flex h-screen">
      {/* 左侧组件面板 */}
      <div className="w-64 bg-muted p-4 border-r border-border">
        <h2 className="text-lg font-semibold mb-4">Components</h2>
        <div className="space-y-2">
          <div
            draggable
            onDragStart={handleDragStart('button')}
            className="p-2 bg-background rounded-md border border-border cursor-move hover:bg-accent/10"
          >
            Button
          </div>
          <div
            draggable
            onDragStart={handleDragStart('form')}
            className="p-2 bg-background rounded-md border border-border cursor-move hover:bg-accent/10"
          >
            Form
          </div>
        </div>
      </div>

      {/* 右侧画布 */}
      <div
        className="flex-1 bg-background p-4 relative"
        id='canvas-container'
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {/* 静态参考元素 */}
        {/* <div className="static-div" style={{ left: '300px', top: '100px' }}>
          Static Element
        </div>
        <div className="static-div" style={{ right: '100px', bottom: '100px' }}>
          Static Element
        </div> */}

        {/* 渲染拖放的组件 */}
        {droppedComponents.map((item) => (
          <DraggableDiv
            key={item.id}
            Content={item.component}
            onDragStart={() => handleComponentDragStart(item.id)}
            onDragEnd={() => handleComponentDragEnd(item.id)}
            className={item.isStatic ? 'static-div' : ''}
          />
        ))}
      </div>
    </div>
  )
}

export default App
