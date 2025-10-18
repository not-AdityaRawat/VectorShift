# Enhanced Text Node - Dynamic Sizing & Variable Handles

## 🎯 Overview

The Text node has been significantly improved with two major features:

1. **Dynamic Node Sizing** - The node automatically resizes based on text content
2. **Variable Detection & Dynamic Handles** - Variables in `{{variableName}}` format automatically create input handles

---

## ✨ Feature 1: Dynamic Node Sizing

### How It Works

The Text node now automatically adjusts its dimensions based on content:

**Width Adjustment:**
- Base width: 200px
- Grows with text length: adds 1px per 10 characters
- Maximum width: 400px
- Minimum width: 200px

**Height Adjustment:**
- Base textarea height: 60px
- Grows with line count: 20px per line + 40px padding
- Maximum textarea height: 300px
- Minimum textarea height: 60px

### Implementation

```javascript
// Calculate dynamic dimensions
const textLength = currText.length;
const lineCount = (currText.match(/\n/g) || []).length + 1;

const dynamicWidth = Math.max(200, Math.min(400, 200 + Math.floor(textLength / 10)));
const textareaHeight = Math.max(60, Math.min(300, lineCount * 20 + 40));

// Apply to node config
const NodeComponent = createNode({
  style: {
    width: dynamicWidth,
    minWidth: 200,
    maxWidth: 400
  },
  fields: [
    {
      type: 'textarea',
      style: {
        minHeight: `${textareaHeight}px`,
        resize: 'both'
      }
    }
  ]
});
```

### User Experience

- Type a short text → Node stays compact (200px)
- Type longer text → Node expands up to 400px
- Add multiple lines → Textarea grows vertically
- Manual resize → User can still resize with handle

---

## 🔌 Feature 2: Variable Detection & Dynamic Handles

### How It Works

When users type variables in `{{variableName}}` format, the node:
1. Detects the variable using regex pattern matching
2. Creates a new input handle on the left side
3. Labels the handle with the variable name
4. Positions handles evenly based on count

### Variable Syntax

**Valid variable names** (JavaScript identifier rules):
- Must start with: letter, underscore (_), or dollar sign ($)
- Can contain: letters, numbers, underscores, dollar signs
- Case-sensitive

**Examples:**

✅ Valid:
```
{{input}}
{{user_name}}
{{$value}}
{{data123}}
{{_private}}
{{API_KEY}}
```

❌ Invalid:
```
{{123input}}      // Can't start with number
{{user-name}}     // Hyphens not allowed
{{my value}}      // Spaces not allowed
{{input.field}}   // Dots not allowed
```

### Regex Pattern

```javascript
const variableRegex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
```

**Pattern breakdown:**
- `\{\{` - Opening double curly braces
- `\s*` - Optional whitespace
- `([a-zA-Z_$][a-zA-Z0-9_$]*)` - Valid JS identifier
  - First char: letter, _, or $
  - Rest: letters, numbers, _, or $
- `\s*` - Optional whitespace
- `\}\}` - Closing double curly braces

### Handle Creation

```javascript
useEffect(() => {
  const variableRegex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
  const matches = [];
  let match;
  
  while ((match = variableRegex.exec(currText)) !== null) {
    const variableName = match[1].trim();
    if (!matches.includes(variableName)) {
      matches.push(variableName);
    }
  }
  
  setVariables(matches);
}, [currText]);

// Create handles for each variable
const handles = [
  // Output handle (right side)
  {
    type: 'source',
    position: Position.Right,
    id: 'output',
    top: '50%'
  },
  // Variable input handles (left side)
  ...variables.map((varName, index) => ({
    type: 'target',
    position: Position.Left,
    id: varName,
    top: `${((index + 1) * 100) / (variables.length + 1)}%`,
    label: varName
  }))
];
```

### Handle Positioning

Handles are evenly distributed on the left side:

**1 variable:**
```
    50%  ← {{input}}
```

**2 variables:**
```
    33%  ← {{input}}
    66%  ← {{output}}
```

**3 variables:**
```
    25%  ← {{user}}
    50%  ← {{data}}
    75%  ← {{config}}
```

Formula: `top = ((index + 1) * 100) / (variables.length + 1)%`

---

## 🎨 Visual Features

### Handle Labels

Each variable handle displays its name:

