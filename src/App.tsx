import { Routes, Route } from "react-router-dom";
import Dashboard from "./dentist/pages/dashboard";
import Calendar from "./dentist/pages/calendar";
import Home from "./user/pages/home";
import Landing from "./landing/landing";
import SignUp from "./auth/signup";
import Login from "./auth/login";
import ProtectedRoute from "./protect-route";
import AdminDashboard from "./super-admin/page/admin-dashboard";
import VerifyEmail from "./auth/verify-email";
import Layout from "./layout";
import Dentist from "./landing/dentist";
import AIScan from "./landing/ai-scan";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/dentist" element={<Dentist />} />
      <Route path="/scan" element={<AIScan />} />
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route element={<Layout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["PATIENT"]} />}>
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["DENTIST"]} />}>
        <Route element={<Layout />}>
          <Route path="/dentist/dashboard" element={<Dashboard />} />
          <Route path="/dentist/calendar" element={<Calendar />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
