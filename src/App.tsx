import { Routes, Route } from "react-router-dom";
import Dashboard from "./dentist/pages/dashboard";
import Home from "./user/pages/home";

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
