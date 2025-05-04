// AboutUs.tsx
import React from 'react';
import './AboutUs.css';
import Evans from '../assets/evans.jpg'
import Blaicy from '../assets/blaicy.jpg'
import Godwill from '../assets/Godwill.jpg'
import Arnold from '../assets/Arnold.jpg'
const AboutUs: React.FC = () => {
  return (
    <div className="about-us-container">
      <section className="about-hero">
        <h1>Our Dairy Journey</h1>
        <p className="hero-subtitle">From farm to table with love and care</p>
      </section>

      <section className="mission-section">
        <div className="mission-content">
          <h2>Our Inspiration</h2>
          <p>
            Growing up on a small family farm, we witnessed firsthand the challenges dairy farmers face.
            Our platform was born from a desire to modernize cattle management while preserving the
            traditional values of animal care and sustainable farming.
          </p>
          <p>
            We believe technology should empower farmers, not complicate their lives. That's why we've
            created intuitive tools to track everything from milk production to veterinary care - all
            in one place.
          </p>
        </div>
        <div className="mission-image">
          <img 
            src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=500&auto=format&fit=crop" 
            alt="Family farm inspiration"
            className="rounded-image"
          />
        </div>
      </section>

      <section className="team-section">
        <h2>Meet Our Herd</h2>
        <div className="team-grid">
          <div className="team-member">
            <img 
              src={Evans}
              alt="Farm founder"
              className="rounded-image"
            />
            <h3>Evans Langat</h3>
            <p>Frontend Developer</p>
          </div>
          <div className="team-member">
            <img 
              src={Godwill} 
              alt="Veterinary expert"
              className="rounded-image"
            />
            <h3>Godwill Lihanda</h3>
            <p>Research Operations Specialist</p>
          </div>
          <div className="team-member">
            <img 
              src={Blaicy} 
              alt="Farm operations"
              className="rounded-image"
            />
            <h3>Blaicy Kerubo</h3>
            <p>Backend Developer</p>
          </div>
          <div className="team-member">
            <img 
              src={Arnold} 
              alt="Customer support"
              className="rounded-image"
            />
            <h3>Arnold Mwairo</h3>
            <p>Data Integration & Quality Lead</p>
          </div>
        </div>
      </section>

      <section className="values-section">
        <h2>Our Core Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">🐄</div>
            <h3>Animal Welfare</h3>
            <p>We prioritize humane treatment and comfortable living conditions for all cattle.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🌱</div>
            <h3>Sustainability</h3>
            <p>Promoting eco-friendly farming practices that protect our land for future generations.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">📱</div>
            <h3>Innovation</h3>
            <p>Developing simple, powerful tools that make farm management effortless.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🤝</div>
            <h3>Community</h3>
            <p>Building a network of farmers who support and learn from each other.</p>
          </div>
        </div>
      </section>

      <section className="farm-stats">
      <h1> Our Projection</h1>
     
        <div className="stat-item">
             <span className="stat-number">250+</span>
          <span className="stat-label">Happy Farmers</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">10K+</span>
          <span className="stat-label">Cattle Managed</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">24/7</span>
          <span className="stat-label">Support</span>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;