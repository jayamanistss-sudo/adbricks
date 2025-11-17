import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PropertyShowcase = (propertyList) => {
  const list = propertyList?.data?.data ?? [];

  const apartments = list.filter(
    item => item.property_priority === 'Top' && item.property_type_name === 'Apartment'
  );

  const plots = list.filter(
    item => item.property_priority === 'Top' && item.property_type_name === 'Plot'
  );

  const [apartmentSlide, setApartmentSlide] = useState(0);
  const [plotSlide, setPlotSlide] = useState(0);

  const aptMax = Math.max(apartments.length - 2, 1);
  const plotMax = Math.max(plots.length - 2, 1);

  const navigateApartments = (direction) => {
    if (direction === 'next') {
      setApartmentSlide((prev) => (prev + 1) % aptMax);
    } else {
      setApartmentSlide((prev) => (prev - 1 + aptMax) % aptMax);
    }
  };

  const navigatePlots = (direction) => {
    if (direction === 'next') {
      setPlotSlide((prev) => (prev + 1) % plotMax);
    } else {
      setPlotSlide((prev) => (prev - 1 + plotMax) % plotMax);
    }
  };

  const ProjectCard = ({ project }) => (
    <div style={{
      flex: '0 0 calc(33.333% - 20px)',
      minWidth: '280px',
      maxWidth: '350px',
      background: '#FAF8F1',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    }}>
      <div style={{ width: '100%', height: '220px', overflow: 'hidden' }}>
        <img
          src={project.image_url}
          alt={project.property_name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div style={{ padding: '20px', background: '#ECF4E8', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '8px' }}>
          {project.property_name}
        </h3>
        <p style={{ fontSize: '1rem', color: '#666' }}>
          {project.price_per_sqft
            ? `₹${project.price_per_sqft} / Sqft`
            : "Price on Request"}
        </p>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '60px 20px', background: '#FAF8F1' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', color: '#0066cc' }}>
            Top Pick Apartment Projects
          </h2>

          <div style={{ position: 'relative', marginTop: '40px' }}>
            <button onClick={() => navigateApartments('prev')} style={arrowStyleLeft}>
              <ChevronLeft size={28} color="white" />
            </button>

            <div style={{ display: 'flex', gap: '30px', justifyContent: 'center' }}>
              {apartments.slice(apartmentSlide, apartmentSlide + 3).map((apt) => (
                <ProjectCard key={apt.property_id} project={apt} />
              ))}
            </div>

            <button onClick={() => navigateApartments('next')} style={arrowStyleRight}>
              <ChevronRight size={28} color="white" />
            </button>
          </div>
        </section>

        <section>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', color: '#0066cc' }}>
            Top Pick Plot Projects
          </h2>

          <div style={{ position: 'relative', marginTop: '40px' }}>
            <button onClick={() => navigatePlots('prev')} style={arrowStyleLeft}>
              <ChevronLeft size={28} color="white" />
            </button>

            <div style={{ display: 'flex', gap: '30px', justifyContent: 'center' }}>
              {plots.slice(plotSlide, plotSlide + 3).map((plot) => (
                <ProjectCard key={plot.property_id} project={plot} />
              ))}
            </div>

            <button onClick={() => navigatePlots('next')} style={arrowStyleRight}>
              <ChevronRight size={28} color="white" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

const arrowBase = {
  position: 'absolute',
  top: '50%',
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  background: '#ff6600',
  border: 'none',
  cursor: 'pointer',
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const arrowStyleLeft = { ...arrowBase, left: '-60px' };
const arrowStyleRight = { ...arrowBase, right: '-60px' };

export default PropertyShowcase;
