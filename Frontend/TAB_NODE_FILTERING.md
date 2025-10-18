# Tab-Based Node Filtering (Embedded Layout)

## Overview
The PipelineToolbar is now **embedded within the Tab Navigation section** of the Navbar. When users click a tab, the corresponding nodes appear inline next to the tab buttons, creating a unified and compact interface.

## Architecture

### Single Component Management
The Navbar component now manages everything:
- Tab selection state
- Active nodes state  
- Rendering of both tabs and toolbar

```
┌─────────────────────────────────────────────────────────────┐
│  Top Bar: Breadcrumb | Action Buttons                       │
├─────────────────────────────────────────────────────────────┤
│  Tab Navigation Section:                                     │
│  [Start] [Objects] [AI] ... | [Input] [Output] [Text] [Note]│
└─────────────────────────────────────────────────────────────┘
```

### Component Structure

**Navbar.jsx** - Everything in one place

```javascript
const tabs = [
  { id: 'Start', label: 'Start', icon: Layers, nodes: ['input', 'output', 'text', 'note'] },
  { id: 'Objects', label: 'Objects', icon: null, nodes: [] },
  { id: 'Knowledge', label: 'Knowledge', icon: null, nodes: [] },
  { id: 'AI', label: 'AI', icon: null, nodes: ['llm'] },
  { id: 'Integrations', label: 'Integrations', icon: null, nodes: [] },
  { id: 'Logic', label: 'Logic', icon: null, nodes: [] },
  { id: 'Data', label: 'Data', icon: null, nodes: [] },
  { id: 'Chat', label: 'Chat', icon: null, nodes: [] },
];
```

### 2. State Management (App.jsx)
The App component manages the active nodes state:

```javascript
const [activeNodes, setActiveNodes] = useState(['input', 'output', 'text', 'note']);

// Pass down the callback and state
<Navbar onTabChange={setActiveNodes} />
<PipelineToolbar activeNodes={activeNodes} />
```

### 3. Tab Change Handler (Navbar.jsx)
When a tab is clicked, it updates the active nodes:

```javascript
const handleTabChange = (tab) => {
  setActiveTab(tab.id);
  onTabChange(tab.nodes);  // Update parent state with new nodes
};
```

### 4. Dynamic Node Rendering (toolbar.jsx)
The toolbar renders only the nodes in the `activeNodes` array:

```javascript
export const PipelineToolbar = ({ activeNodes = [] }) => {
  return (
    <div>
      {activeNodes.length === 0 ? (
        <div>No nodes available for this tab.</div>
      ) : (
        activeNodes.map((nodeKey) => {
          const nodeConfig = nodeTypeMap[nodeKey];
          return <DraggableNode type={nodeConfig.type} label={nodeConfig.label} />
        })
      )}
    </div>
  );
};
```

## Node Type Mapping

The toolbar uses a mapping object to convert node keys to their display configuration:

```javascript
const nodeTypeMap = {
  'input': { type: 'customInput', label: 'Input' },
  'output': { type: 'customOutput', label: 'Output' },
  'text': { type: 'text', label: 'Text' },
  'note': { type: 'note', label: 'Note' },
  'llm': { type: 'llm', label: 'LLM' },
};
```

## Current Tab Configuration

| Tab | Nodes |
|-----|-------|
| Start | Input, Output, Text, Note |
| Objects | (none) |
| Knowledge | (none) |
| AI | LLM |
| Integrations | (none) |
| Logic | (none) |
| Data | (none) |
| Chat | (none) |

## Adding New Nodes

### Step 1: Add to Node Type Map (toolbar.jsx)
```javascript
const nodeTypeMap = {
  // ...existing
  'myNewNode': { type: 'customType', label: 'My New Node' },
};
```

### Step 2: Add to Tab Configuration (Navbar.jsx)
```javascript
{ id: 'MyTab', label: 'My Tab', icon: null, nodes: ['myNewNode', 'input'] }
```

### Step 3: The node will automatically appear when the tab is selected!

## Benefits

✅ **Organized UI** - Users only see relevant nodes for their current task
✅ **Clean Interface** - No clutter from unused node types
✅ **Easy to Extend** - Just add nodes to the tab's array
✅ **Scalable** - Can easily add hundreds of node types across tabs
✅ **User-Friendly** - Clear visual feedback of what's available per tab

## Testing

1. Click **Start** tab → See: Input, Output, Text, Note
2. Click **AI** tab → See: LLM only
3. Click **Objects** tab → See: "No nodes available" message
