// inputNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { createNode } from './nodeFactory';
import { FileInput } from 'lucide-react';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data.inputType || 'Text');

  const NodeComponent = createNode({
    title: 'Input',
    fields: [
      {
        label: 'Name',
        name: 'inputName',
        type: 'text',
        onChange: (id, field, value) => setCurrName(value)
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
    ],
    bgColor: 'bg-green-300',
    // icon: <FileInput />
  });

  return <NodeComponent id={id} data={{ inputName: currName, inputType}} />;
}
