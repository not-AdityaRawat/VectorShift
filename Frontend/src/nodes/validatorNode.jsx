// validatorNode.jsx

import { memo } from 'react';
import { Position } from 'reactflow';
import { createNode } from './nodeFactory';
import { ShieldCheck } from 'lucide-react';

// Create outside to avoid recreation on every render
const ValidatorNodeConfig = createNode({
  title: 'Data Validator',
  icon: ShieldCheck,
  bgColor: 'bg-cyan-300',
  fields: [
    {
      label: 'Validation Type',
      name: 'validationType',
      type: 'select',
      options: ['email', 'url', 'number', 'phone', 'date', 'regex', 'length', 'custom']
    },
    {
      label: 'Required',
      name: 'required',
      type: 'select',
      options: ['true', 'false']
    },
    {
      label: 'Min Length',
      name: 'minLength',
      type: 'text'
    },
    {
      label: 'Max Length',
      name: 'maxLength',
      type: 'text'
    },
    {
      label: 'Custom Pattern (regex)',
      name: 'customPattern',
      type: 'text'
    },
    {
      label: 'Error Message',
      name: 'errorMessage',
      type: 'textarea'
    },
      {
        type: 'display',
        content: '✓ Valid data → Right | ✗ Invalid → Bottom'
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
        id: 'valid',
        top: '30%',
        style: { background: '#10b981' }
      },
      {
        type: 'source',
        position: Position.Bottom,
        id: 'invalid',
        top: '50%',
        style: { background: '#ef4444' }
      }
    ]
});

const ValidatorNodeComponent = ({ id, data }) => {
  return <ValidatorNodeConfig id={id} data={data} />;
};

export const ValidatorNode = memo(ValidatorNodeComponent);
