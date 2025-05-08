import Header from "c:/Users/hp/Desktop/projet_fil_rouge/job_client/src/Components/Header";
import HeroSection from "c:/Users/hp/Desktop/projet_fil_rouge/job_client/src/components/HeroSection";
import Features from "c:/Users/hp/Desktop/projet_fil_rouge/job_client/src/Components/Features";
import Temoignage from "c:/Users/hp/Desktop/projet_fil_rouge/job_client/src/components/Temoignage";
import CallToAction from "c:/Users/hp/Desktop/projet_fil_rouge/job_client/src/Components/CallToAction";
import Footer from "c:/Users/hp/Desktop/projet_fil_rouge/job_client/src/Components/Footer";

const LandingPage2 = () => {
  return (
    <div className="bg-white">
      <Header />
      <HeroSection />
      <Features />
      <Temoignage />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default LandingPage2;