import Footer from "../components/footer";
import Navbar from "../components/nav-bar";
import Hero from "./hero";
import Feature from "./feature";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Feature />
      <Footer />
    </div>
  );
}
