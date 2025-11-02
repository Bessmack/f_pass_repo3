// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

function NotFound() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Animated 404 */}
        <div style={styles.errorCode}>
          <span style={styles.number}>4</span>
          <span style={styles.zero}>
            <FaExclamationTriangle size={120} color="#3B82F6" />
          </span>
          <span style={styles.number}>4</span>
        </div>

        {/* Message */}
        <h1 style={styles.title}>Page Not Found</h1>
        <p style={styles.description}>
          Oops! The page you're looking for seems to have wandered off into the digital void. 
          Don't worry, even the best explorers sometimes take wrong turns.
        </p>

        {/* Action Buttons */}
        <div style={styles.buttonGroup}>
          <Link to="/" style={styles.primaryButton}>
            <FaHome size={18} />
            Back to LogIn
          </Link>
          
          <button 
            onClick={() => window.history.back()} 
            style={styles.secondaryButton}
          >
            <FaArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>

      {/* Background Animation */}
      <div style={styles.background}>
        <div style={styles.star}></div>
        <div style={styles.star}></div>
        <div style={styles.star}></div>
        <div style={styles.star}></div>
        <div style={styles.star}></div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #167eea 0%, #364ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Inter', sans-serif",
  },
  content: {
    textAlign: 'center',
    color: 'white',
    zIndex: 2,
    position: 'relative',
    maxWidth: '600px',
  },
  errorCode: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '30px',
    gap: '15px',
  },
  number: {
    fontSize: '120px',
    fontWeight: 'bold',
    color: 'white',
    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  zero: {
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid rgba(255,255,255,0.2)',
    animation: 'pulse 2s infinite',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '20px',
    background: 'linear-gradient(45deg, #fff, #e2e8f0)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    textShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  description: {
    fontSize: '1.2rem',
    lineHeight: '1.6',
    marginBottom: '40px',
    opacity: '0.9',
    maxWidth: '500px',
    margin: '0 auto 40px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '50px',
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '15px 30px',
    background: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '50px',
    color: 'white',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.1rem',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  secondaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '15px 30px',
    background: 'transparent',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '50px',
    color: 'white',
    fontWeight: '600',
    fontSize: '1.1rem',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  illustration: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '30px',
  },
  floatingElement: {
    fontSize: '2rem',
    animation: 'float 3s ease-in-out infinite',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  star: {
    position: 'absolute',
    background: 'white',
    borderRadius: '50%',
    animation: 'twinkle 5s infinite',
  },
};

// Generate random stars
for (let i = 0; i < 5; i++) {
  styles.star = {
    ...styles.star,
    [`:nth-child(${i + 1})`]: {
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 3 + 1}px`,
      height: `${Math.random() * 3 + 1}px`,
      animationDelay: `${Math.random() * 5}s`,
    }
  };
}

// Add CSS animations
const styleSheet = document.styleSheets[0];
const keyframes = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  
  @keyframes twinkle {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 1; }
  }
`;

// Add styles to document
const styleElement = document.createElement('style');
styleElement.innerHTML = keyframes;
document.head.appendChild(styleElement);

// Add hover effects
styles.primaryButton[':hover'] = {
  background: 'rgba(255,255,255,0.3)',
  transform: 'translateY(-2px)',
  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
};

styles.secondaryButton[':hover'] = {
  background: 'rgba(255,255,255,0.1)',
  transform: 'translateY(-2px)',
  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
};

export default NotFound;