# Enhanced BaseNode: Editable Titles & Variable Names 🎯

## Major Updates

The `BaseNode` and `createNode()` system has been enhanced with two powerful new features:

### 1. **Editable Titles** ✏️
Nodes can now have inline-editable titles for better organization and documentation.

### 2. **Variable Names** 🏷️
Input/Output nodes can have user-defined names that can be referenced as variables in other nodes.

---

## New Configuration Options

```javascript
{
  // Existing options
  title: string,
  icon: Component,
  bgColor: string,
  fields: array,
  handles: array,
  enableVariableExtraction: boolean,
  variableFieldName: string,
  description: string,
  autoResize: boolean,
  
  // NEW OPTIONS ✨
  editableTitle: boolean,        // Enable inline title editing
  titleFieldName: string,        // Field name for editable title (default: 'title')
  showHandles: boolean          // Show/hide handles (default: true)
}
```

---

## Feature 1: Editable Titles

### What It Does
- Click on the node title to edit it inline
- Useful for:
  - Comment nodes (custom comment titles)
  - Section headers
  - Personalized node names
  - Documentation and organization

### How to Enable
```javascript
createNode({
  title: 'Comment',                // Default title
  editableTitle: true,            // Enable editing
  titleFieldName: 'title',        // Store in data.title
  // ... other config
})
```

### Example: Comment Node
```javascript
export const CommentNode = ({ id, data }) => {
  const [comment, setComment] = useState(data?.comment || '');
  const title = data?.title || 'Comment';

  const NodeComponent = createNode({
    title: 'Comment',
    icon: MessageSquare,
    bgColor: 'bg-yellow-200',
    editableTitle: true,           // ✨ Users can rename
    titleFieldName: 'title',
    showHandles: false,            // ✨ No connection points
    fields: [
      {
        label: 'Note',
        name: 'comment',
        type: 'textarea',
        onChange: (id, field, value) => setComment(value)
      }
    ]
  });

  return <NodeComponent id={id} data={{ comment, title }} />;
};
```

### User Experience
```
Before: [Comment]
After:  [Click to edit] → User types "TODO: Fix validation"
Result: [TODO: Fix validation]
```

---

## Feature 2: Variable Names for Input/Output Nodes

### What It Does
- Input and Output nodes display their variable names
- Names can be referenced in other nodes (like Text nodes with `{{variable}}`)
- Shown in the description under the title

### How to Use
```javascript
createNode({
  title: 'Input',
  description: `Variable: ${variableName}`,  // Shows variable name
  fields: [
    {
      label: 'Name',
      name: 'inputName',
      type: 'text',
      placeholder: 'e.g., user_input, data_source'
    }
  ]
})
```

### Example: Input Node
```javascript
export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(
    data?.inputName || id.replace('customInput-', 'input_')
  );

  const NodeComponent = createNode({
    title: 'Input',
    icon: FileInput,
    bgColor: 'bg-green-300',
    description: `Variable: ${currName}`,    // ✨ Shows variable name
    fields: [
      {
        label: 'Name',
        name: 'inputName',
        type: 'text',
        onChange: (id, field, value) => setCurrName(value),
        placeholder: 'e.g., user_input, data_source'  // ✨ Helper text
      }
    ],
    handles: [
      { type: 'source', position: Position.Right, id: 'value', top: '50%' }
    ]
  });

  return <NodeComponent id={id} data={{ inputName: currName }} />;
};
```

### Visual Example
```
┌─────────────────────┐
│ 📥 Input        [X] │
│ Variable: user_name │  ← Dynamic description
├─────────────────────┤
│ Name:               │
│ ┌─────────────────┐ │
│ │ user_name       │ │  ← Editable field
│ └─────────────────┘ │
│ Type: [Text ▼]      │
└─────────────────────┘ →
```

---

## Feature 3: Conditional Handles

### What It Does
- Control whether handles (connection points) are shown
- Perfect for annotation nodes like Comments

### How to Enable
```javascript
createNode({
  showHandles: false,  // Hide all handles
  handles: []          // Empty array (no handles to render)
})
```

### Use Cases
- **Comment nodes**: No connections, just annotations
- **Header nodes**: Visual markers, no data flow
- **Note nodes**: Documentation only

---

## Complete Feature Comparison

| Feature | Before | After |
|---------|--------|-------|
| **Title** | Static | ✅ Inline editable |
| **Variable Display** | None | ✅ Shown in description |
| **Placeholders** | None | ✅ Helpful hints |
| **Handles** | Always shown | ✅ Configurable |
| **Comment Node** | 175 lines custom | ✅ 50 lines with createNode |

---

