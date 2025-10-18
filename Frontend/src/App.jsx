import { Navbar } from './components/Navbar';
import { PipelineUI } from './components/ui';

function App() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar onTabChange={() => {}} />
      <div className="pt-4">
        <PipelineUI />
      </div>
    </div>
  );
}

export default App;
