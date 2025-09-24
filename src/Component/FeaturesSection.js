import React from 'react';

const FeaturesSection = () => {
  const features = [
    {
      icon: 'gift',
      title: 'Free Property Listings',
      description: 'Start with one free listing slot. Additional premium options available for maximum visibility.',
      badge: 'No Hidden Costs'
    },
    {
      icon: 'infinity',
      title: 'No-Expiry Postings',
      description: 'Your listings stay active until sold. No more worrying about expiration dates or renewal fees.',
      badge: 'Forever Active'
    },
    {
      icon: 'phone-alt',
      title: 'Tele-Verified Enquiries',
      description: 'All enquiries are verified through phone calls, ensuring genuine buyers and higher conversion rates.',
      badge: '95% Genuine Leads'
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
            Why Choose Adbricks?
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: '#6c757d',
            fontWeight: '300'
          }}>
            Building trust through transparency and innovation
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          {features.map((feature, index) => (
            <div key={index} style={{
              background: 'white',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              borderTop: '4px solid #3498db',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '3rem',
                color: '#3498db',
                marginBottom: '20px'
              }}>
                <i className={`fas fa-${feature.icon}`}></i>
              </div>
              <h4 style={{
                color: '#2c3e50',
                marginBottom: '15px'
              }}>
                {feature.title}
              </h4>
              <p style={{
                color: '#6c757d',
                marginBottom: '15px',
                lineHeight: '1.6'
              }}>
                {feature.description}
              </p>
              <span style={{
                background: '#27ae60',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '15px',
                fontSize: '0.8rem',
                display: 'inline-block',
                margin: '5px 0'
              }}>
                {feature.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;