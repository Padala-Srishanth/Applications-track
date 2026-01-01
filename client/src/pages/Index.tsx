import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Footer from "@/components/landing/Footer";
import { Helmet } from "react-helmet";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>JobTrackr - Track Your Job Applications Like a Pro</title>
        <meta name="description" content="Stop losing track of applications. JobTrackr helps you organize, monitor, and optimize your job search with intelligent automation and beautiful insights." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Hero />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
