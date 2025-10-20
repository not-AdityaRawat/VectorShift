# Variable System Implementation

## Overview
The visual workflow now supports a dynamic variable system that allows nodes to reference variables from Input and Output nodes using the `{{variable}}` syntax.

## Features Implemented

### 1. Dynamic Handle IDs
**Input Node**: The handle ID now uses the value from the `inputName` field instead of a hardcoded "value".
- Example: If inputName = "user_input", the handle ID becomes "node-1-user_input"
- This makes variable names persistent and accessible across the workflow

**Output Node**: Similarly, the handle ID uses the `outputName` field value.
- Example: If outputName = "result", the handle ID becomes "node-2-result"

**Implementation**: 
- Added `dynamicId` property to handle configuration
- BaseNode now computes `dynamicHandles` by replacing handle IDs with field values
- Changed in `inputNode.jsx` and `outputNode.jsx`

### 2. Variable Extraction
**Text Node**: Already had variable extraction enabled.

**Output Node**: Now supports variable extraction from the `outputType` field.
- Changed field type from 'text' to 'textarea' for multi-line support
- Enabled `enableVariableExtraction: true`
- Set `variableFieldName: 'outputType'`

**How it works**:
- Extracts variables using regex: `/\{\{([a-zA-Z_$][a-zA-Z0-9_$]*)\}\}/g`
- Creates dynamic input handles on the left side for each detected variable
- Displays variable names below the input field

### 3. Autocomplete Dropdown
When users type `{{` in any text or textarea field, an autocomplete dropdown appears showing all available variables.

**Features**:
- Shows all variables from Input and Output nodes
- Displays variable name and type (input/output)
- Filters suggestions as you continue typing after `{{`
- Click to insert: Automatically completes as `{{variableName}}`
- Press ESC to close the dropdown
- Closes when clicking outside

### 4. Auto-Connect Feature
When a variable is detected in a text field (e.g., `{{user_input}}`), the system automatically creates a connection between the source node (Input/Output) and the target node.

**How it works**:
- Detects when variables are extracted from text fields
- Finds the source node that defines the variable (Input or Output node)
- Automatically creates an edge connecting the source to the target
- Prevents duplicate connections (checks if connection already exists)
- Connection appears as an animated arrow from source handle to target handle

**Example**:
1. Create an Input node with name "user_input"
2. Create a Text node and type `{{user_input}}`
3. **Connection is automatically created** from Input node → Text node
4. The connection appears instantly without manual dragging

**Store Enhancement**:
- Added `getAvailableVariables()` function to store.jsx
- Added `autoConnectVariable()` function to automatically create edges
- Collects all variable names from Input and Output nodes
- Returns array of `{ name, type, nodeId }` objects

## Usage

### Creating Variables
1. **Add an Input Node**: Set the "Name" field to define a variable (e.g., "user_input")
2. **Add an Output Node**: Set the "Name" field to define an output variable (e.g., "result")

### Using Variables
1. **In Text Node or Output Node**: Type `{{` to trigger autocomplete
2. **Select a variable** from the dropdown or continue typing to filter
3. **Click or press Enter** to insert the variable as `{{variableName}}`
4. **Connection is automatically created** between the source node and your node

### Manual Connecting (Optional)
If automatic connection doesn't work or you want to reconnect:
1. Variables in Text/Output nodes create **input handles** (left side)
2. Input nodes create **output handles** (right side)
3. Manually drag to connect the handles to flow data between nodes

## Technical Details

### BaseNode Enhancements
- **Dual-state pattern**: Local state + store sync with feedback loop prevention
- **Dynamic handles**: Computed from field values using `dynamicId` property
- **Autocomplete logic**: Detects `{{` trigger, shows filtered variable list
- **Cursor tracking**: Monitors cursor position for intelligent insertion
- **Auto-connect**: Automatically creates edges when variables are detected

### Files Modified
1. `BaseNode.jsx`: Added autocomplete state, logic, UI, and auto-connect on variable detection
2. `store.jsx`: Added `getAvailableVariables()` and `autoConnectVariable()` functions
3. `inputNode.jsx`: Added `dynamicId: 'inputName'` to handle config
4. `outputNode.jsx`: Enabled variable extraction, added dynamic handle

### Performance Optimizations
- All configs are static (created outside components)
- Memoized components to prevent re-renders during drag
- useMemo for dynamic handles and available variables
- Feedback loop prevention with `isUpdatingRef`

## Examples

### Example 1: Simple Data Flow with Auto-Connect
```
1. Drag an Input node, set Name to "user_input"
2. Drag a Text node
3. In Text node, type {{u and select "user_input" from dropdown
4. ✨ Connection automatically appears from Input → Text node
```

### Example 2: Multiple Variables with Auto-Connect
```
1. Create Input node with Name "first_name"
2. Create Input node with Name "last_name"
3. Create Text node and type "{{first_name}} {{last_name}}"
4. ✨ Two connections automatically appear:
   - Input(first_name) → Text
   - Input(last_name) → Text
```

### Example 3: Processing Chain
```
[Input: raw_data] → [LLM: process with {{raw_data}}] → [Text: {{processed}}] → [Output: result]
                    ↑ auto-connected              ↑ auto-connected
```

## Known Limitations
- Variable names must follow JavaScript identifier rules (letters, numbers, underscore, $)
- Variable extraction only works in text and textarea fields
- Autocomplete shows all variables (no scoping based on connections yet)

## Future Enhancements
- Keyboard navigation in autocomplete (up/down arrows, Enter to select)
- Type validation (ensure connected handles have compatible data types)
- Variable preview (show current value when hovering over `{{variable}}`)
- Smart positioning of autocomplete based on cursor position in long text
