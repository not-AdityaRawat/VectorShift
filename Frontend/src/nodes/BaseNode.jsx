import { Handle } from 'reactflow';
import { CircleX } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useStore } from '../store';

export const BaseNode = ({ id, data, config }) => {
  const {
    title,
    fields = [],
    handles = [],
    icon,
    bgColor = 'bg-blue-300'
  } = config;
  const { onNodesChange } = useStore();

  // Resolve icon: allow passing a component or a string name (e.g. "Activity")
  const Icon = icon
    ? (typeof icon === 'string' ? LucideIcons[icon] : icon)
    : null;

  const handleDelete = () => {
    onNodesChange([{ type: 'remove', id }]);
  };

  return (
    <div className={`w-56 h-auto border border-black rounded-sm p-2.5 ${bgColor} relative`}>
      {/* Header */}
      <div className="flex flex-col bg-opacity-20 mb-2.5 p-3 gap-1 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && <Icon size={16} />}
            <span className="font-bold text-sm">{title}</span>
          </div>
          <CircleX size={16} className='cursor-pointer hover:text-red-700' onClick={handleDelete}/>
        </div>
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
            />
          )}
          {field.type === 'textarea' && (
            <textarea
              value={data[field.name] || ''}
              onChange={(e) => field.onChange(id, field.name, e.target.value)}
              className="w-full px-1.5 py-1 border border-gray-300 rounded text-xs font-mono overflow-hidden resize-vertical min-h-[60px]"
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

      {/* Dynamic Handles */}
      {handles.map((handle, index) => (
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
