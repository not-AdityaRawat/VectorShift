import { Handle } from 'reactflow';
import * as LucideIcons from 'lucide-react';

export const BaseNode = ({ id, data, config }) => {
  const {
    title,
    fields = [],
    handles = [],
    style = {},
    icon
  } = config;

  // Resolve icon: allow passing a component or a string name (e.g. "Activity")
  const Icon = icon
    ? (typeof icon === 'string' ? LucideIcons[icon] : icon)
    : null;

  return (
    <div style={{
      width: 200,
      height: 'auto',
      border: '1px solid black',
      borderRadius: '8px',
      padding: '10px',
      backgroundColor: '#fff',
      ...style
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
        {Icon && <Icon size={16} />}
        {title}
      </div>

      {/* Dynamic Fields */}
      {fields.map((field, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          {field.label && (
            <label style={{
              display: 'block',
              fontSize: '12px',
              marginBottom: '5px'
            }}>
              {field.label}:
            </label>
          )}
          {field.type === 'text' && (
            <input
              type="text"
              value={data[field.name] || ''}
              onChange={(e) => field.onChange(id, field.name, e.target.value)}
              style={{
                width: '100%',
                padding: '5px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            />
          )}
          {field.type === 'textarea' && (
            <textarea
              value={data[field.name] || ''}
              onChange={(e) => field.onChange(id, field.name, e.target.value)}
              style={{
                width: '100%',
                padding: '5px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '12px',
                minHeight: '60px',
                resize: 'vertical'
              }}
            />
          )}
          {field.type === 'select' && (
            <select
              value={data[field.name] || field.options[0]}
              onChange={(e) => field.onChange(id, field.name, e.target.value)}
              style={{
                width: '100%',
                padding: '5px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
          {field.type === 'display' && (
            <span style={{
              fontSize: '12px',
              display: 'block'
            }}>
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
