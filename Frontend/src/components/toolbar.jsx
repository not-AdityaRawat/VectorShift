// toolbar.js

import { Bot, FileInputIcon, FileOutputIcon, NotebookPenIcon, TextInitial, MessageSquare, ShieldCheck } from 'lucide-react';
import { DraggableNode } from '../draggableNode';

// Node type mapping
const nodeTypeMap = {
  'input': { type: 'customInput', label: 'Input', icon:<FileInputIcon/> },
  'output': { type: 'customOutput', label: 'Output', icon:<FileOutputIcon/> },
  'text': { type: 'text', label: 'Text', icon:<TextInitial/> },
  'note': { type: 'note', label: 'Note', icon:<NotebookPenIcon/> },
  'llm': { type: 'llm', label: 'LLM', icon:<Bot/> },
  'comment': { type: 'comment', label: 'Comment', icon:<MessageSquare/> },
  'validator': { type: 'validator', label: 'Validator', icon:<ShieldCheck/> },
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
                                icon={nodeConfig.icon}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
};
