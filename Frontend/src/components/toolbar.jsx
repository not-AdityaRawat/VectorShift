// toolbar.js

import { DraggableNode } from '../draggableNode';

// Node type mapping
const nodeTypeMap = {
  'input': { type: 'customInput', label: 'Input' },
  'output': { type: 'customOutput', label: 'Output' },
  'text': { type: 'text', label: 'Text' },
  'note': { type: 'note', label: 'Note' },
  'llm': { type: 'llm', label: 'LLM' },
};

export const PipelineToolbar = ({ activeNodes = [] }) => {
    return (
        <div style={{ padding: '0' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {activeNodes.length === 0 ? (
                    <div style={{ color: '#94a3b8', fontSize: '13px', padding: '8px' }}>
                        No nodes available
                    </div>
                ) : (
                    activeNodes.map((nodeKey) => {
                        const nodeConfig = nodeTypeMap[nodeKey];
                        if (!nodeConfig) return null;
                        return (
                            <DraggableNode 
                                key={nodeKey}
                                type={nodeConfig.type} 
                                label={nodeConfig.label} 
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
};
