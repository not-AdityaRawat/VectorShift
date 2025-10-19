// Example: Creating a new custom node type
// This file demonstrates how to quickly create new nodes using the abstraction

import { useState } from 'react';
import { Position } from 'reactflow';
import { createNode } from './nodeFactory';

// Example 1: Simple API node with static configuration
export const APINode = createNode({
  title: 'API Call',
  fields: [
    {
      label: 'Endpoint',
      name: 'endpoint',
      type: 'text',
      onChange: (id, field, value) => {
        // In a real app, you might update a store here
        console.log(`Node ${id} ${field} changed to ${value}`);
      }
    },
    {
      label: 'Method',
      name: 'method',
      type: 'select',
      options: ['GET', 'POST', 'PUT', 'DELETE'],
      onChange: (id, field, value) => {
        console.log(`Node ${id} ${field} changed to ${value}`);
      }
    },
    {
      type: 'display',
      content: 'Configure your API call'
    }
  ],
  handles: [
    {
      type: 'target',
      position: Position.Left,
      id: 'params',
      top: '30%'
    },
    {
      type: 'target',
      position: Position.Left,
      id: 'body',
      top: '70%'
    },
    {
      type: 'source',
      position: Position.Right,
      id: 'response',
      top: '50%'
    }
  ],
  bgColor: 'bg-blue-300'
});

// Example 2: Transformer node with local state
export const TransformerNode = ({ id, data }) => {
  const [operation, setOperation] = useState(data?.operation || 'uppercase');
  const [pattern, setPattern] = useState(data?.pattern || '');

  const NodeComponent = createNode({
    title: 'Transform',
    fields: [
      {
        label: 'Operation',
        name: 'operation',
        type: 'select',
        options: ['uppercase', 'lowercase', 'replace', 'trim'],
        onChange: (id, field, value) => setOperation(value)
      },
      {
        label: 'Pattern',
        name: 'pattern',
        type: 'text',
        onChange: (id, field, value) => setPattern(value)
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
    bgColor: 'bg-amber-300'
  });

  return <NodeComponent id={id} data={{ operation, pattern }} />;
};

// Example 3: Conditional node with multiple outputs
export const ConditionalNode = ({ id, data }) => {
  const [condition, setCondition] = useState(data?.condition || '');

  const NodeComponent = createNode({
    title: 'Conditional',
    fields: [
      {
        label: 'Condition',
        name: 'condition',
        type: 'textarea',
        onChange: (id, field, value) => setCondition(value)
      },
      {
        type: 'display',
        content: 'Returns true or false path'
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
        id: 'true',
        top: '30%',
        style: { background: '#4caf50' }
      },
      {
        type: 'source',
        position: Position.Right,
        id: 'false',
        top: '70%',
        style: { background: '#f44336' }
      }
    ],
    bgColor: 'bg-purple-300'
  });

  return <NodeComponent id={id} data={{ condition }} />;
};

// Example 4: Database node with many configuration options
export const DatabaseNode = ({ id, data }) => {
  const [dbType, setDbType] = useState(data?.dbType || 'PostgreSQL');
  const [query, setQuery] = useState(data?.query || 'SELECT * FROM');
  const [table, setTable] = useState(data?.table || '');

  const NodeComponent = createNode({
    title: 'Database Query',
    fields: [
      {
        label: 'Database',
        name: 'dbType',
        type: 'select',
        options: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite'],
        onChange: (id, field, value) => setDbType(value)
      },
      {
        label: 'Table',
        name: 'table',
        type: 'text',
        onChange: (id, field, value) => setTable(value)
      },
      {
        label: 'Query',
        name: 'query',
        type: 'textarea',
        onChange: (id, field, value) => setQuery(value)
      }
    ],
    handles: [
      {
        type: 'target',
        position: Position.Left,
        id: 'params',
        top: '50%'
      },
      {
        type: 'source',
        position: Position.Right,
        id: 'results',
        top: '50%'
      }
    ],
    bgColor: 'bg-emerald-300'
  });

  return <NodeComponent id={id} data={{ dbType, query, table }} />;
};

// To use these nodes in your app:
// 1. Import them in your ui.js file
// 2. Add them to the nodeTypes object:
//    const nodeTypes = {
//      customInput: InputNode,
//      llm: LLMNode,
//      customOutput: OutputNode,
//      text: TextNode,
//      api: APINode,                    // New!
//      transformer: TransformerNode,     // New!
//      conditional: ConditionalNode,     // New!
//      database: DatabaseNode,           // New!
//    };
// 3. Add corresponding draggable nodes in toolbar.js
