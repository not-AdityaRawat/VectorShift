# Text Node - Quick Start Guide

## 🎯 Two Main Features

### 1. Dynamic Sizing ↔️
The node automatically adjusts its size based on your text:

```
Short text → Small node (200px)
Medium length text here → Medium node (~280px)
This is a very long line of text that will make the node wider → Large node (400px)
```

### 2. Variable Detection 🔌
Type `{{variableName}}` and get automatic input handles!

---

## ⚡ Quick Examples

### Example 1: Email Template
```
Type this:
┌────────────────────────────────┐
│ Dear {{customerName}},         │
│                                │
│ Your order {{orderId}} is      │
│ ready for pickup!              │
└────────────────────────────────┘

You get:
  customerName ◄─┐
     orderId   ◄─┼─ Text Node ─► output
```

### Example 2: Dynamic Message
```
Type this:
┌────────────────────────────────┐
│ Hello {{name}}, you have       │
│ {{count}} new messages!        │
└────────────────────────────────┘

You get:
  name  ◄─┐
  count ◄─┼─ Text Node ─► output
```

### Example 3: No Variables
```
Type this:
┌────────────────────────────────┐
│ Just plain text here           │
└────────────────────────────────┘

You get:
             Text Node ─► output
             (no input handles)
```

---

## ✅ Valid Variable Names

```javascript
{{input}}       ✅
{{userName}}    ✅
{{user_name}}   ✅
{{data123}}     ✅
{{$value}}      ✅
{{_private}}    ✅
```

## ❌ Invalid Variable Names

```javascript
{{123data}}     ❌ Starts with number
{{user-name}}   ❌ Contains hyphen
{{user name}}   ❌ Contains space
{{user.name}}   ❌ Contains dot
```

---

## 🎨 Features at a Glance

| Feature | Description |
|---------|-------------|
| **Auto Width** | 200px - 400px based on text length |
| **Auto Height** | Expands as you add lines |
| **Variable Regex** | `/\{\{([a-zA-Z_$][a-zA-Z0-9_$]*)\}\}/g` |
| **Handle Position** | Left side, evenly spaced |
| **Handle Labels** | Variable name shown next to handle |
| **Deduplication** | Same variable = 1 handle |
| **Real-time Update** | Changes reflect immediately |

---

## 💡 Pro Tips

1. **Use descriptive variable names**
   ```
   ✅ {{firstName}} {{lastName}}
   ❌ {{a}} {{b}}
   ```

2. **Check the variables panel**
   - Shows all detected variables
   - Located below the textarea

3. **Multiple lines work great**
   - Node height adjusts automatically
   - No need to resize manually

4. **Variables update in real-time**
   - Type `{{new}}` → handle appears instantly
   - Delete `{{old}}` → handle disappears

5. **Monospace font helps**
   - Easy to spot `{{variables}}`
   - Better alignment for templates

---

## 🔧 Common Use Cases

### 1. Email Templates
```
Subject: Order Confirmation {{orderNumber}}

Dear {{customerName}},

Thank you for your order!
```

### 2. Dynamic Messages
```
Welcome back, {{username}}!
You have {{unreadCount}} unread messages.
Last login: {{lastLogin}}
```

### 3. Data Formatting
```
User: {{name}} (ID: {{userId}})
Status: {{status}}
Role: {{role}}
```

### 4. Conditional Text
```
Hello {{name}},
{{greeting}}
{{message}}
```

---

## 🚀 Try It Now!

1. Drag a **Text** node onto the canvas
2. Type: `Hello {{name}}, welcome to {{app}}!`
3. Watch as:
   - Node width adjusts
   - 2 input handles appear (name, app)
   - Labels show next to handles
   - Variables panel displays: "name, app"

That's it! Your enhanced Text node is ready to use! 🎉
