// commentNode.jsx

import { memo } from 'react';
import { createNode } from './nodeFactory';
import { MessageSquare } from 'lucide-react';

// Create the node component OUTSIDE - static config
const CommentNodeConfig = createNode({
  title: 'Comment',
  icon: MessageSquare,
  bgColor: 'bg-yellow-100',
  editableTitle: true,
  titleFieldName: 'title',
  showHandles: false,
  autoResize: true,
  variableFieldName: 'comment',
  fields: [
    
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
