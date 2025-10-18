# Modern Navbar Component

## Overview
A sleek, modern navbar component built with shadcn/ui that matches the layout from the VectorShift workbook interface but with a unique visual style.

## Features

### Visual Design
- **Gradient Background**: Subtle gradient from white to stone tones with backdrop blur for a glassmorphism effect
- **Smooth Animations**: All interactive elements feature smooth transitions and hover effects
- **Active Tab Indicator**: Animated gradient underline for the active tab with pulse effect
- **Gradient Buttons**: Primary action buttons (Deploy Changes, Run) use eye-catching gradients
  - Deploy: Blue to Indigo gradient
  - Run: Emerald to Teal gradient
- **Hover Effects**: Scale transforms and color transitions on all interactive elements

### Layout Structure

#### Top Bar
- **Left Section**: Breadcrumb navigation
  - Workbooks → Untitled Workbook → Current Document
  - Settings icon for quick access
  
- **Right Section**: Action buttons
  - Help (with help circle icon)
  - View Traces (with history icon)
  - Version History (with history icon)
  - Separator
  - Deploy Changes (primary button with gradient)
  - Run (primary button with gradient)
  - Export (ghost button)
  - Settings icon

#### Tab Navigation
Eight navigation tabs:
- Start (with layers icon)
- Objects
- Knowledge
- AI
- Integrations
- Logic
- Data
- Chat

Active tab is highlighted with blue text and animated gradient underline.

## Usage

```jsx
import { Navbar } from './components/Navbar';

function App() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      {/* Your content */}
    </div>
  );
}
```

## Dependencies
- shadcn/ui Button component
- shadcn/ui Separator component
- lucide-react icons
- Tailwind CSS (with stone color palette)

## Customization

### Colors
The navbar uses the Stone color palette. To change:
- Update `from-stone-*` and `to-stone-*` classes
- Modify gradient colors in button classes

### Icons
Icons from lucide-react can be swapped:
```jsx
import { YourIcon } from 'lucide-react';
```

### Tabs
Add or remove tabs by modifying the `tabs` array:
```jsx
const tabs = [
  { id: 'TabId', label: 'Tab Label', icon: OptionalIcon },
  // ...
];
```

## Styling Philosophy
- **Modern & Clean**: Minimalist design with strategic use of gradients
- **Smooth Interactions**: 200-300ms transitions for polished feel
- **Glassmorphism**: Backdrop blur and layered backgrounds
- **Visual Hierarchy**: Clear distinction between primary, secondary, and tertiary actions
- **Accessibility**: Proper hover states and focus indicators

## Dev Server
Currently running at: http://localhost:5173/

View the navbar live in your browser!
