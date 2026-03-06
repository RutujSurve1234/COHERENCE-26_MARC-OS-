import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";

function AppContent() {
  return (
    <div className="flex">

      {/* Sidebar always visible */}
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">

        {/* Navbar */}
        <Navbar />

        {/* Pages */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>

      </div>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;