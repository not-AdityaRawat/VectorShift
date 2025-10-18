// outputNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { createNode } from './nodeFactory';

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data.outputType || 'Text');

  const NodeComponent = createNode({
    title: 'Output',
    fields: [
      {
        label: 'Name',
        name: 'outputName',
        type: 'text',
        onChange: (id, field, value) => setCurrName(value)
      },
      {
        label: 'Type',
        name: 'outputType',
        type: 'select',
        options: ['Text', 'Image'],
        onChange: (id, field, value) => setOutputType(value)
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

  return <NodeComponent id={id} data={{ outputName: currName, outputType }} />;
}
