import React from 'react';

const HowItWorksSection = () => {
  const steps = [
    { 
      icon: 'search', 
      title: '1. Search', 
      desc: 'Use our advanced filters to find your perfect BHK property' 
    },
    { 
      icon: 'phone', 
      title: '2. Connect', 
      desc: 'Get tele-verified enquiries and genuine contact details' 
    },
    { 
      icon: 'handshake', 
      title: '3. Visit', 
      desc: 'Schedule site visits with our pre-sales support team' 
    },
    { 
      icon: 'key', 
      title: '4. Own', 
      desc: 'Complete your property purchase with full legal support' 
    }
  ];

  return (
    <section style={{ padding: '80px 0' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '50px',
          position: 'relative'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            color: '#2c3e50',
            marginBottom: '10px'
          }}>
            How It Works
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: '#6c757d',
            fontWeight: '300'
          }}>
            Simple, transparent, and efficient
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px',
          textAlign: 'center'
        }}>
          {steps.map((step, index) => (
            <div key={index}>
              <div style={{
                fontSize: '3rem',
                color: '#3498db',
                marginBottom: '20px'
              }}>
                <i className={`fas fa-${step.icon}`}></i>
              </div>
              <h5 style={{
                margin: '20px 0 10px',
                color: '#2c3e50'
              }}>
                {step.title}
              </h5>
              <p style={{
                color: '#6c757d',
                lineHeight: '1.6'
              }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;