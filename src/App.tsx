import { Routes, Route } from "react-router-dom";
import Dashboard from "./dentist/pages/dashboard";
import Calendar from "./dentist/pages/calendar";
import ServiceConfiguration from "./dentist/pages/service-configuration";
import Appointments from "./dentist/pages/appointments";
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
import Patient from "./super-admin/page/patients";
import Dentists from "./super-admin/page/dentists";
import Roles from "./super-admin/page/roles";
import History from "./user/pages/history";
import FindDentist from "./user/pages/find-dentist";
import DentistDetail from "./user/pages/dentist-detail";
import AiScan from "./user/pages/ai-scan";

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
          <Route path="/admin/patients" element={<Patient />} />
          <Route path="/admin/dentists" element={<Dentists />} />
          <Route path="/admin/roles" element={<Roles />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["PATIENT"]} />}>
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/find-dentist" element={<FindDentist />} />
          <Route path="/ai-scan" element={<AiScan />} />
          <Route path="/history" element={<History />} />
          <Route path="/find-dentist/:dentistId" element={<DentistDetail />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["DENTIST"]} />}>
        <Route element={<Layout />}>
          <Route path="/dentist/dashboard" element={<Dashboard />} />
          <Route path="/dentist/appointments" element={<Appointments />} />
          <Route path="/dentist/calendar" element={<Calendar />} />
          <Route path="/dentist/service-configuration" element={<ServiceConfiguration />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
