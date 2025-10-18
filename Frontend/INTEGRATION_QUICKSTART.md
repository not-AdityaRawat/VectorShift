# Quick Start: Testing the Integration

## 🚀 Start Both Servers

### Terminal 1: Backend
```powershell
cd e:\frontend_technical_assessment-20251016T095008Z-1-001\frontend_technical_assessment\backend
pip install fastapi uvicorn pydantic
uvicorn main:app --reload --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Terminal 2: Frontend
```powershell
cd e:\VectorShift\Frontend
npm run dev
```

**Expected Output:**
```
VITE v7.1.10  ready in 265 ms

➜  Local:   http://localhost:5173/
```

---

## 🧪 Quick Test

1. **Open Browser:** `http://localhost:5173`

2. **Create a Simple Pipeline:**
   - Drag **Input** node → position at (100, 100)
   - Drag **Text** node → position at (300, 100)
   - Drag **Output** node → position at (500, 100)
   - **Connect:** Input → Text → Output

3. **Click Submit Button** (top navbar, cyan button with rocket icon)

4. **Expected Alert:**
   ```
   Pipeline Analysis Results:
   
   ✓ Number of Nodes: 3
   ✓ Number of Edges: 2
   ✓ Is DAG (Directed Acyclic Graph): Yes ✓
   
   ✅ Your pipeline is valid! It forms a proper DAG with no cycles.
   ```

---

## 🔄 Test Cycle Detection

1. **Create a Cycle:**
   - Drag 3 **Text** nodes
   - Connect: Text-1 → Text-2
   - Connect: Text-2 → Text-3
   - Connect: Text-3 → Text-1 (creates cycle!)

2. **Click Submit**

3. **Expected Alert:**
   ```
   Pipeline Analysis Results:
   
   ✓ Number of Nodes: 3
   ✓ Number of Edges: 3
   ✓ Is DAG (Directed Acyclic Graph): No ✗
   
   ⚠️ Warning: Your pipeline contains cycles and is not a valid DAG.
   ```

---

## ✅ What to Verify

- [x] Backend responds at `http://localhost:8000`
- [x] Frontend loads at `http://localhost:5173`
- [x] Submit button appears in navbar
- [x] Clicking Submit sends request to backend
- [x] Alert displays num_nodes, num_edges, is_dag
- [x] DAG detection works correctly
- [x] Error handling works (try stopping backend)

---

## 🐛 Troubleshooting

### Backend not starting?
```powershell
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Use different port if needed
uvicorn main:app --reload --port 8001
# Then update frontend URL in submit.jsx
```

### Frontend not connecting?
- Check browser console for CORS errors
- Verify backend URL in submit.jsx: `http://localhost:8000`
- Ensure both servers are running

### Alert not showing?
- Open browser DevTools (F12)
- Check Console for errors
- Verify fetch request completes

---

## 🎉 Success!

If you see the alert with pipeline analysis, the integration is working perfectly!

**Next Steps:**
- Try different pipeline configurations
- Test with Text node variables
- Experiment with complex DAG structures
