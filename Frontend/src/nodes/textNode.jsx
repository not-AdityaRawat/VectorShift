// textNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { createNode } from './nodeFactory';

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');

  const NodeComponent = createNode({
    title: 'Text',
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
}
