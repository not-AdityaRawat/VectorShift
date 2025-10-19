// inputNode.js

import { memo } from 'react';
import { Position } from 'reactflow';
import { createNode } from './nodeFactory';
import { FileInput } from 'lucide-react';

// Create the node component OUTSIDE - static config
const InputNodeConfig = createNode({
  title: 'Input',
  icon: FileInput,
  bgColor: 'bg-green-300',
  fields: [
    {
      label: 'Name',
      name: 'inputName',
      type: 'text',
      placeholder: 'e.g., user_input, data_source'
    },
    {
      label: 'Type',
      name: 'inputType',
      type: 'select',
      options: ['Text', 'File']
    }
  ],
  handles: [
    {
      type: 'source',
      position: Position.Right,
      id: 'value',
      top: '50%'
    }
  ]
});

const InputNodeComponent = ({ id, data }) => {
  return <InputNodeConfig id={id} data={data} />;
};

export const InputNode = memo(InputNodeComponent);
