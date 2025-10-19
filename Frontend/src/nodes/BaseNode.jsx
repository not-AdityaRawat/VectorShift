import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { CircleX } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useStore } from '../store';

export const BaseNode = ({ id, data, config }) => {
  const {
    title,
    fields = [],
    handles = [],
    icon,
    bgColor = 'bg-blue-300',
    enableVariableExtraction = false,
    variableFieldName = 'text',
    description = null,
    autoResize = false,
    editableTitle = false,
    titleFieldName = 'title',
    showHandles = true
  } = config;
  
  const { onNodesChange, updateNodeField } = useStore();
  const [variables, setVariables] = useState([]);
  const [nodeWidth, setNodeWidth] = useState('w-56');
  const [editableNodeTitle, setEditableNodeTitle] = useState(data?.[titleFieldName] || title);
  const textareaRef = useRef(null);

  // Resolve icon: allow passing a component or a string name (e.g. "Activity")
  const Icon = icon
    ? (typeof icon === 'string' ? LucideIcons[icon] : icon)
    : null;

  // Extract variables from text (e.g., {{variable_name}})
  useEffect(() => {
    if (enableVariableExtraction && data && data[variableFieldName]) {
      const fieldValue = data[variableFieldName];
      const regex = /\{\{([a-zA-Z_$][a-zA-Z0-9_$]*)\}\}/g;
      const matches = [...fieldValue.matchAll(regex)];
      const extractedVars = [...new Set(matches.map(match => match[1]))];
      setVariables(extractedVars);
    } else if (enableVariableExtraction) {
      setVariables([]);
    }
  }, [data, enableVariableExtraction, variableFieldName]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (autoResize && textareaRef.current && data && data[variableFieldName]) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [data, variableFieldName, autoResize]);

  // Calculate node width based on content
  useEffect(() => {
    if (autoResize && data && data[variableFieldName]) {
      const fieldValue = data[variableFieldName];
      const lines = fieldValue.split('\n');
      const maxLineLength = Math.max(...lines.map(line => line.length), 10);
      const calculatedWidth = Math.max(200, Math.min(400, maxLineLength * 8 + 40));
      setNodeWidth(`w-[${calculatedWidth}px]`);
    }
  }, [data, variableFieldName, autoResize]);

  const handleDelete = () => {
    onNodesChange([{ type: 'remove', id }]);
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setEditableNodeTitle(newTitle);
    updateNodeField(id, titleFieldName, newTitle);
  };

  return (
    <div className={`${autoResize ? nodeWidth : 'w-56'} h-auto border border-black rounded-sm p-2.5 ${bgColor} relative`}>
      {/* Header */}
      <div className="flex flex-col bg-opacity-20 mb-2.5 p-3 gap-1 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            {Icon && <Icon size={16} className="flex-shrink-0" />}
            {editableTitle ? (
              <input
                type="text"
                value={editableNodeTitle}
                onChange={handleTitleChange}
                className="font-bold text-sm bg-transparent border-b border-transparent hover:border-gray-400 focus:border-gray-600 focus:outline-none flex-1 px-1"
                placeholder={title}
              />
            ) : (
              <span className="font-bold text-sm">{title}</span>
            )}
          </div>
          <CircleX size={16} className='cursor-pointer hover:text-red-700' onClick={handleDelete}/>
        </div>
        {description && (
          <div className="text-xs font-mono text-gray-700">{description}</div>
        )}
      </div>

      {/* Dynamic Fields */}
      {fields.map((field, index) => (
        <div key={index} className="mb-2.5">
          {field.label && (
            <label className="block text-xs font-medium mb-1 text-slate-200">
              {field.label}:
            </label>
          )}
          {field.type === 'text' && (
            <input
              type="text"
              value={data[field.name] || ''}
              onChange={(e) => field.onChange(id, field.name, e.target.value)}
              className="w-full px-1.5 py-1 border border-gray-300 rounded text-xs overflow-hidden"
              placeholder={field.placeholder || ''}
            />
          )}
          {field.type === 'textarea' && (
            <textarea
              ref={field.name === variableFieldName && autoResize ? textareaRef : null}
              value={data[field.name] || ''}
              onChange={(e) => field.onChange(id, field.name, e.target.value)}
              className="w-full px-1.5 py-1 border border-gray-300 rounded text-xs font-mono overflow-hidden resize-vertical min-h-[60px]"
              placeholder={field.placeholder || ''}
            />
          )}
          {field.type === 'select' && (
            <select
              value={data[field.name] || field.options[0]}
              onChange={(e) => field.onChange(id, field.name, e.target.value)}
              className="w-full px-1.5 py-1 border border-gray-300 rounded text-xs"
            >
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
          {field.type === 'display' && (
            <span className="text-xs text-gray-600 block">
              {field.content || data[field.name] || ''}
            </span>
          )}
        </div>
      ))}

      {/* Display detected variables */}
      {enableVariableExtraction && variables.length > 0 && (
        <div className="text-xs text-gray-600 mt-1 p-1 bg-gray-100 rounded">
          Variables: {variables.join(', ')}
        </div>
      )}

      {/* Dynamic Input Handles for Variables */}
      {enableVariableExtraction && variables.map((variable, index) => {
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

      {/* Static Handles */}
      {showHandles && handles.map((handle, index) => (
        <Handle
          key={index}
          type={handle.type}
          position={handle.position}
          id={`${id}-${handle.id}`}
          style={{
            top: handle.top,
            background: '#555',
            ...handle.style
          }}
        />
      ))}
    </div>
  );
};
