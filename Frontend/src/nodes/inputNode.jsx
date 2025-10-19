// inputNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { createNode } from './nodeFactory';
import { FileInput } from 'lucide-react';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data?.inputType || 'Text');

  const NodeComponent = createNode({
    title: 'Input',
    icon: FileInput,
    bgColor: 'bg-green-300',
    description: `Variable: ${currName}`,
    fields: [
      {
        label: 'Name',
        name: 'inputName',
        type: 'text',
        onChange: (id, field, value) => setCurrName(value),
        placeholder: 'e.g., user_input, data_source'
      },
      {
        label: 'Type',
        name: 'inputType',
        type: 'select',
        options: ['Text', 'File'],
        onChange: (id, field, value) => setInputType(value)
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

  return <NodeComponent id={id} data={{ inputName: currName, inputType }} />;
}
