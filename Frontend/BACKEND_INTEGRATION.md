# Frontend-Backend Integration Documentation

## Overview
Complete integration between the React/Vite frontend and FastAPI backend that allows users to submit their pipeline and receive analysis about the graph structure.

---

## What Was Implemented

### 1. Backend Endpoint (`/backend/main.py`)

#### New Features
- **CORS Middleware** - Allows frontend requests from localhost:5173 (Vite)
- **POST /pipelines/parse** - Accepts pipeline data and returns analysis
- **DAG Detection Algorithm** - Uses Depth-First Search to detect cycles
- **Pydantic Models** - Type-safe request validation

#### Endpoint Details

**URL:** `POST http://localhost:8000/pipelines/parse`

**Request Body:**
```json
{
  "nodes": [
    {
      "id": "customInput-1",
      "type": "customInput",
      "position": { "x": 100, "y": 100 },
      "data": { "inputName": "input_1", "inputType": "Text" }
    }
  ],
  "edges": [
    {
      "id": "reactflow__edge-customInput-1-text-1",
      "source": "customInput-1",
      "target": "text-1"
    }
  ]
}
```

**Response:**
```json
{
  "num_nodes": 3,
  "num_edges": 2,
  "is_dag": true
}
```

#### DAG Detection Algorithm

```python
def is_dag(nodes: List[Dict], edges: List[Dict]) -> bool:
    """
    Detects cycles using DFS with recursion stack tracking.
    
    Algorithm:
    1. Build adjacency list from edges
    2. For each unvisited node:
       - Mark as visited and add to recursion stack
       - Recursively visit all neighbors
       - If neighbor is in recursion stack → cycle found
       - Remove from recursion stack after processing
    3. If no cycles found → it's a DAG
    """
```

**Time Complexity:** O(V + E) where V = nodes, E = edges
**Space Complexity:** O(V) for visited and recursion stack

---

### 2. Frontend Submit Button (`/frontend/src/components/submit.jsx`)

#### New Features
- **Zustand Store Integration** - Accesses current nodes and edges
- **Async API Call** - Sends POST request to backend
- **Error Handling** - Catches network errors and displays user-friendly messages
- **User-Friendly Alert** - Displays results in a formatted alert

#### Implementation

```javascript
const handleSubmit = async () => {
  try {
    // Send pipeline data
    const response = await fetch('http://localhost:8000/pipelines/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodes, edges }),
    });

    const data = await response.json();
    
    // Display results
    alert(`
      ✓ Number of Nodes: ${data.num_nodes}
      ✓ Number of Edges: ${data.num_edges}
      ✓ Is DAG: ${data.is_dag ? 'Yes ✓' : 'No ✗'}
    `);
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
};
```

---

## Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd e:\frontend_technical_assessment-20251016T095008Z-1-001\frontend_technical_assessment\backend
   ```

2. **Install dependencies:**
   ```bash
   pip install fastapi uvicorn pydantic
   ```

3. **Run the server:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

4. **Verify it's running:**
   - Open browser to `http://localhost:8000`
   - Should see: `{"Ping": "Pong"}`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd e:\VectorShift\Frontend
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Run the dev server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - Navigate to `http://localhost:5173`

---

## Testing Guide

### Test Case 1: Simple Valid DAG

**Steps:**
1. Drag an **Input** node onto the canvas
2. Drag a **Text** node onto the canvas
3. Drag an **Output** node onto the canvas
4. Connect: Input → Text → Output
5. Click **Submit** button

**Expected Result:**
```
Pipeline Analysis Results:

✓ Number of Nodes: 3
✓ Number of Edges: 2
✓ Is DAG (Directed Acyclic Graph): Yes ✓

✅ Your pipeline is valid! It forms a proper DAG with no cycles.
```

---

### Test Case 2: Pipeline with Cycle (Not a DAG)

**Steps:**
1. Drag 3 **Text** nodes onto the canvas (Text-1, Text-2, Text-3)
2. Connect: Text-1 → Text-2
3. Connect: Text-2 → Text-3
4. Connect: Text-3 → Text-1 (creates a cycle!)
5. Click **Submit** button

**Expected Result:**
```
Pipeline Analysis Results:

✓ Number of Nodes: 3
✓ Number of Edges: 3
✓ Is DAG (Directed Acyclic Graph): No ✗

⚠️ Warning: Your pipeline contains cycles and is not a valid DAG.
```

---

### Test Case 3: Complex DAG with Variables

**Steps:**
1. Create an Input node
2. Create a Text node with variables: `{{input}} and {{data}}`
3. Create an LLM node
4. Create an Output node
5. Connect: Input → Text (to the 'input' handle)
6. Connect: Text → LLM
7. Connect: LLM → Output
8. Click **Submit**

**Expected Result:**
```
Pipeline Analysis Results:

✓ Number of Nodes: 4
✓ Number of Edges: 3
✓ Is DAG (Directed Acyclic Graph): Yes ✓

✅ Your pipeline is valid! It forms a proper DAG with no cycles.
```

---

### Test Case 4: Empty Pipeline

