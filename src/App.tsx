import { Routes, Route } from "react-router-dom";
import Dashboard from "./dentist/pages/dashboard";
import Home from "./user/pages/home";
import Landing from "./landing/landing";
import SignUp from "./auth/signup";

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/home" element={<Home />} />
      <Route path="/" element={<Landing />} />
      <Route path="/sign-up" element={<SignUp />} />
    </Routes>
  );
}

export default App;
