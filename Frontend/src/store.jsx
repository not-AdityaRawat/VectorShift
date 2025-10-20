// store.js

import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      set({
        edges: addEdge({...connection, type: 'smoothstep', animated: true, markerEnd: {type: MarkerType.Arrow, height: '20px', width: '20px'}}, get().edges),
      });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: { ...node.data, [fieldName]: fieldValue }
            };
          }
          return node;
        }),
      });
    },
    // Get all available variables from Input and Output nodes
    getAvailableVariables: () => {
      const nodes = get().nodes;
      const variables = [];
      
      nodes.forEach(node => {
        // Get variables from Input nodes
        if (node.type === 'customInput' && node.data.inputName) {
          variables.push({
            name: node.data.inputName,
            type: 'input',
            nodeId: node.id
          });
        }
        // Get variables from Output nodes
        if (node.type === 'customOutput' && node.data.outputName) {
          variables.push({
            name: node.data.outputName,
            type: 'output',
            nodeId: node.id
          });
        }
      });
      
      return variables;
    },
    // Auto-connect variables to their source nodes
    autoConnectVariable: (targetNodeId, variableName) => {
      const nodes = get().nodes;
      const edges = get().edges;
      
      // Find the source node that defines this variable
      const sourceNode = nodes.find(node => 
        (node.type === 'customInput' && node.data.inputName === variableName) ||
        (node.type === 'customOutput' && node.data.outputName === variableName)
      );
      
      if (!sourceNode) return; // Variable source not found
      
      // Determine the handle IDs
      const sourceHandleId = `${sourceNode.id}-${variableName}`;
      const targetHandleId = `${targetNodeId}-${variableName}`;
      
      // Check if connection already exists
      const connectionExists = edges.some(edge => 
        edge.source === sourceNode.id && 
        edge.sourceHandle === sourceHandleId &&
        edge.target === targetNodeId && 
        edge.targetHandle === targetHandleId
      );
      
      if (connectionExists) return; // Connection already exists
      
      // Create the connection
      const newEdge = {
        id: `${sourceNode.id}-${targetNodeId}-${variableName}`,
        source: sourceNode.id,
        sourceHandle: sourceHandleId,
        target: targetNodeId,
        targetHandle: targetHandleId,
        type: 'smoothstep',
        animated: true,
        markerEnd: { type: MarkerType.Arrow, height: '20px', width: '20px' }
      };
      
      set({
        edges: [...edges, newEdge]
      });
    },
  }));
