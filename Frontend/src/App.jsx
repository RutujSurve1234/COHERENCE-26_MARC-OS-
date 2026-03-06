import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Leads from "./pages/Leads";
import Workflows from "./pages/Workflows";
import WorkflowBuilder from "./pages/WorkflowBuilder";
import "./App.css"; 

function App() {
  return (
    <BrowserRouter>
      {/* Master Flex Container: Prevents body scrolling */}
      <div className="flex h-screen w-full bg-slate-900 text-slate-200 overflow-hidden font-sans">
        
        {/* Fixed Width Sidebar */}
        <div className="w-64 shrink-0 h-full border-r border-slate-800 z-20">
          <Sidebar />
        </div>

        {/* Dynamic Right Side: Takes up exactly the remaining width */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          
          {/* Navbar automatically spans 100% of this flex-1 container */}
          <Navbar />

          {/* Main Content Area: The only part that scrolls */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#0f172a] custom-scrollbar">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/leads" element={<Leads />} />
              
              {/* Workflow Engine Routes */}
              <Route path="/workflows" element={<Workflows />} />
              <Route path="/workflows/builder" element={<WorkflowBuilder />} />
            </Routes>
          </main>
          
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;