import { useEffect } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import Navbar from '../components/homepage/Navbar.jsx';
import HeroSection from '../components/homepage/HeroSection.jsx';
import PhilosophySection from '../components/homepage/PhilosophySection.jsx';
import GrowthStorySection from '../components/homepage/GrowthStorySection.jsx';
import MetricsSection from '../components/homepage/MetricsSection.jsx';
import DashboardShowcase from '../components/homepage/DashboardShowcase.jsx';
import ReferralNetworkSection from '../components/homepage/ReferralNetworkSection.jsx';
import TransparencySection from '../components/homepage/TransparencySection.jsx';
import SecuritySection from '../components/homepage/SecuritySection.jsx';
import FinalCTA from '../components/homepage/FinalCTA.jsx';
import Footer from '../components/homepage/Footer.jsx';
import '../styles/homepage.css';

const HomePage = () => {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Scroll to top on initial page mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="vestora-home">
      <Navbar />
      <main>
        <HeroSection reducedMotion={reducedMotion} />
        <PhilosophySection reducedMotion={reducedMotion} />
        <GrowthStorySection reducedMotion={reducedMotion} />
        <MetricsSection reducedMotion={reducedMotion} />
        <DashboardShowcase reducedMotion={reducedMotion} />
        <ReferralNetworkSection reducedMotion={reducedMotion} />
        <TransparencySection reducedMotion={reducedMotion} />
        <SecuritySection reducedMotion={reducedMotion} />
        <FinalCTA reducedMotion={reducedMotion} />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
