// submit.js
import { Rocket } from 'lucide-react';
import { Button } from './ui/button';
import { useStore } from '../store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);

  const handleSubmit = async () => {
    try {
      // Send pipeline data to backend
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Display alert with results
      const message = `Pipeline Analysis Results:
      
✓ Number of Nodes: ${data.num_nodes}
✓ Number of Edges: ${data.num_edges}
✓ Is DAG (Directed Acyclic Graph): ${data.is_dag ? 'Yes ✓' : 'No ✗'}

${data.is_dag 
  ? '✅ Your pipeline is valid! It forms a proper DAG with no cycles.' 
  : '⚠️ Warning: Your pipeline contains cycles and is not a valid DAG.'}`;

      alert(message);
    } catch (error) {
      alert(`Error submitting pipeline: ${error.message}\n\nMake sure the backend server is running on http://localhost:8000`);
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
      <Button variant="submit" size={'sm'} onClick={handleSubmit}>
        <Rocket />
        Submit
      </Button>
    </div>
  );
};
