# Comment Node Documentation

## Overview
The **Comment Node** is a special annotation node designed to add notes, documentation, and comments to your flow diagrams. Unlike other nodes, it doesn't process data but serves as a visual documentation tool.

## Features

### 1. **Customizable Title**
- Editable title field in the header
- Click on the title to edit it inline
- Default title: "Comment"

### 2. **Rich Text Area**
- Multi-line text area for detailed notes
- Auto-resizes based on content
- Minimum height of 80px
- Supports large amounts of text

### 3. **Color Customization**
- 7 pre-defined color themes:
  - 🟨 Yellow (default)
  - 🟪 Pink
  - 🟦 Blue
  - 🟩 Green
  - 🟣 Purple
  - 🟧 Orange
  - ⬜ Gray
- Easy color picker dropdown in the header

### 4. **Font Size Options**
- **Small** (`text-xs`): Compact notes
- **Medium** (`text-sm`): Default size
- **Large** (`text-base`): Emphasis on important notes

### 5. **Minimize/Expand**
- Toggle button to minimize the comment node
- Minimized view shows a preview (first 50 characters)
- Saves space while keeping comments accessible
- Icon rotates to indicate state

### 6. **Smart Width Adjustment**
- Automatically adjusts width based on content
- Minimum width: 250px
- Maximum width: 500px
- Considers both comment text and title length

### 7. **Character & Word Counter**
- Real-time character count
- Real-time word count
- Displayed at the bottom of expanded view

### 8. **Delete Functionality**
- X button in the top-right corner
- Integrated with the store's node management
- Removes node from the flow

### 9. **Persistent State**
- All settings are stored in the node's data
- Settings persist across sessions:
  - Comment text
  - Title
  - Background color
  - Font size
  - Minimized state

## Visual Design

### Styling
- **Border**: 2px solid gray with rounded corners
- **Shadow**: Elevated with a subtle shadow
- **Background**: Customizable with semi-transparent overlay
- **Controls**: Inline style controls for easy access

### Layout
```
┌─────────────────────────────────────┐
│ 🗨️ [Title]          [Minimize] [X] │
│ ───────────────────────────────────  │
│ 🎨 [Color] 📝 [Font Size]           │
├─────────────────────────────────────┤
│                                     │
│  [Comment Text Area]                │
│                                     │
├─────────────────────────────────────┤
│ 123 characters        45 words      │
└─────────────────────────────────────┘
```

## Usage

### Basic Usage
1. Drag the **Comment** node from the toolbar
2. Drop it anywhere on the canvas
3. Click the title to rename
4. Type your notes in the text area

### Customization
1. Click the **color dropdown** (🎨) to change background
2. Click the **font size dropdown** (📝) to adjust text size
3. Click the **minimize button** (☰) to collapse/expand

### Best Practices
- Use different colors to categorize comments (e.g., yellow for notes, pink for warnings)
- Minimize comments when you need more canvas space
- Use larger font sizes for important high-level notes
- Keep section titles descriptive

## Technical Details

### Props
```javascript
{
  id: string,              // Unique node identifier
  data: {
    comment: string,       // Comment text content
    title: string,         // Node title
    bgColor: string,       // Tailwind color class
    fontSize: string,      // Tailwind font size class
    isMinimized: boolean   // Minimized state
  }
}
```

### State Management
- Uses Zustand store for node operations
- `updateNodeField()` for persisting data
- `onNodesChange()` for deletion

### Dependencies
- `lucide-react`: Icons (MessageSquare, CircleX, Palette, Type, AlignLeft)
- `reactflow`: Core functionality
- `zustand`: State management

## Integration

### Register in `ui.jsx`
```javascript
import { CommentNode } from '../nodes/commentNode';

const nodeTypes = {
  // ... other nodes
  comment: CommentNode,
};
```

### Add to Toolbar (`toolbar.jsx`)
```javascript
import { MessageSquare } from 'lucide-react';

const nodeTypeMap = {
  // ... other nodes
  'comment': { 
    type: 'comment', 
    label: 'Comment', 
    icon: <MessageSquare/> 
  },
};
```

### Enable in Active Nodes
Add `'comment'` to the `activeNodes` array where you initialize the toolbar.

## Comparison with Other Nodes

| Feature | Text Node | Comment Node |
|---------|-----------|--------------|
| Data Processing | ✅ Yes | ❌ No |
| Handles | ✅ Input/Output | ❌ None |
| Purpose | Data transformation | Documentation |
| Customization | Limited | Extensive |
| Minimizable | ❌ No | ✅ Yes |
| Color Options | Fixed | 7 choices |

## Future Enhancements
- Markdown rendering support
- Rich text formatting
- Emoji picker
- Sticky note style variants
- Collaborative comments
- Timestamp tracking
- @mentions for team collaboration

---

**Created**: October 19, 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
