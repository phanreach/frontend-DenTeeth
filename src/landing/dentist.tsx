import DentistCard from "./dentist-card";
import Footer from "../components/footer";
import Navbar from "../components/nav-bar";
import { dentists } from "../components/constants/data-dummy";

export default function Dentist() {
  return (
    <div className="min-h-screen bg-[#eef3ff]">
      <Navbar />
      <div className="space-y-4 mx-auto w-full max-w-7xl px-6 py-10">
        <h1 className="font-bold text-4xl">Recommended Dental Care</h1>
        <p className="text-gray-500">Meet professionals in your area</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dentists.map((dentist) => (
            <DentistCard key={dentist.id} data={dentist} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
