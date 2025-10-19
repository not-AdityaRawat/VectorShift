// commentNode.jsx

import { useState } from 'react';
import { createNode } from './nodeFactory';
import { MessageSquare } from 'lucide-react';

export const CommentNode = ({ id, data }) => {
  const [comment, setComment] = useState(data?.comment || 'Add your notes here...');
  const title = data?.title || 'Comment';
  const [bgColor, setBgColor] = useState(data?.bgColor || 'bg-yellow-200');
  const [fontSize, setFontSize] = useState(data?.fontSize || 'text-sm');

  const NodeComponent = createNode({
    title: 'Comment',
    icon: MessageSquare,
    bgColor: bgColor,
    editableTitle: true,
    titleFieldName: 'title',
    showHandles: false,
    autoResize: true,
    variableFieldName: 'comment',
    fields: [
      {
        label: 'Background Color',
        name: 'bgColor',
        type: 'select',
        options: ['bg-yellow-200', 'bg-pink-200', 'bg-blue-200', 'bg-green-200', 'bg-purple-200', 'bg-orange-200', 'bg-gray-200'],
        onChange: (id, field, value) => setBgColor(value)
      },
      {
        label: 'Font Size',
        name: 'fontSize',
        type: 'select',
        options: ['text-xs', 'text-sm', 'text-base'],
        onChange: (id, field, value) => setFontSize(value)
      },
      {
        label: 'Note',
        name: 'comment',
        type: 'textarea',
        onChange: (id, field, value) => setComment(value),
        placeholder: 'Type your comment or notes here...'
      },
      {
        type: 'display',
        content: `${comment.length} characters | ${comment.split(/\s+/).filter(word => word.length > 0).length} words`
      }
    ],
    handles: []
  });

  return <NodeComponent id={id} data={{ comment, title, bgColor, fontSize }} />;
};
