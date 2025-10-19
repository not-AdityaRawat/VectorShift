// validatorNode.jsx

import { useState } from 'react';
import { Position } from 'reactflow';
import { createNode } from './nodeFactory';
import { ShieldCheck } from 'lucide-react';

export const ValidatorNode = ({ id, data }) => {
  const [validationType, setValidationType] = useState(data?.validationType || 'email');
  const [customPattern, setCustomPattern] = useState(data?.customPattern || '');
  const [minLength, setMinLength] = useState(data?.minLength || '0');
  const [maxLength, setMaxLength] = useState(data?.maxLength || '100');
  const [required, setRequired] = useState(data?.required || 'true');
  const [errorMessage, setErrorMessage] = useState(data?.errorMessage || 'Validation failed');

  const NodeComponent = createNode({
    title: 'Data Validator',
    icon: ShieldCheck,
    bgColor: 'bg-cyan-300',
    fields: [
      {
        label: 'Validation Type',
        name: 'validationType',
        type: 'select',
        options: ['email', 'url', 'number', 'phone', 'date', 'regex', 'length', 'custom'],
        onChange: (id, field, value) => setValidationType(value)
      },
      {
        label: 'Required',
        name: 'required',
        type: 'select',
        options: ['true', 'false'],
        onChange: (id, field, value) => setRequired(value)
      },
      {
        label: 'Min Length',
        name: 'minLength',
        type: 'text',
        onChange: (id, field, value) => setMinLength(value)
      },
      {
        label: 'Max Length',
        name: 'maxLength',
        type: 'text',
        onChange: (id, field, value) => setMaxLength(value)
      },
      {
        label: 'Custom Pattern (regex)',
        name: 'customPattern',
        type: 'text',
        onChange: (id, field, value) => setCustomPattern(value)
      },
      {
        label: 'Error Message',
        name: 'errorMessage',
        type: 'textarea',
        onChange: (id, field, value) => setErrorMessage(value)
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

  return <NodeComponent id={id} data={{ 
    validationType, 
    customPattern, 
    minLength, 
    maxLength, 
    required,
    errorMessage 
  }} />;
};
