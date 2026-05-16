import Footer from "../components/footer";
import Navbar from "../components/nav-bar";
import Hero from "./hero";
import Feature from "./feature";
import AboutUs from "./about-us";
import Vision from "./vision";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Feature />

      <div className="mx-auto max-w-7xl px-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
      </div>

      <AboutUs />
      <Vision />
      <Footer />
    </div>
  );
}
