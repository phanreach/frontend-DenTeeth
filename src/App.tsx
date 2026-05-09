import { Routes, Route } from "react-router-dom";
import Dashboard from "./dentist/pages/dashboard";
import Home from "./user/pages/home";
import Landing from "./landing/landing";
import SignUp from "./auth/signup";
import Login from "./auth/login";
import ProtectedRoute from "./protect-route";
import AdminDashboard from "./super-admin/page/admin-dashboard";

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/home" element={<Home />} />
      <Route path="/" element={<Landing />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
