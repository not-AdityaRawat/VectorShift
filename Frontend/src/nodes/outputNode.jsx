// outputNode.js

import { memo } from 'react';
import { Position } from 'reactflow';
import { createNode } from './nodeFactory';
import { FileOutput } from 'lucide-react';

// Create the node component OUTSIDE - static config
const OutputNodeConfig = createNode({
  title: 'Output',
  icon: FileOutput,
  bgColor: 'bg-orange-300',
  fields: [
    {
      label: 'Name',
      name: 'outputName',
      type: 'text',
      placeholder: 'e.g., result, final_output'
    },
    {
      label: 'Type',
      name: 'outputType',
      type: 'select',
      options: ['Text', 'Image']
    }
  ],
  handles: [
    {
      type: 'target',
      position: Position.Left,
      id: 'value',
      top: '50%'
    }
  ]
});

const OutputNodeComponent = ({ id, data }) => {
  return <OutputNodeConfig id={id} data={data} />;
};

export const OutputNode = memo(OutputNodeComponent);
