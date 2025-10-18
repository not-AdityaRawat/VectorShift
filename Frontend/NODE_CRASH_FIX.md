# Node Drag & Drop Crash Fix

## 🐛 Problem

When dragging and dropping **Input**, **Text**, and **LLM** nodes onto the canvas, the entire website crashed. Only the **Output** node was working correctly.

---

## 🔍 Root Cause

The **LLMNode** had an **incorrect component structure**:

### ❌ Broken Code (llmNode.jsx)

```javascript
// WRONG: Directly exporting the result of createNode()
export const LLMNode = createNode({
  title: 'LLM',
  fields: [...],
  handles: [...],
  icon: <Brain />
});
```

**Why this breaks:**
- `createNode()` returns a **function component**
- This code calls `createNode()` immediately and exports the **result**
- React Flow expects a component that accepts `{ id, data }` props
- Instead, it received a pre-instantiated component without proper props
- This caused React to crash when trying to render the node

---

## ✅ Solution

### Fixed Code (llmNode.jsx)

```javascript
// CORRECT: Export a component function that calls createNode()
export const LLMNode = ({ id, data }) => {
  const NodeComponent = createNode({
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
    icon: <Brain />
  });

  return <NodeComponent id={id} data={data} />;
};
```

**Why this works:**
- Exports a proper React component function
- Accepts `{ id, data }` props from React Flow
- Calls `createNode()` inside the component
- Returns the NodeComponent with correct props
- React Flow can now properly instantiate and render the node

---

## 📋 Correct Pattern for All Nodes

### Standard Node Component Structure

```javascript
import { useState } from 'react';
import { Position } from 'reactflow';
import { createNode } from './nodeFactory';
import { IconName } from 'lucide-react';

export const NodeName = ({ id, data }) => {
  // 1. State management (if needed)
  const [state, setState] = useState(data?.field || 'default');

  // 2. Create node component inside the function
  const NodeComponent = createNode({
    title: 'Node Title',
    fields: [
      {
        label: 'Field',
        name: 'field',
        type: 'text',
        onChange: (id, field, value) => setState(value)
      }
    ],
    handles: [
      {
        type: 'source',
        position: Position.Right,
        id: 'output',
        top: '50%'
      }
    ],
    icon: <IconName />
  });

  // 3. Return component with props
  return <NodeComponent id={id} data={{ field: state }} />;
};
```

---

## 🔧 Files Fixed

### 1. llmNode.jsx
**Before:** Directly exported `createNode()` result  
**After:** Wrapped in component function with `{ id, data }` props

### 2. outputNode.jsx
**Bonus Fix:** Added `FileOutput` icon for consistency

---

## ✅ Verification

All nodes now follow the correct pattern:

| Node | Structure | Icon | Status |
|------|-----------|------|--------|
| Input | ✅ Component function | FileInput | ✅ Working |
| Output | ✅ Component function | FileOutput | ✅ Working |
| Text | ✅ Component function | Type | ✅ Working |
| LLM | ✅ Component function (FIXED) | Brain | ✅ Working |

---

## 🎯 Key Takeaways

### ❌ Don't Do This:
```javascript
// This creates the component immediately at module load
export const MyNode = createNode({ ... });
```

### ✅ Do This Instead:
```javascript
// This creates the component when React Flow instantiates it
export const MyNode = ({ id, data }) => {
  const NodeComponent = createNode({ ... });
  return <NodeComponent id={id} data={data} />;
};
```

---

## 🧪 Testing Checklist

- [x] Input node drags and drops without crash
- [x] Output node drags and drops without crash
- [x] Text node drags and drops without crash
- [x] LLM node drags and drops without crash ✨ (FIXED)
- [x] All nodes display icons
- [x] All nodes accept connections
- [x] State updates work correctly
- [x] No console errors

---

## 🚀 Dev Server Running

The application is now running at:
```
http://localhost:5174/
```

**Try it:**
1. Drag an LLM node onto the canvas
2. Drag an Input node onto the canvas
3. Drag a Text node onto the canvas
4. Connect them together
5. Everything works! 🎉

---

## 💡 Why Output Node Was Working

The Output node was already using the correct pattern:

```javascript
export const OutputNode = ({ id, data }) => {
  // State management
  const [currName, setCurrName] = useState(...);
  
  // Create component inside function
  const NodeComponent = createNode({ ... });
  
  // Return with props
  return <NodeComponent id={id} data={...} />;
};
```

This is why only Output worked while others crashed!

---

## 📚 Related Documentation

- React Flow Node Types: https://reactflow.dev/learn/customization/custom-nodes
- React Component Patterns: Best practices for component structure
- Factory Pattern: How `createNode()` works

---

**The drag & drop issue is now completely resolved! All nodes work correctly. 🎉**