**Steps:**
1. Don't add any nodes
2. Click **Submit** button

**Expected Result:**
```
Pipeline Analysis Results:

✓ Number of Nodes: 0
✓ Number of Edges: 0
✓ Is DAG (Directed Acyclic Graph): Yes ✓

✅ Your pipeline is valid! It forms a proper DAG with no cycles.
```
*(An empty graph is technically a DAG)*

---

### Test Case 5: Backend Not Running

**Steps:**
1. Stop the backend server (Ctrl+C)
2. Create a simple pipeline
3. Click **Submit** button

**Expected Result:**
```
Error submitting pipeline: Failed to fetch

Make sure the backend server is running on http://localhost:8000
```

---

## API Contract

### Request Format

```typescript
interface PipelineData {
  nodes: Array<{
    id: string;
    type: string;
    position: { x: number; y: number };
    data: Record<string, any>;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    [key: string]: any;
  }>;
}
```

### Response Format

```typescript
interface PipelineResponse {
  num_nodes: number;    // Count of nodes in pipeline
  num_edges: number;    // Count of edges in pipeline
  is_dag: boolean;      // true if DAG, false if contains cycles
}
```

### Error Response

```typescript
interface ErrorResponse {
  detail: string;       // Error message
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid data)
- `422` - Validation Error (missing fields)
- `500` - Internal Server Error

---

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (Vite default)
- `http://localhost:3000` (Alternative React port)

**To add more origins:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://your-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Troubleshooting

### Issue: CORS Error

**Error Message:**
```
Access to fetch at 'http://localhost:8000/pipelines/parse' from origin 
'http://localhost:5173' has been blocked by CORS policy
```

**Solution:**
- Verify backend is running
- Check CORS middleware is configured
- Ensure frontend URL matches allowed origins

---

### Issue: Connection Refused

**Error Message:**
```
Error submitting pipeline: Failed to fetch
```

**Solution:**
1. Check backend is running: `http://localhost:8000`
2. Verify port 8000 is not in use by another process
3. Check firewall settings

---

### Issue: 422 Validation Error

**Error Message:**
```
{
  "detail": [
    {
      "loc": ["body", "nodes"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

**Solution:**
- Ensure request body contains both `nodes` and `edges` arrays
- Check JSON format is correct
- Verify Content-Type header is set

---

## DAG Detection Examples

### Example 1: Valid DAG (Tree Structure)
```
    A
   / \
  B   C
  |   |
  D   E
```
**Result:** `is_dag = true` (no cycles)

### Example 2: Valid DAG (Diamond)
```
    A
   / \
  B   C
   \ /
    D
```
**Result:** `is_dag = true` (multiple paths but no cycles)

### Example 3: Invalid (Simple Cycle)
```
  A → B
  ↑   ↓
  └─ C
```
**Result:** `is_dag = false` (cycle detected: A→B→C→A)

### Example 4: Invalid (Self Loop)
```
  A ↻
```
**Result:** `is_dag = false` (node connects to itself)

---

## File Changes Summary

### Backend (`/backend/main.py`)
- ✅ Added CORS middleware
- ✅ Changed endpoint from GET to POST
- ✅ Added Pydantic model for request validation
- ✅ Implemented DAG detection algorithm
- ✅ Added proper error handling
- ✅ Returns structured JSON response

### Frontend (`/frontend/src/components/submit.jsx`)
- ✅ Integrated Zustand store to access nodes/edges
- ✅ Added async fetch call to backend
- ✅ Implemented error handling
- ✅ Created user-friendly alert message
- ✅ Added visual indicators (✓, ✗, ✅, ⚠️)

---

## Future Enhancements (Optional)

1. **Better UI for Results**
   - Replace alert with modal dialog
   - Add visualization of DAG structure
   - Highlight cycles in the graph

2. **Additional Analysis**
   - Count of disconnected components
   - Identify source nodes (no incoming edges)
   - Identify sink nodes (no outgoing edges)
   - Longest path in DAG

3. **Pipeline Validation**
   - Check for required node connections
   - Validate variable references in Text nodes
   - Ensure all variables have inputs connected

4. **Performance**
   - Add loading spinner during API call
   - Cache results for unchanged pipelines
   - Debounce submit button

5. **Error Details**
   - Show which nodes form cycles
   - Provide suggestions to fix issues
   - Visual highlighting of problematic connections

---

## Summary

### ✅ Implementation Complete

**Backend:**
- POST endpoint accepts nodes and edges
- Counts nodes and edges correctly
- Detects cycles using DFS algorithm
- Returns structured JSON response

**Frontend:**
- Submit button sends pipeline to backend
- Displays results in user-friendly alert
- Handles errors gracefully
- Shows DAG status with visual indicators

**Integration:**
- CORS configured correctly
- Full end-to-end flow working
- Error handling on both sides
- Type-safe API contract

**Ready to Test!** 🚀

1. Start backend: `uvicorn main:app --reload --port 8000`
2. Start frontend: `npm run dev`
3. Create pipeline
4. Click Submit
5. See results!
