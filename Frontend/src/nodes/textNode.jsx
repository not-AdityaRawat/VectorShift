// textNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { createNode } from './nodeFactory';
import { TextInitial } from 'lucide-react';

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');

  const NodeComponent = createNode({
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
        type: 'textarea',
        onChange: (id, field, value) => setCurrText(value)
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

  return <NodeComponent id={id} data={{ text: currText }} />;
};
