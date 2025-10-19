# Enhanced createNode() with Variable Extraction 🚀

## What's New?

The `createNode()` function has been significantly enhanced to support **automatic variable extraction** and **dynamic input handles**, making it much more powerful while keeping node code minimal.

## Major Updates

### 1. **BaseNode Enhancements**

#### New Configuration Options:
```javascript
{
  // Existing options
  title: string,
  icon: Component,
  bgColor: string,
  fields: array,
  handles: array,
  
  // NEW OPTIONS ✨
  enableVariableExtraction: boolean,    // Enable {{variable}} detection
  variableFieldName: string,            // Field to extract variables from
  description: string,                  // Description text under title
  autoResize: boolean                   // Auto-resize width based on content
}
```

### 2. **Variable Extraction Feature**

When `enableVariableExtraction: true`:
- ✅ Automatically detects `{{variable_name}}` patterns
- ✅ Creates dynamic input handles for each variable
- ✅ Shows variable list at the bottom
- ✅ Updates handles in real-time as you type

**Pattern**: `{{variableName}}` where variableName must match `[a-zA-Z_$][a-zA-Z0-9_$]*`

### 3. **Auto-Resize Feature**

When `autoResize: true`:
- ✅ Node width adjusts based on text content
- ✅ Textarea height auto-expands
- ✅ Min width: 200px, Max width: 400px
- ✅ Calculates based on longest line

### 4. **Description Support**

Show helpful text under the node title:
```javascript
description: 'Parse data of different types'
```

## Before & After Comparison

### ❌ BEFORE: Manual Implementation (116 lines)
```javascript
export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const [nodeWidth, setNodeWidth] = useState('w-56');
  const textareaRef = useRef(null);
  const { onNodesChange } = useStore();

  // Extract variables - 8 lines
  useEffect(() => {
    const regex = /\{\{([a-zA-Z_$][a-zA-Z0-9_$]*)\}\}/g;
    const matches = [...currText.matchAll(regex)];
    const extractedVars = [...new Set(matches.map(match => match[1]))];
    setVariables(extractedVars);
  }, [currText]);

  // Auto-resize textarea - 6 lines
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [currText]);

  // Calculate width - 6 lines
  useEffect(() => {
    const lines = currText.split('\n');
    const maxLineLength = Math.max(...lines.map(line => line.length), 10);
    const calculatedWidth = Math.max(200, Math.min(400, maxLineLength * 8 + 40));
    setNodeWidth(`w-[${calculatedWidth}px]`);
  }, [currText]);

  // Handlers - 8 lines
  const handleTextChange = (e) => setCurrText(e.target.value);
  const handleDelete = () => onNodesChange([{ type: 'remove', id }]);

  // 70+ lines of JSX with manual rendering
  return (
    <div className={`${nodeWidth} ...`}>
      {/* Header with icon, title, delete */}
      {/* Description text */}
      {/* Textarea with ref */}
      {/* Variable display */}
      {/* Dynamic variable handles with labels */}
      {/* Static output handle */}
    </div>
  );
};
```

### ✅ AFTER: Using createNode() (35 lines!)
```javascript
export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');

  const NodeComponent = createNode({
    title: 'Text',
    icon: TextInitial,
    bgColor: 'bg-violet-400',
    description: 'Parse data of different types',
    enableVariableExtraction: true,      // ✨ Auto-detect {{variables}}
    variableFieldName: 'text',           // ✨ Extract from 'text' field
    autoResize: true,                    // ✨ Auto-resize width
    fields: [
      {
        label: 'Text',
        name: 'text',
        type: 'textarea',
        onChange: (id, field, value) => setCurrText(value)
      }
    ],
    handles: [
      {
        type: 'source',
        position: Position.Right,
        id: 'output',
        top: '50%'
      }
    ]
  });

  return <NodeComponent id={id} data={{ text: currText }} />;
};
```

**Result**: 
- 📉 **81 fewer lines** (70% code reduction!)
- ✅ All features preserved
- ✅ Cleaner, more maintainable
- ✅ Easier to understand

## Feature Breakdown

### Variable Extraction
```javascript
// Input text:
"Hello {{name}}, your order {{orderId}} is ready!"

// Auto-generated:
- 2 input handles on the left
  - Handle: "name" (top 33%)
  - Handle: "orderId" (bottom 66%)
- Variable display: "Variables: name, orderId"
```

### Auto-Resize
```javascript
// Short text (10 chars) → 200px width
// Medium text (50 chars) → 300px width  
// Long text (100+ chars) → 400px width (max)

// Textarea also grows vertically with content
```

### Description
```javascript
description: 'Parse data of different types'

// Renders below title in gray monospace font
```

