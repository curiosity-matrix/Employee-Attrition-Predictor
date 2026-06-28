import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import Predictor from './components/Predictor';
import Insights from './components/Insights';
import Footer from './components/Footer';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');

  const scrollTo = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar scrollTo={scrollTo} activeSection={activeSection} />
      <main>
        <section id="home"><Hero scrollTo={scrollTo} /></section>
        <section id="dashboard"><Dashboard /></section>
        <section id="predictor"><Predictor /></section>
        <section id="insights"><Insights /></section>
      </main>
      <Footer />
    </div>
  );
}