## Updated Node Examples

### 1. Comment Node (Editable Title, No Handles)
```javascript
createNode({
  title: 'Comment',
  editableTitle: true,     // ✨ Users can rename
  titleFieldName: 'title',
  showHandles: false,      // ✨ No connection points
  bgColor: 'bg-yellow-200',
  autoResize: true,
  fields: [/* ... */]
})
```

### 2. Input Node (Variable Name Display)
```javascript
createNode({
  title: 'Input',
  description: `Variable: ${currName}`,  // ✨ Shows variable
  fields: [
    {
      label: 'Name',
      name: 'inputName',
      type: 'text',
      placeholder: 'e.g., user_input'    // ✨ Helper text
    }
  ]
})
```

### 3. Output Node (Variable Name Display)
```javascript
createNode({
  title: 'Output',
  description: `Variable: ${currName}`,  // ✨ Shows variable
  fields: [
    {
      label: 'Name',
      name: 'outputName',
      type: 'text',
      placeholder: 'e.g., result'        // ✨ Helper text
    }
  ]
})
```

### 4. Text Node (Variable Extraction)
```javascript
createNode({
  title: 'Text',
  enableVariableExtraction: true,       // ✨ Detects {{vars}}
  variableFieldName: 'text',
  autoResize: true,
  fields: [
    {
      label: 'Text',
      name: 'text',
      type: 'textarea',
      placeholder: 'Use {{variables}} here'  // ✨ Hint
    }
  ]
})
```

---

## Workflow Example: Using Variable Names

### Step 1: Create Input Node
```
Name: user_name
→ Output: user_name variable
```

### Step 2: Create Text Node
```
Text: "Hello {{user_name}}, welcome!"
← Input: Auto-detected handle for "user_name"
```

### Step 3: Connect
```
[Input: user_name] → [Text: "Hello {{user_name}}"]
```

### Step 4: Create Output
```
Name: greeting_message
← Input: Connected to Text node output
```

### Result Flow
```
Input (user_name) → Text → Output (greeting_message)
```

---

## Code Reduction Summary

### Comment Node
- **Before**: 175 lines (custom implementation)
- **After**: 50 lines (using createNode)
- **Reduction**: 71% less code ✅

### Input Node
- **Before**: 43 lines
- **After**: 37 lines (with more features!)
- **Features Added**: Variable display, placeholders, icon

### Output Node
- **Before**: 40 lines
- **After**: 39 lines (with more features!)
- **Features Added**: Variable display, placeholders, icon

---

## Benefits

### For Developers
- ✅ Less boilerplate code
- ✅ Consistent behavior across nodes
- ✅ Easy to add new features
- ✅ Centralized state management

### For Users
- ✅ Rename comments for better organization
- ✅ See variable names at a glance
- ✅ Helpful placeholders guide input
- ✅ Cleaner UI (no unnecessary handles)

---

## Best Practices

### Variable Naming
```javascript
// ✅ GOOD
inputName: 'user_email'
inputName: 'product_id'
inputName: 'total_amount'

// ❌ AVOID
inputName: 'x'
inputName: 'temp'
inputName: 'data123'
```

### Comment Titles
```javascript
// ✅ GOOD
title: 'TODO: Add validation'
title: 'Important: Check API limits'
title: 'Note: Updated 2025-10-19'

// ❌ AVOID
title: 'abc'
title: 'test'
title: 'xyzzy'
```

### Placeholders
```javascript
// ✅ GOOD - Descriptive
placeholder: 'e.g., user_input, data_source'
placeholder: 'Enter variable name (snake_case)'

// ❌ AVOID - Vague
placeholder: 'Enter text'
placeholder: 'Name'
```

---

## Migration Guide

### Updating Existing Nodes

#### 1. Add Editable Title to Comment Node
```javascript
// Add these to config:
editableTitle: true,
titleFieldName: 'title',
showHandles: false
```

#### 2. Add Variable Display to Input Node
```javascript
// Add this to config:
description: `Variable: ${currName}`,

// Add this to field:
placeholder: 'e.g., user_input, data_source'
```

#### 3. Add Icon Support
```javascript
// Import icon
import { FileInput } from 'lucide-react';

// Add to config:
icon: FileInput
```

---

## Future Enhancements

- [ ] Variable name validation (prevent duplicates)
- [ ] Auto-suggest variable names
- [ ] Variable type indicators
- [ ] Variable usage tracking
- [ ] Export variable mapping
- [ ] Variable renaming across all nodes

---

**Updated**: October 19, 2025  
**Version**: 3.0.0  
**Status**: ✅ Production Ready  
**Breaking Changes**: None (backward compatible)
