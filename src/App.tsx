import DraggableDiv from './custom-components/DragDiv';
import './App.css';
import { forwardRef } from 'react';

function App() {
  const DraggableContent = forwardRef<HTMLDivElement>((props, ref) => {
    return (
      <div ref={ref} {...props}>
        <button>
          Drag Me btn
        </button>
      </div>
    );
  })
  return (
    <div className="container">
      <div className="static-div" style={{ top: '50px', left: '50px' }}>Div 1</div>
      <div className="static-div" style={{ top: '50px', right: '50px' }}>Div 2</div>
      <div className="static-div" style={{ bottom: '50px', left: '50px' }}>Div 3</div>
      <div className="static-div" style={{ bottom: '50px', right: '50px' }}>Div 4</div>
      {/* {
        new Array(100).fill(100).map((_, i) => {
          return <div key={i} className="static-div" style={{ top: `${i * 50}px`, left: `${i * 50}px` }}>Div {i + 5}</div>
        })
      } */}
      <DraggableDiv Content={DraggableContent} />
    </div>
  );
}

export default App;

