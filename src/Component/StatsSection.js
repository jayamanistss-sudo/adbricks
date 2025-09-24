import React, { forwardRef } from 'react';

const StatsSection = forwardRef(({ animatedStats }, ref) => {
  const stats = [
    { key: 'properties', label: 'Active Properties' },
    { key: 'customers', label: 'Happy Customers' },
    { key: 'builders', label: 'Verified Builders' },
    { key: 'conversion', label: '% Site Visit Conversion' }
  ];

  return (
    <section ref={ref} style={{
      padding: '80px 0',
      background: '#f8f9fa'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px'
        }}>
          {stats.map((stat, index) => (
            <div key={stat.key} style={{
              textAlign: 'center',
              padding: '30px'
            }}>
              <span style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: '#3498db',
                display: 'block'
              }}>
                {animatedStats[stat.key] || '0'}
                {stat.key === 'conversion' && animatedStats[stat.key] ? '%' : ''}
              </span>
              <h5 style={{
                color: '#2c3e50',
                marginTop: '10px'
              }}>
                {stat.label}
              </h5>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default StatsSection;