# Performance Fix - Node Rendering Optimization

## Problem
All nodes were re-rendering continuously when dragging any single node, causing:
- Poor performance during drag operations
- Text input fields losing focus and making typing difficult
- Unnecessary recalculations of variables, widths, and layouts
- Inputs reverting to previous state
- Dropdowns closing immediately after opening

## Root Causes

### 1. **Entire `data` object as useEffect dependency**
The `data` prop gets a new reference on every position change during dragging, even though field values haven't changed. This caused all `useEffect` hooks to re-run continuously.

### 2. **Missing local state in BaseNode**
Input fields were controlled directly by store data without local state buffer, causing:
- Re-renders from store updates losing input focus
- Inputs reverting to previous values immediately
- Dropdowns closing before selection could be made

### 3. **No memoization**
Components weren't memoized, so unrelated node changes caused all nodes to re-render.

## Solutions Implemented

### 1. **Added local field state with store sync in BaseNode** (BaseNode.jsx)
```javascript
// Local state for responsive UI
const [fieldValues, setFieldValues] = useState(() => {
  const initialValues = {};
  fields.forEach(field => {
    if (field.name) {
      initialValues[field.name] = data?.[field.name] || '';
    }
  });
  return initialValues;
});

// Sync with store when data changes from outside
useEffect(() => {
  const newValues = {};
  let hasChanges = false;
  fields.forEach(field => {
    if (field.name && data?.[field.name] !== undefined) {
      newValues[field.name] = data[field.name];
      if (newValues[field.name] !== fieldValues[field.name]) {
        hasChanges = true;
      }
    }
  });
  if (hasChanges) {
    setFieldValues(prev => ({ ...prev, ...newValues }));
  }
}, [data, fields]);

// Handle field changes - update both local state and store
const handleFieldChange = (fieldName, value) => {
  setFieldValues(prev => ({ ...prev, [fieldName]: value }));
  updateNodeField(id, fieldName, value);
};
```

### 2. **Memoized field values for performance**
```javascript
// Only track changes to specific field value, not entire data object
const fieldValue = useMemo(() => fieldValues[variableFieldName], [fieldValues[variableFieldName]]);

// Updated useEffect hooks to depend on fieldValue instead of data
useEffect(() => {
  // Variable extraction logic
}, [fieldValue, enableVariableExtraction]);
```

### 3. **Added React.memo to BaseNode**
```javascript
export const BaseNode = memo(BaseNodeComponent, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data) &&
    prevProps.config === nextProps.config
  );
});
```

### 4. **Simplified node field definitions**

**Before:**
```javascript
fields: [
  {
    label: 'Text',
    name: 'text',
    type: 'textarea',
    onChange: (nodeId, field, value) => {
      setCurrText(value);  // ❌ Redundant
      updateNodeField(nodeId, field, value);
    }
  }
]
```

**After:**
```javascript
fields: [
  {
    label: 'Text',
    name: 'text',
    type: 'textarea'
    // ✅ BaseNode handles onChange automatically
  }
]
```

### 5. **Memoized createNode factory** (nodeFactory.jsx)
```javascript
export const createNode = (config) => {
  const NodeComponent = ({ id, data }) => {
    return <BaseNode id={id} data={data} config={config} />;
  };
  
  return memo(NodeComponent);  // ✅ Prevent unnecessary re-renders
};
```

## Files Modified

1. **BaseNode.jsx**
   - Added `fieldValues` state for local input buffering
   - Added `handleFieldChange` to update both local and store state
   - Added sync effect to update local state from store changes
   - Memoized `fieldValue` extraction
   - Updated all input/select/textarea to use `fieldValues`
   - Wrapped component with `memo`

2. **nodeFactory.jsx**
   - Added `memo` wrapper to created nodes

3. **All node files** (inputNode.jsx, outputNode.jsx, textNode.jsx, commentNode.jsx, validatorNode.jsx)
   - Removed `useState` imports
   - Removed `useStore` imports (no longer needed)
   - Removed custom `onChange` handlers from field definitions
   - Wrapped exports with `memo`
   - Simplified to just config objects

## How It Works

1. **User types in input** → `handleFieldChange` updates local state immediately (responsive UI)
2. **Local state updates** → Store is updated via `updateNodeField`
3. **Store updates** → Other nodes/components can react
4. **External changes** → Sync effect detects and updates local state
5. **Dragging nodes** → Memoization prevents unnecessary re-renders

## Performance Improvements

✅ **Dragging nodes is smooth** - Memoization prevents re-renders  
✅ **Text input is seamless** - Local state buffer prevents focus loss  
✅ **Dropdowns work properly** - No premature closing  
✅ **Inputs don't revert** - Local state maintains user input  
✅ **Variable extraction optimized** - Only runs when content changes  
✅ **Auto-resize calculations optimized**  
✅ **Overall canvas performance significantly improved**

## Testing Checklist

- [x] Drag nodes smoothly without lag
- [x] Type in text fields without losing focus or reverting
- [x] Select from dropdowns without premature closing
- [x] Variable extraction still works correctly
- [x] Auto-resize still functions properly
- [x] All node types render correctly
- [x] Store updates persist properly
- [x] No console errors

## Technical Notes

- The dual-state pattern (local + store) is essential for responsive UI with centralized state management
- Local state acts as a buffer, preventing re-render issues while maintaining single source of truth in store
- The sync effect ensures external changes (like undo/redo) properly update the UI
- Using `memo` comparison with `JSON.stringify` for data is acceptable here since node data objects are small
- `onChange` handlers in field configs are optional - BaseNode provides default behavior