```javascript
{handle.label && handle.position === Position.Left && (
  <div style={{
    position: 'absolute',
    left: '15px',
    top: handle.top,
    transform: 'translateY(-50%)',
    fontSize: '10px',
    color: '#666',
    backgroundColor: '#fff',
    padding: '2px 4px',
    borderRadius: '3px',
    border: '1px solid #ddd',
    whiteSpace: 'nowrap'
  }}>
    {handle.label}
  </div>
)}
```

**Label styling:**
- Small font (10px)
- White background with border
- Positioned to the right of the handle
- Doesn't interfere with connections

---

## 📝 Usage Examples

### Example 1: Simple Variable

**Text input:**
```
Hello {{name}}!
```

**Result:**
- Node width: ~200px (short text)
- 1 input handle on left: "name"
- 1 output handle on right: "output"

### Example 2: Multiple Variables

**Text input:**
```
Dear {{customer_name}},

Thank you for your purchase of {{product}}.
Your order total is {{total_price}}.

Best regards,
{{company_name}}
```

**Result:**
- Node width: ~300px (longer text)
- Node height: ~140px (5 lines)
- 4 input handles on left:
  - "customer_name" (top)
  - "product"
  - "total_price"
  - "company_name" (bottom)
- 1 output handle on right

### Example 3: Duplicate Variables

**Text input:**
```
{{user}} logged in.
Welcome back, {{user}}!
```

**Result:**
- Only 1 handle created for "user" (duplicates removed)
- Both instances in text reference the same input

### Example 4: Invalid Syntax

**Text input:**
```
{{123invalid}}
{{ spaces in name }}
{{user-name}}
```

**Result:**
- No handles created (invalid variable names)
- Text displayed as-is

---

## 🔧 Technical Implementation

### Files Modified

1. **textNode.jsx**
   - Added `useEffect` for variable detection
   - Added state for `variables` array
   - Implemented dynamic sizing logic
   - Created dynamic handles array
   - Added Type icon from lucide-react

2. **BaseNode.jsx**
   - Added support for dynamic width in style
   - Added `minWidth` and `maxWidth` support
   - Allowed custom styles on textarea fields
   - Implemented handle labels for left-side handles
   - Imported `Position` from reactflow

### Key Dependencies

```javascript
import { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { Type } from 'lucide-react';
```

---

## 🎯 Benefits

### For Users

✅ **Better Visibility** - No more squinting at tiny text boxes
✅ **Auto-Resizing** - Node grows as you type
✅ **Visual Feedback** - See variables as handles immediately
✅ **Easy Connections** - Connect variable inputs visually
✅ **Clear Labeling** - Know which handle is which variable

### For Developers

✅ **Reusable Pattern** - Other nodes can use dynamic sizing
✅ **Clean Code** - Regex-based variable extraction
✅ **Flexible** - Easy to customize sizing rules
✅ **Maintainable** - Clear separation of concerns

---

## 🚀 Future Enhancements

Potential improvements:

1. **Syntax Highlighting** - Color code variables in textarea
2. **Autocomplete** - Suggest available variables
3. **Validation** - Warn about undefined variables
4. **Type Hints** - Show expected data type for each variable
5. **Preview Mode** - Show text with variable values filled in
6. **Export Variables** - Export list of all variables in pipeline
7. **Variable Inspector** - See all variables and their connections

---

## 🐛 Troubleshooting

### Variables Not Detected?

Check your syntax:
- Double curly braces: `{{` and `}}`
- Valid identifier: starts with letter, _, or $
- No spaces in variable name (spaces around it are OK)

### Node Not Resizing?

- Check if text is actually changing
- Look for console errors
- Verify `useEffect` is running

### Handles Overlapping?

- Happens with many variables (>8)
- Consider splitting into multiple nodes
- Or adjust positioning formula

---

## ✅ Testing Checklist

- [x] Dynamic width increases with text length
- [x] Dynamic height increases with line count
- [x] Variables detected with `{{variableName}}` syntax
- [x] Handles created on left side for each variable
- [x] Handles labeled with variable names
- [x] Duplicate variables only create one handle
- [x] Invalid variable names ignored
- [x] Output handle remains on right side
- [x] Manual resize still works
- [x] Icon (Type) displays in header

---

## 📊 Performance

### Regex Performance

The regex runs on every text change (useEffect with `currText` dependency):
- **Fast**: O(n) where n = text length
- **Efficient**: Single pass through text
- **Safe**: No infinite loops

### Re-render Optimization

Only re-renders when:
- Text changes → Updates variables
- Variables change → Updates handles
- Node data changes → Updates display

---

**The Text node is now much more powerful and user-friendly! 🎉**
