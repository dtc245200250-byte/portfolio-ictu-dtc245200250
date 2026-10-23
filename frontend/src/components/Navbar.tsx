import React, { useState } from 'react';
import { Menu, X, Shield, ExternalLink, Code } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'admin';
  setCurrentView: (view: 'home' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <a href="#home" onClick={() => setCurrentView('home')} className="navbar-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code size={24} color="#2563eb" />
            <span>Phan Quang Tùng</span>
          </div>
          <span className="navbar-brand-badge">DTC245200250</span>
        </a>

        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
          {currentView === 'home' ? (
            <>
              <li><a href="#about" className="nav-link" onClick={() => setIsOpen(false)}>Giới thiệu</a></li>
              <li><a href="#skills" className="nav-link" onClick={() => setIsOpen(false)}>Kỹ năng</a></li>
              <li><a href="#projects" className="nav-link" onClick={() => setIsOpen(false)}>Dự án</a></li>
              <li><a href="#education" className="nav-link" onClick={() => setIsOpen(false)}>Học vấn</a></li>
              <li><a href="#achievements" className="nav-link" onClick={() => setIsOpen(false)}>Thành tích</a></li>
              <li><a href="#contact" className="nav-link" onClick={() => setIsOpen(false)}>Liên hệ</a></li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('admin');
                    setIsOpen(false);
                  }}
                  className="btn btn-outline btn-sm"
                  style={{ gap: '0.35rem' }}
                >
                  <Shield size={16} />
                  <span>Trang Admin</span>
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('home');
                    setIsOpen(false);
                  }}
                  className="btn btn-outline btn-sm"
                  style={{ gap: '0.35rem' }}
                >
                  <ExternalLink size={16} />
                  <span>Xem Website</span>
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};
