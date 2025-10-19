// textNode.js

import { memo } from 'react';
import { Position } from 'reactflow';
import { createNode } from './nodeFactory';
import { TextInitial } from 'lucide-react';

// Create the node component OUTSIDE to avoid recreating on every render
const TextNodeConfig = createNode({
  title: 'Text',
  icon: TextInitial,
  bgColor: 'bg-violet-400',
  description: 'Parse data of different types',
  enableVariableExtraction: true,
  variableFieldName: 'text',
  autoResize: true,
  fields: [
    {
      label: 'Text',
      name: 'text',
      type: 'textarea'
    }
  ],
  handles: [
    {
      type: 'source',
      position: Position.Right,
      id: 'output',
      top: '50%'
    }
  ]
});

const TextNodeComponent = ({ id, data }) => {
  return <TextNodeConfig id={id} data={data} />;
};

export const TextNode = memo(TextNodeComponent);
