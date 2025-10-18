// textNode.js

import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { Type } from 'lucide-react';

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const textareaRef = useRef(null);

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

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
  };

  // Calculate node width based on text length
  const calculateWidth = () => {
    const lines = currText.split('\n');
    const maxLineLength = Math.max(...lines.map(line => line.length), 10);
    return Math.max(200, Math.min(400, maxLineLength * 8 + 40)); // Min 200, Max 400
  };

  return (
    <div style={{
      width: calculateWidth(),
      height: 'auto',
      border: '1px solid black',
      borderRadius: '8px',
      padding: '10px',
      backgroundColor: '#fff',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{
        fontWeight: 'bold',
        marginBottom: '10px',
        fontSize: '14px',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <Type size={16} />
        Text
      </div>

      {/* Text Input */}
      <div style={{ marginBottom: '10px' }}>
        <label style={{
          display: 'block',
          fontSize: '12px',
          marginBottom: '5px'
        }}>
          Text:
        </label>
        <textarea
          ref={textareaRef}
          value={currText}
          onChange={handleTextChange}
          style={{
            width: '100%',
            padding: '5px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '12px',
            minHeight: '60px',
            resize: 'vertical',
            fontFamily: 'monospace',
            overflow: 'hidden'
          }}
        />
      </div>

      {/* Display detected variables */}
      {variables.length > 0 && (
        <div style={{
          fontSize: '10px',
          color: '#666',
          marginTop: '5px',
          padding: '5px',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px'
        }}>
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
            <div style={{
              position: 'absolute',
              left: '-60px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '10px',
              color: '#666',
              whiteSpace: 'nowrap',
              backgroundColor: '#fff',
              padding: '2px 4px',
              borderRadius: '3px',
              border: '1px solid #ccc'
            }}>
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
