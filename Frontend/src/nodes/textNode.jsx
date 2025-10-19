// textNode.js

import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { ChartNoAxesColumn, CircleX, TextInitial, Type } from 'lucide-react';
import { useStore } from '../store';

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const [nodeWidth, setNodeWidth] = useState('w-56');
  const textareaRef = useRef(null);
  const { onNodesChange } = useStore();

  // Extract variables from text (e.g., {{variable_name}})
  useEffect(() => {
    const regex = /\{\{([a-zA-Z_$][a-zA-Z0-9_$]*)\}\}/g;
    const matches = [...currText.matchAll(regex)];
    const extractedVars = [...new Set(matches.map(match => match[1]))]; // Remove duplicates
    setVariables(extractedVars);
  }, [currText]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [currText]);

  // Calculate node width based on text length
  useEffect(() => {
    const lines = currText.split('\n');
    const maxLineLength = Math.max(...lines.map(line => line.length), 10);
    const calculatedWidth = Math.max(200, Math.min(400, maxLineLength * 8 + 40));
    setNodeWidth(`w-[${calculatedWidth}px]`);
  }, [currText]);

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
  };

  const handleDelete = () => {
    onNodesChange([{ type: 'remove', id }]);
  };  
  
  return (
    <div className={`${nodeWidth} h-auto border border-black rounded-sm p-2.5 bg-violet-400 relative`}>
      {/* Header */}
      <div className="flex flex-col bg-violet-100 mb-2.5 p-3 gap-1 rounded">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TextInitial size={16} />
            <span className="font-bold text-sm">Text</span>
          </div>
          <CircleX size={16} className='cursor-pointer hover:text-red-700' onClick={handleDelete}/>
        </div>
        <div className="text-xs font-mono text-gray-700">Parse data of different types</div>
      </div>
      <div className="mb-2.5">
        <label className="block text-xs font-medium mb-1 text-slate-200">
          Text:
        </label>
        <textarea
          ref={textareaRef}
          value={currText}
          onChange={handleTextChange}
          className="w-full px-1.5 py-1 border border-gray-300 rounded text-xs font-mono overflow-hidden resize-vertical min-h-[60px]"
        />
      </div>

      {/* Display detected variables */}
      {variables.length > 0 && (
        <div className="text-xs text-gray-600 mt-1 p-1 bg-gray-100 rounded">
          Variables: {variables.join(', ')}
        </div>
      )}

      {/* Dynamic Input Handles for Variables */}
      {variables.map((variable, index) => {
        const totalVars = variables.length;
        const spacing = 100 / (totalVars + 1);
        const topPosition = `${spacing * (index + 1)}%`;
        
        return (
          <Handle
            key={`var-${variable}`}
            type="target"
            position={Position.Left}
            id={`${id}-${variable}`}
            style={{
              top: topPosition,
              background: '#555'
            }}
          >
            <div className="absolute left-[-60px] top-1/2 -translate-y-1/2 text-xs text-gray-600 whitespace-nowrap bg-white px-1 py-0.5 rounded border border-gray-300">
              {variable}
            </div>
          </Handle>
        );
      })}

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{
          top: '50%',
          background: '#555'
        }}
      />
    </div>
  );
}
