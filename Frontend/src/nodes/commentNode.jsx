// commentNode.jsx

import { memo } from 'react';
import { createNode } from './nodeFactory';
import { MessageSquare } from 'lucide-react';

// Create the node component OUTSIDE - static config
const CommentNodeConfig = createNode({
  title: 'Comment',
  icon: MessageSquare,
  bgColor: 'bg-yellow-200',
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
      options: ['bg-yellow-200', 'bg-pink-200', 'bg-blue-200', 'bg-green-200', 'bg-purple-200', 'bg-orange-200', 'bg-gray-200']
    },
    {
      label: 'Font Size',
      name: 'fontSize',
      type: 'select',
      options: ['text-xs', 'text-sm', 'text-base']
    },
    {
      label: 'Note',
      name: 'comment',
      type: 'textarea',
      placeholder: 'Type your comment or notes here...'
    }
  ],
  handles: [],
  description:"This node has no handles. So, effect on the workflow"
});

const CommentNodeComponent = ({ id, data }) => {
  return <CommentNodeConfig id={id} data={data} />;
};

export const CommentNode = memo(CommentNodeComponent);
