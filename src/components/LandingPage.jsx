import React from 'react';
import './LandingPage.css';

const LandingPage = ({ onStartTournament }) => {
  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="landing-content">
          {/* Header Section */}
          <div className="landing-header">
            <h1 className="landing-title">
              Öğrenme Profili Keşfi
            </h1>
            <div className="landing-subtitle">
              Kişiselleştirilmiş Öğrenme Yolculuğunuz Başlıyor
            </div>
          </div>

          {/* Description Section */}
          <div className="landing-description">
            <p>
              Bu uygulama, farklı öğrenme kursları arasında tercih yaparak 
              kişisel öğrenme profilinizi keşfetmenize yardımcı olur.
            </p>
            <p>
              16 farklı kurs arasından turnuva sistemi ile seçimlerinizi yapacak, 
              en sonunda size en uygun öğrenme alanlarını belirleyeceğiz.
            </p>
            <div className="landing-steps">
              <div className="step">
                <span className="step-number">1</span>
                <span className="step-text">Turnuvada kurslar arasında seçim yapın</span>
              </div>
              <div className="step">
                <span className="step-number">2</span>
                <span className="step-text">Sonuçlarınızı inceleyin ve düzenleyin</span>
              </div>
              <div className="step">
                <span className="step-number">3</span>
                <span className="step-text">Öğrenme profilinizi keşfedin</span>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className="landing-action">
            <button 
              className="start-button"
              onClick={onStartTournament}
            >
              <span className="start-text">Başla</span>
              <span className="start-arrow">→</span>
            </button>
            <p className="landing-note">
              Yaklaşık 5-7 dakika sürecektir
            </p>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="landing-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;