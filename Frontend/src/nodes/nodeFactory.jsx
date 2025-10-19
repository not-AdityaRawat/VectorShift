import { memo } from 'react';
import { BaseNode } from './BaseNode';

export const createNode = (config) => {
  const NodeComponent = ({ id, data }) => {
    return <BaseNode id={id} data={data} config={config} />;
  };
  
  // Memoize to prevent re-renders when other nodes change
  return memo(NodeComponent);
};
