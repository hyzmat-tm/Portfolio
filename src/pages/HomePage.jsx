import Navbar from "../sections/Navbar";
import Hero from "../sections/Hero";
import About from "../sections/About";
import Experiences from "../sections/Experiences";
import Testimonial from "../sections/Testimonial";
import Contact from "../sections/Contact";
import Footer from "../sections/Footer";

const HomePage = () => {
  return (
    <div className="container mx-auto max-w-7xl">
      <Navbar />
      <Hero />
      <About />
      <Experiences />
      <Testimonial />
      <Contact />
      <Footer />
    </div>
  );
};

export default HomePage;
