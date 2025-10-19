// llmNode.js

import { Position } from 'reactflow';
import { createNode } from './nodeFactory';

export const LLMNode = createNode({
  title: 'LLM',
  fields: [
    {
      type: 'display',
      content: 'This is a LLM.'
    }
  ],
  handles: [
    {
      type: 'target',
      position: Position.Left,
      id: 'system',
      top: `${100/3}%`
    },
    {
      type: 'target',
      position: Position.Left,
      id: 'prompt',
      top: `${200/3}%`
    },
    {
      type: 'source',
      position: Position.Right,
      id: 'response',
      top: '50%'
    }
  ],
  bgColor: 'bg-pink-300',
  // icon: <Brain />
});
