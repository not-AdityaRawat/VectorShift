import { useState, useEffect, useRef, useMemo, memo } from 'react';
import { Handle, Position } from 'reactflow';
import { CircleX } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useStore } from '../store';

const BaseNodeComponent = ({ id, data, config }) => {
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
  
  const { onNodesChange, updateNodeField, getAvailableVariables, autoConnectVariable } = useStore();
  const [variables, setVariables] = useState([]);
  const [nodeWidth, setNodeWidth] = useState('w-56');
  const [editableNodeTitle, setEditableNodeTitle] = useState(data?.[titleFieldName] || title);
  const textareaRef = useRef(null);
  const isUpdatingRef = useRef(false);
  
  // Autocomplete state
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteSearch, setAutocompleteSearch] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [activeFieldName, setActiveFieldName] = useState(null);
  const autocompleteRef = useRef(null);
  
  // Local state for each field to ensure responsive UI
  const [fieldValues, setFieldValues] = useState(() => {
    const initialValues = {};
    fields.forEach(field => {
      if (field.name) {
        initialValues[field.name] = data?.[field.name] || '';
      }
    });
    return initialValues;
  });

  // Sync local state with store data when it changes from outside
  useEffect(() => {
    // Skip sync if we're the ones who triggered the update
    if (isUpdatingRef.current) {
      isUpdatingRef.current = false;
      return;
    }
    
    let hasUpdates = false;
    const updates = {};
    
    fields.forEach(field => {
      if (field.name && data?.[field.name] !== undefined) {
        const storeValue = data[field.name];
        const localValue = fieldValues[field.name];
        // Only update if the store value is actually different
        if (storeValue !== localValue) {
          updates[field.name] = storeValue;
          hasUpdates = true;
        }
      }
    });
    
    if (hasUpdates) {
      setFieldValues(prev => ({ ...prev, ...updates }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Memoize the specific field value to prevent unnecessary re-renders during dragging
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fieldValue = useMemo(() => fieldValues[variableFieldName], [fieldValues[variableFieldName]]);

  // Compute dynamic handle IDs based on field values
  const dynamicHandles = useMemo(() => {
    return handles.map(handle => {
      // If handle.dynamicId is set, use the field's value as the handle ID
      if (handle.dynamicId) {
        const dynamicValue = fieldValues[handle.dynamicId];
        return {
          ...handle,
          id: dynamicValue || handle.id || 'value'
        };
      }
      return handle;
    });
  }, [handles, fieldValues]);

  // Resolve icon: allow passing a component or a string name (e.g. "Activity")
  const Icon = icon
    ? (typeof icon === 'string' ? LucideIcons[icon] : icon)
    : null;

  // Extract variables from text (e.g., {{variable_name}})
  useEffect(() => {
    if (enableVariableExtraction && fieldValue) {
      const regex = /\{\{([a-zA-Z_$][a-zA-Z0-9_$]*)\}\}/g;
      const matches = [...fieldValue.matchAll(regex)];
      const extractedVars = [...new Set(matches.map(match => match[1]))];
      setVariables(extractedVars);
      
      // Auto-connect each detected variable to its source
      extractedVars.forEach(varName => {
        autoConnectVariable(id, varName);
      });
    } else if (enableVariableExtraction) {
      setVariables([]);
    }
  }, [fieldValue, enableVariableExtraction, id, autoConnectVariable]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (autoResize && textareaRef.current && fieldValue) {
      // Defer DOM manipulation to avoid interfering with React's render cycle
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
      });
    }
  }, [fieldValue, autoResize]);

  // Calculate node width based on content
  useEffect(() => {
    if (autoResize && fieldValue) {
      const lines = fieldValue.split('\n');
      const maxLineLength = Math.max(...lines.map(line => line.length), 10);
      const calculatedWidth = Math.max(200, Math.min(400, maxLineLength * 8 + 40));
      setNodeWidth(`w-[${calculatedWidth}px]`);
    }
  }, [fieldValue, autoResize]);

  const handleDelete = () => {
    onNodesChange([{ type: 'remove', id }]);
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setEditableNodeTitle(newTitle);
    updateNodeField(id, titleFieldName, newTitle);
  };

  const handleFieldChange = (fieldName, value, cursorPos = null) => {
    // Update local state immediately for responsive UI
    setFieldValues(prev => ({ ...prev, [fieldName]: value }));
    // Mark that we're updating to prevent sync loop
    isUpdatingRef.current = true;
    // Also update the store
    updateNodeField(id, fieldName, value);
    
    // Check for {{ trigger for autocomplete
    if (cursorPos !== null) {
      const textBeforeCursor = value.substring(0, cursorPos);
      const lastTwoBraces = textBeforeCursor.lastIndexOf('{{');
      
      if (lastTwoBraces !== -1) {
        // Found {{, check if there's no closing }}
        const textAfterBraces = textBeforeCursor.substring(lastTwoBraces);
        if (!textAfterBraces.includes('}}')) {
          // Show autocomplete
          const searchTerm = textAfterBraces.substring(2); // Remove {{
          setAutocompleteSearch(searchTerm);
          setActiveFieldName(fieldName);
          setCursorPosition(cursorPos);
          setShowAutocomplete(true);
        } else {
          setShowAutocomplete(false);
        }
      } else {
        setShowAutocomplete(false);
      }
    }
  };
  
  // Handle autocomplete selection
  const handleAutocompleteSelect = (variableName) => {
    if (!activeFieldName) return;
    
    const currentValue = fieldValues[activeFieldName] || '';
    const textBeforeCursor = currentValue.substring(0, cursorPosition);
    const textAfterCursor = currentValue.substring(cursorPosition);
    
    // Find the {{ before cursor
    const lastBracesIndex = textBeforeCursor.lastIndexOf('{{');
    if (lastBracesIndex === -1) return;
    
    // Replace from {{ to cursor with {{variableName}}
    const newValue = 
      textBeforeCursor.substring(0, lastBracesIndex) + 
      `{{${variableName}}}` + 
      textAfterCursor;
    
    // Update the field
    setFieldValues(prev => ({ ...prev, [activeFieldName]: newValue }));
    isUpdatingRef.current = true;
    updateNodeField(id, activeFieldName, newValue);
    
    // Close autocomplete
    setShowAutocomplete(false);
    setAutocompleteSearch('');
    setActiveFieldName(null);
  };
  
  // Get filtered available variables
  const availableVariables = useMemo(() => {
    if (!showAutocomplete) return [];
    
    const allVariables = getAvailableVariables();
    
    // Filter by search term
    if (autocompleteSearch) {
      return allVariables.filter(v => 
        v.name.toLowerCase().includes(autocompleteSearch.toLowerCase())
      );
    }
    
    return allVariables;
  }, [showAutocomplete, autocompleteSearch, getAvailableVariables]);
  
  // Close autocomplete when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setShowAutocomplete(false);
      }
    };
    
    if (showAutocomplete) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showAutocomplete]);

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
            <div className="relative">
              <input
                type="text"
                value={fieldValues[field.name] || ''}
                onChange={(e) => {
                  const cursorPos = e.target.selectionStart;
                  handleFieldChange(field.name, e.target.value, cursorPos);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setShowAutocomplete(false);
                  }
                }}
                className="w-full px-1.5 py-1 border border-gray-300 rounded text-xs overflow-hidden"
                placeholder={field.placeholder || ''}
              />
              {showAutocomplete && activeFieldName === field.name && (
                <div 
                  ref={autocompleteRef}
                  className="absolute z-50 mt-1 w-48 bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto"
                  style={{ top: '100%', left: 0 }}
                >
                  {availableVariables.length > 0 ? (
                    availableVariables.map((variable, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-xs"
                        onClick={() => handleAutocompleteSelect(variable.name)}
                      >
                        <div className="font-semibold">{variable.name}</div>
                        <div className="text-gray-500 text-[10px]">{variable.type}</div>
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-xs text-gray-500">No variables found</div>
                  )}
                </div>
              )}
            </div>
          )}
          {field.type === 'textarea' && (
            <div className="relative">
              <textarea
                ref={field.name === variableFieldName && autoResize ? textareaRef : null}
                value={fieldValues[field.name] || ''}
                onChange={(e) => {
                  const cursorPos = e.target.selectionStart;
                  handleFieldChange(field.name, e.target.value, cursorPos);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setShowAutocomplete(false);
                  }
                }}
                className="w-full px-1.5 py-1 border border-gray-300 rounded text-xs font-mono overflow-hidden resize-vertical min-h-[60px]"
                placeholder={field.placeholder || ''}
              />
              {showAutocomplete && activeFieldName === field.name && (
                <div 
                  ref={autocompleteRef}
                  className="absolute z-50 mt-1 w-48 bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto"
                  style={{ top: '100%', left: 0 }}
                >
                  {availableVariables.length > 0 ? (
                    availableVariables.map((variable, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-xs"
                        onClick={() => handleAutocompleteSelect(variable.name)}
                      >
                        <div className="font-semibold">{variable.name}</div>
                        <div className="text-gray-500 text-[10px]">{variable.type}</div>
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-xs text-gray-500">No variables found</div>
                  )}
                </div>
              )}
            </div>
          )}
          {field.type === 'select' && (
            <select
              value={fieldValues[field.name] || field.options[0]}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
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
              {field.content || fieldValues[field.name] || ''}
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
            isConnectable={true}
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
      {showHandles && dynamicHandles.map((handle, index) => (
        <Handle
          key={index}
          type={handle.type}
          position={handle.position}
          id={`${id}-${handle.id}`}
          isConnectable={true}
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

// Memoize the component to prevent re-renders when other nodes change
export const BaseNode = memo(BaseNodeComponent, (prevProps, nextProps) => {
  // Return true if props are equal (skip re-render)
  // Return false if props are different (allow re-render)
  if (prevProps.id !== nextProps.id) return false;
  if (prevProps.config !== nextProps.config) return false;
  
  // Deep compare data object
  const prevData = JSON.stringify(prevProps.data);
  const nextData = JSON.stringify(nextProps.data);
  
  return prevData === nextData;
});
