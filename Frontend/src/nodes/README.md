# Node Abstraction System

## Overview

This codebase now uses a node abstraction system that eliminates code duplication and makes it easy to create and maintain React Flow nodes.

## Architecture

### Core Files

1. **`BaseNode.js`** - The base component that renders all nodes
   - Handles layout, styling, and field rendering
   - Supports multiple field types: text, textarea, select, display
   - Dynamically renders handles based on configuration

2. **`nodeFactory.js`** - Factory function for creating nodes
   - Takes a configuration object
   - Returns a React component compatible with React Flow

### Existing Nodes (Refactored)

All existing nodes have been refactored to use the abstraction:

- **`inputNode.js`** - Input node with name and type fields
- **`llmNode.js`** - LLM node with multiple handles
- **`outputNode.js`** - Output node with name and type fields
- **`textNode.js`** - Text node with textarea input

## Creating a New Node

### Simple Example

```javascript
import { Position } from 'reactflow';
import { createNode } from './nodeFactory';

export const MyNode = createNode({
  title: 'My Node',
  fields: [
    {
      label: 'Name',
      name: 'nodeName',
      type: 'text',
      onChange: (id, field, value) => {
        // Handle change
      }
    }
  ],
  handles: [
    {
      type: 'target',
      position: Position.Left,
      id: 'input',
      top: '50%'
    },
    {
      type: 'source',
      position: Position.Right,
      id: 'output',
      top: '50%'
    }
  ]
});
```

### Advanced Example with State

```javascript
import { useState } from 'react';
import { Position } from 'reactflow';
import { createNode } from './nodeFactory';

export const AdvancedNode = ({ id, data }) => {
  const [param1, setParam1] = useState(data?.param1 || 'default');
  const [param2, setParam2] = useState(data?.param2 || 'option1');

  const NodeComponent = createNode({
    title: 'Advanced Node',
    fields: [
      {
        label: 'Parameter 1',
        name: 'param1',
        type: 'textarea',
        onChange: (id, field, value) => setParam1(value)
      },
      {
        label: 'Parameter 2',
        name: 'param2',
        type: 'select',
        options: ['option1', 'option2', 'option3'],
        onChange: (id, field, value) => setParam2(value)
      }
    ],
    handles: [
      {
        type: 'target',
        position: Position.Left,
        id: 'input',
        top: '50%'
      },
      {
        type: 'source',
        position: Position.Right,
        id: 'output',
        top: '50%'
      }
    ],
    style: {
      width: 250,
      backgroundColor: '#f5f5f5'
    }
  });

  return <NodeComponent id={id} data={{ param1, param2 }} />;
};
```

## Configuration Options

### Field Types

- **`text`** - Single-line text input
- **`textarea`** - Multi-line text input
- **`select`** - Dropdown with options
- **`display`** - Read-only text display

### Field Configuration

```javascript
{
  label: 'Field Label',      // Optional - shown above the field
  name: 'fieldName',          // Required - data key
  type: 'text',               // Required - field type
  onChange: (id, field, value) => {},  // Required - change handler
  options: ['opt1', 'opt2'],  // Required for 'select' type
  content: 'Display text'     // Required for 'display' type
}
```

### Handle Configuration

```javascript
{
  type: 'source' | 'target',  // Required
  position: Position.Left | Position.Right | Position.Top | Position.Bottom,
  id: 'handleId',             // Required - unique within node
  top: '50%',                 // Optional - vertical position
  style: {}                   // Optional - custom styles
}
```

### Style Customization

Pass a `style` object to override default node styles:

```javascript
createNode({
  title: 'Styled Node',
  fields: [...],
  handles: [...],
  style: {
    width: 250,
    backgroundColor: '#f0f0f0',
    borderColor: '#333',
    borderRadius: '12px'
  }
})
```

## Benefits

1. **DRY Principle** - No code duplication across nodes
2. **Consistency** - All nodes share the same visual style
3. **Easy Updates** - Change `BaseNode.js` to update all nodes
4. **Quick Creation** - New nodes require only configuration
5. **Type Safety Ready** - Can be easily typed with TypeScript
6. **Maintainable** - Centralized styling and behavior

## Updating Styles Globally

To change the appearance of all nodes, edit `BaseNode.js`:

```javascript
// In BaseNode.js, modify the base styles:
<div style={{
  width: 200,
  height: 'auto',
  border: '2px solid #333',     // Change border
  borderRadius: '12px',          // Change radius
  padding: '15px',               // Change padding
  backgroundColor: '#fafafa',    // Change background
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',  // Add shadow
  ...style
}}>
```

## Migration Notes

- All existing nodes maintain their original behavior
- State management (useState) is preserved for nodes that need it
- The abstraction is backwards compatible with the existing codebase
- No changes required to `ui.js` or other files that use these nodes
