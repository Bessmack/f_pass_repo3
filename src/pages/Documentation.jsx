import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaWallet, 
  FaPaperPlane, 
  FaUsers, 
  FaHistory, 
  FaShieldAlt,
  FaMoon,
  FaSun,
  FaArrowRight,
  FaCheckCircle,
  FaMobileAlt,
  FaCreditCard,
  FaUniversity
} from 'react-icons/fa';

const Documentation = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark-mode');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const features = [
    {
      icon: <FaWallet size={32} />,
      title: 'Digital Wallet',
      description: 'Secure digital wallet to store and manage your funds with real-time balance updates.',
      color: '#3B82F6'
    },
    {
      icon: <FaPaperPlane size={32} />,
      title: 'Instant Transfers',
      description: 'Send money instantly to anyone using their wallet ID or phone number.',
      color: '#10B981'
    },
    {
      icon: <FaUsers size={32} />,
      title: 'Beneficiary Management',
      description: 'Save frequent recipients as beneficiaries for quick and easy transactions.',
      color: '#F59E0B'
    },
    {
      icon: <FaHistory size={32} />,
      title: 'Transaction History',
      description: 'Complete transaction history with detailed records and downloadable receipts.',
      color: '#8B5CF6'
    },
    {
      icon: <FaMobileAlt size={32} />,
      title: 'Mobile Money Integration',
      description: 'Add funds via M-Pesa and other mobile money platforms (Pesapay integrated).',
      color: '#EF4444'
    },
    {
      icon: <FaShieldAlt size={32} />,
      title: 'Bank-Level Security',
      description: 'Military-grade encryption and secure authentication to protect your money.',
      color: '#06B6D4'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Create Account',
      description: 'Sign up with your email and basic information. It takes less than 2 minutes!',
      icon: '📝'
    },
    {
      step: '2',
      title: 'Add Funds',
      description: 'Top up your wallet using M-Pesa, card, or bank transfer through Pesapay.',
      icon: '💰'
    },
    {
      step: '3',
      title: 'Add Beneficiaries',
      description: 'Save your frequent recipients for quick access and faster transactions.',
      icon: '👥'
    },
    {
      step: '4',
      title: 'Send Money',
      description: 'Transfer money instantly with just a few clicks. Real-time notifications included!',
      icon: '🚀'
    }
  ];

  const faqs = [
    {
      question: 'Is F-Pass secure?',
      answer: 'Yes! F-Pass uses bank-level encryption (SSL/TLS) to protect all your data. We never store sensitive payment information, and all transactions are processed through secure payment gateways like Pesapay.'
    },
    {
      question: 'What payment methods are supported?',
      answer: 'F-Pass supports M-Pesa (via Pesapay), credit/debit cards, and bank transfers. We support both KES and USD currencies.'
    },
    {
      question: 'How long do transfers take?',
      answer: 'Transfers within F-Pass are instant! When adding funds via M-Pesa or card, processing typically takes 1-5 minutes.'
    },
    {
      question: 'Are there any transaction fees?',
      answer: 'F-Pass charges a small 1.5% fee on transfers. There are no fees for adding funds or maintaining your wallet.'
    },
    {
      question: 'Can I send money internationally?',
      answer: 'Currently, F-Pass supports local transfers within Kenya. International transfers will be available soon!'
    },
    {
      question: 'How do I withdraw money?',
      answer: 'You can withdraw your balance to your M-Pesa account or bank account directly from the wallet section.'
    }
  ];

  return (
    <div className={`docs-container ${isDarkMode ? 'dark' : ''}`}>
      {/* Navigation Bar */}
      <nav className="docs-nav">
        <div className="docs-nav-content">
          <div className="docs-nav-logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span>F-Pass Documentation</span>
          </div>
          
          <div className="docs-nav-actions">
            <button className="theme-toggle" onClick={toggleDarkMode}>
              {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
            <Link to="/" className="btn-primary">
              <FaHome size={16} />
              Sign Up/IN
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="docs-hero">
        <div className="docs-hero-content">
          <h1 className="docs-hero-title">
            Welcome to F-Pass
          </h1>
          <p className="docs-hero-subtitle">
            Your complete guide to seamless money transfers and digital wallet management
          </p>
          <div className="docs-hero-buttons">
            <Link to="/" className="btn-hero-primary">
              Get Started
              <FaArrowRight />
            </Link>
            <button 
              className="btn-hero-secondary"
              onClick={() => scrollToSection('features')}
            >
              Explore Features
            </button>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="quick-nav">
        <button 
          className={activeSection === 'overview' ? 'active' : ''}
          onClick={() => scrollToSection('overview')}
        >
          Overview
        </button>
        <button 
          className={activeSection === 'features' ? 'active' : ''}
          onClick={() => scrollToSection('features')}
        >
          Features
        </button>
        <button 
          className={activeSection === 'how-it-works' ? 'active' : ''}
          onClick={() => scrollToSection('how-it-works')}
        >
          How It Works
        </button>
        <button 
          className={activeSection === 'faq' ? 'active' : ''}
          onClick={() => scrollToSection('faq')}
        >
          FAQ
        </button>
      </section>

      <div className="docs-content">
        {/* Overview Section */}
        <section id="overview" className="docs-section">
          <h2 className="section-title">What is F-Pass?</h2>
          <div className="overview-grid">
            <div className="overview-card">
              <p>
                F-Pass is a modern digital wallet and money transfer platform designed to make 
                sending and receiving money as simple as sending a text message. Whether you're 
                splitting bills with friends, paying for services, or managing your finances, 
                F-Pass provides a secure and convenient solution.
              </p>
              <div className="highlight-box">
                <FaCheckCircle size={24} color="#10B981" />
                <div>
                  <h4>100% Secure</h4>
                  <p>Bank-level encryption and secure payment processing</p>
                </div>
              </div>
              <div className="highlight-box">
                <FaCheckCircle size={24} color="#10B981" />
                <div>
                  <h4>Instant Transfers</h4>
                  <p>Money moves in real-time, no waiting periods</p>
                </div>
              </div>
              <div className="highlight-box">
                <FaCheckCircle size={24} color="#10B981" />
                <div>
                  <h4>Low Fees</h4>
                  <p>Only 1.5% transaction fee, no hidden charges</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="docs-section">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div 
                  className="feature-icon"
                  style={{ backgroundColor: `${feature.color}20`, color: feature.color }}
                >
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="docs-section">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-container">
            {howItWorks.map((item, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{item.icon}</div>
                <div className="step-content">
                  <h3>Step {item.step}: {item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Payment Methods Section */}
        <section className="docs-section">
          <h2 className="section-title">Supported Payment Methods</h2>
          <div className="payment-methods">
            <div className="payment-card">
              <FaMobileAlt size={40} color="#10B981" />
              <h4>M-Pesa</h4>
              <p>Instant deposits via M-Pesa STK Push (Pesapay integration)</p>
            </div>
            <div className="payment-card">
              <FaCreditCard size={40} color="#3B82F6" />
              <h4>Card Payments</h4>
              <p>Visa, Mastercard, and other major credit/debit cards</p>
            </div>
            <div className="payment-card">
              <FaUniversity size={40} color="#8B5CF6" />
              <h4>Bank Transfer</h4>
              <p>Direct bank transfers through secure banking channels</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="docs-section">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <details key={index} className="faq-item">
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="docs-cta">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of users who trust F-Pass for their money transfers</p>
          <Link to="/" className="btn-cta">
            Create Your Account
            <FaArrowRight />
          </Link>
        </section>
      </div>

      {/* Footer */}
      <footer className="docs-footer">
        <p>© 2025 F-Pass. All rights reserved.</p>
        <div className="footer-links">
          <a href="#terms">Terms of Service</a>
          <span>•</span>
          <a href="#privacy">Privacy Policy</a>
          <span>•</span>
          <a href="#contact">Contact Us</a>
        </div>
      </footer>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .docs-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          transition: background 0.3s ease;
        }

        .docs-container.dark {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #f1f5f9;
        }

        /* Navigation */
        .docs-nav {
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
          transition: all 0.3s ease;
        }

        .dark .docs-nav {
          background: #1e293b;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .docs-nav-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .docs-nav-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
        }

        .dark .docs-nav-logo {
          color: #f1f5f9;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-icon svg {
          width: 22px;
          height: 22px;
          color: white;
        }

        .docs-nav-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .theme-toggle {
          width: 40px;
          height: 40px;
          border: none;
          background: #f1f5f9;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #64748b;
        }

        .dark .theme-toggle {
          background: #334155;
          color: #f1f5f9;
        }

        .theme-toggle:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
          color: white;
          text-decoration: none;
          border-radius: 10px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }

        /* Hero Section */
        .docs-hero {
          padding: 5rem 2rem;
          text-align: center;
        }

        .docs-hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .docs-hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }

        .dark .docs-hero-title {
          background: linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .docs-hero-subtitle {
          font-size: 1.25rem;
          color: #64748b;
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }

        .dark .docs-hero-subtitle {
          color: #94a3b8;
        }

        .docs-hero-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-hero-primary,
        .btn-hero-secondary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .btn-hero-primary {
          background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
          color: white;
          border: none;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .btn-hero-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }

        .btn-hero-secondary {
          background: white;
          color: #3B82F6;
          border: 2px solid #3B82F6;
        }

        .dark .btn-hero-secondary {
          background: #334155;
          color: #60A5FA;
          border-color: #60A5FA;
        }

        .btn-hero-secondary:hover {
          background: #3B82F6;
          color: white;
          transform: translateY(-2px);
        }

        /* Quick Navigation */
        .quick-nav {
          display: flex;
          gap: 1rem;
          justify-content: center;
          padding: 1rem 2rem;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 72px;
          z-index: 90;
          overflow-x: auto;
        }

        .dark .quick-nav {
          background: #1e293b;
        }

        .quick-nav button {
          padding: 0.75rem 1.5rem;
          border: none;
          background: transparent;
          color: #64748b;
          font-weight: 500;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .quick-nav button:hover {
          background: #f1f5f9;
          color: #3B82F6;
        }

        .dark .quick-nav button:hover {
          background: #334155;
        }

        .quick-nav button.active {
          background: #3B82F6;
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        /* Content Sections */
        .docs-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }

        .docs-section {
          margin-bottom: 5rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 2rem;
          text-align: center;
        }

        .dark .section-title {
          color: #f1f5f9;
        }

        /* Overview Section */
        .overview-grid {
          display: grid;
          gap: 2rem;
        }

        .overview-card {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }

        .dark .overview-card {
          background: #1e293b;
        }

        .overview-card p {
          font-size: 1.125rem;
          line-height: 1.8;
          color: #475569;
          margin-bottom: 2rem;
        }

        .dark .overview-card p {
          color: #cbd5e0;
        }

        .highlight-box {
          display: flex;
          gap: 1rem;
          padding: 1.25rem;
          background: #f0f9ff;
          border-radius: 12px;
          margin-bottom: 1rem;
          border-left: 4px solid #10B981;
        }

        .dark .highlight-box {
          background: #0f2f3f;
        }

        .highlight-box h4 {
          font-size: 1.125rem;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }

        .dark .highlight-box h4 {
          color: #f1f5f9;
        }

        .highlight-box p {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
        }

        /* Features Grid */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          text-align: center;
        }

        .dark .feature-card {
          background: #1e293b;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .feature-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 1.5rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .feature-card h3 {
          font-size: 1.5rem;
          color: #0f172a;
          margin-bottom: 1rem;
        }

        .dark .feature-card h3 {
          color: #f1f5f9;
        }

        .feature-card p {
          color: #64748b;
          line-height: 1.6;
        }

        .dark .feature-card p {
          color: #94a3b8;
        }

        /* Steps Container */
        .steps-container {
          display: grid;
          gap: 2rem;
        }

        .step-card {
          display: flex;
          gap: 2rem;
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          align-items: flex-start;
        }

        .dark .step-card {
          background: #1e293b;
        }

        .step-number {
          font-size: 3rem;
          flex-shrink: 0;
        }

        .step-content h3 {
          font-size: 1.5rem;
          color: #0f172a;
          margin-bottom: 0.75rem;
        }

        .dark .step-content h3 {
          color: #f1f5f9;
        }

        .step-content p {
          color: #64748b;
          line-height: 1.6;
        }

        .dark .step-content p {
          color: #94a3b8;
        }

        /* Payment Methods */
        .payment-methods {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .payment-card {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          text-align: center;
          transition: all 0.3s ease;
        }

        .dark .payment-card {
          background: #1e293b;
        }

        .payment-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .payment-card h4 {
          font-size: 1.25rem;
          color: #0f172a;
          margin: 1rem 0;
        }

        .dark .payment-card h4 {
          color: #f1f5f9;
        }

        .payment-card p {
          color: #64748b;
          font-size: 0.875rem;
        }

        .dark .payment-card p {
          color: #94a3b8;
        }

        /* FAQ Section */
        .faq-container {
          display: grid;
          gap: 1rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .faq-item {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .dark .faq-item {
          background: #1e293b;
        }

        .faq-item summary {
          padding: 1.5rem;
          cursor: pointer;
          font-weight: 600;
          color: #0f172a;
          font-size: 1.125rem;
          list-style: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dark .faq-item summary {
          color: #f1f5f9;
        }

        .faq-item summary::-webkit-details-marker {
          display: none;
        }

        .faq-item summary::after {
          content: '+';
          font-size: 1.5rem;
          color: #3B82F6;
          transition: transform 0.3s ease;
        }

        .faq-item[open] summary::after {
          content: '−';
        }

        .faq-item p {
          padding: 0 1.5rem 1.5rem;
          color: #64748b;
          line-height: 1.6;
        }

        .dark .faq-item p {
          color: #94a3b8;
        }

        /* CTA Section */
        .docs-cta {
          text-align: center;
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
          border-radius: 24px;
          color: white;
          margin: 4rem 0;
        }

        .docs-cta h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .docs-cta p {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .btn-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2.5rem;
          background: white;
          color: #3B82F6;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1.125rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .btn-cta:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        /* Footer */
        .docs-footer {
          background: white;
          padding: 2rem;
          text-align: center;
          color: #64748b;
          border-top: 1px solid #e2e8f0;
          
          .dark .docs-footer {
          background: #1e293b;
          color: #94a3b8;
          border-top: 1px solid #334155;
        }

        .footer-links {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
          flex-wrap: wrap;
        }

        .footer-links a {
          color: #3B82F6;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .dark .footer-links a {
          color: #60A5FA;
        }

        .footer-links a:hover {
          color: #1D4ED8;
          text-decoration: underline;
        }

        .dark .footer-links a:hover {
          color: #93C5FD;
        }

        .footer-links span {
          color: #64748b;
        }

        .dark .footer-links span {
          color: #94a3b8;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .docs-nav-content {
            padding: 1rem;
          }

          .docs-hero {
            padding: 3rem 1rem;
          }

          .docs-hero-title {
            font-size: 2.5rem;
          }

          .docs-hero-subtitle {
            font-size: 1.125rem;
          }

          .docs-hero-buttons {
            flex-direction: column;
            align-items: center;
          }

          .btn-hero-primary,
          .btn-hero-secondary {
            width: 100%;
            max-width: 300px;
            justify-content: center;
          }

          .quick-nav {
            padding: 1rem;
            justify-content: flex-start;
          }

          .docs-content {
            padding: 2rem 1rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .step-card {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .payment-methods {
            grid-template-columns: 1fr;
          }

          .docs-cta {
            padding: 3rem 1rem;
            margin: 2rem 0;
          }

          .docs-cta h2 {
            font-size: 2rem;
          }

          .docs-cta p {
            font-size: 1.125rem;
          }
        }

        @media (max-width: 480px) {
          .docs-nav-logo span {
            display: none;
          }

          .docs-hero-title {
            font-size: 2rem;
          }

          .section-title {
            font-size: 1.75rem;
          }

          .overview-card,
          .feature-card,
          .step-card,
          .payment-card {
            padding: 1.5rem;
          }

          .highlight-box {
            flex-direction: column;
            text-align: center;
          }
        }

        /* Smooth scrolling for the entire page */
        html {
          scroll-behavior: smooth;
        }

        /* Focus styles for accessibility */
        button:focus-visible,
        a:focus-visible,
        summary:focus-visible {
          outline: 2px solid #3B82F6;
          outline-offset: 2px;
        }

        /* Loading animation for better UX */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .docs-section {
          animation: fadeInUp 0.6s ease-out;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        .dark ::-webkit-scrollbar-track {
          background: #1e293b;
        }

        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        .dark ::-webkit-scrollbar-thumb {
          background: #475569;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        .dark ::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  );
};

export default Documentation;