## Usage Examples

### Example 1: Simple Text Node (with variables)
```javascript
export const TextNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text || '');

  const NodeComponent = createNode({
    title: 'Text',
    icon: TextInitial,
    bgColor: 'bg-violet-400',
    enableVariableExtraction: true,
    variableFieldName: 'text',
    autoResize: true,
    fields: [
      { label: 'Text', name: 'text', type: 'textarea', 
        onChange: (id, field, value) => setText(value) }
    ],
    handles: [
      { type: 'source', position: Position.Right, id: 'output', top: '50%' }
    ]
  });

  return <NodeComponent id={id} data={{ text }} />;
};
```

### Example 2: Template Node (variables + description)
```javascript
export const TemplateNode = ({ id, data }) => {
  const [template, setTemplate] = useState(data?.template || '');

  const NodeComponent = createNode({
    title: 'Template',
    icon: FileText,
    bgColor: 'bg-amber-300',
    description: 'Create templates with {{variables}}',
    enableVariableExtraction: true,
    variableFieldName: 'template',
    autoResize: true,
    fields: [
      { label: 'Template', name: 'template', type: 'textarea',
        onChange: (id, field, value) => setTemplate(value) }
    ],
    handles: [
      { type: 'source', position: Position.Right, id: 'output', top: '50%' }
    ]
  });

  return <NodeComponent id={id} data={{ template }} />;
};
```

### Example 3: Standard Node (no variables)
```javascript
export const InputNode = ({ id, data }) => {
  const [name, setName] = useState(data?.name || '');

  const NodeComponent = createNode({
    title: 'Input',
    icon: FileInput,
    bgColor: 'bg-green-300',
    // No variable extraction - standard node
    fields: [
      { label: 'Name', name: 'name', type: 'text',
        onChange: (id, field, value) => setName(value) }
    ],
    handles: [
      { type: 'source', position: Position.Right, id: 'value', top: '50%' }
    ]
  });

  return <NodeComponent id={id} data={{ name }} />;
};
```

## BaseNode Internal Logic

### How It Works:

1. **Variable Detection**:
   ```javascript
   const regex = /\{\{([a-zA-Z_$][a-zA-Z0-9_$]*)\}\}/g;
   const matches = [...fieldValue.matchAll(regex)];
   const variables = [...new Set(matches.map(m => m[1]))];
   ```

2. **Dynamic Handle Creation**:
   ```javascript
   variables.map((variable, index) => {
     const spacing = 100 / (variables.length + 1);
     const topPosition = `${spacing * (index + 1)}%`;
     return <Handle id={`${id}-${variable}`} top={topPosition} />
   });
   ```

3. **Width Calculation**:
   ```javascript
   const lines = text.split('\n');
   const maxLength = Math.max(...lines.map(line => line.length), 10);
   const width = Math.max(200, Math.min(400, maxLength * 8 + 40));
   ```

## Benefits

### For Developers:
- ✅ **70% less code** for variable-aware nodes
- ✅ **Consistent behavior** across all nodes
- ✅ **Easier maintenance** - logic in one place
- ✅ **Faster development** - configure vs. implement

### For Users:
- ✅ **Dynamic handles** appear as you type
- ✅ **Visual feedback** with variable list
- ✅ **Better UX** with auto-resizing
- ✅ **Clear labels** on input handles

## Migration Guide

### Converting Existing Nodes:

1. **Remove manual implementations**:
   - Delete variable extraction useEffect
   - Delete auto-resize useEffect
   - Delete width calculation useEffect
   - Remove manual JSX rendering

2. **Add config options**:
   ```javascript
   enableVariableExtraction: true,
   variableFieldName: 'yourFieldName',
   autoResize: true,
   description: 'Your description'
   ```

3. **Simplify state**:
   - Keep only the field states
   - Remove variables, nodeWidth, refs

4. **Use createNode**:
   ```javascript
   const NodeComponent = createNode({ /* config */ });
   return <NodeComponent id={id} data={data} />;
   ```

## Performance Notes

- Variable extraction runs on every text change (optimized with regex)
- Auto-resize calculates on every change (negligible performance impact)
- Handles are created/destroyed dynamically (React handles efficiently)

## Future Enhancements

- [ ] Support for nested variables `{{user.name}}`
- [ ] Custom variable regex patterns
- [ ] Variable type hints/validation
- [ ] Multi-field variable extraction
- [ ] Variable auto-completion
- [ ] Export/import variable mappings

---

**Updated**: October 19, 2025  
**Version**: 2.0.0  
**Breaking Changes**: None (backward compatible)  
**Status**: ✅ Production Ready
