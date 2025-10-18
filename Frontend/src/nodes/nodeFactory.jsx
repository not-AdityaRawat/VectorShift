import { BaseNode } from './BaseNode';

export const createNode = (config) => {
  return ({ id, data }) => {
    return <BaseNode id={id} data={data} config={config} icon/>;
  };
};
