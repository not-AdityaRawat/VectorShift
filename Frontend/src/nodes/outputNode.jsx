// outputNode.js

import { memo } from 'react';
import { Position } from 'reactflow';
import { createNode } from './nodeFactory';
import { FileOutput } from 'lucide-react';

// Create the node component OUTSIDE - static config
const OutputNodeConfig = createNode({
  title: 'Output',
  icon: FileOutput,
  description:"Output data of different type from your workspace",
  bgColor: 'bg-orange-500',
  enableVariableExtraction: true, // Enable variable detection
  variableFieldName: 'outputType', // Extract from outputType field
  fields: [
    {
      label: 'Name',
      name: 'outputName',
      type: 'text',
      placeholder: 'e.g., result, final_output'
    },
    {
      label: 'Output',
      name: 'outputType',
      type: 'textarea', // Changed to textarea for multi-line support
      placeholder: 'Type "{{" to utilize variables'
    }
  ],
  handles: [
    {
      type: 'target',
      position: Position.Left,
      id: 'value',
      dynamicId: 'outputName', // Use outputName field value as handle ID
      top: '50%'
    },
    {
      type: 'source',
      position: Position.Right,
      id: 'output',
      dynamicId: 'outputName', // Use outputName field value as handle ID
      top: '50%'
    }
  ]
});

const OutputNodeComponent = ({ id, data }) => {
  return <OutputNodeConfig id={id} data={data} />;
};

export const OutputNode = memo(OutputNodeComponent);
