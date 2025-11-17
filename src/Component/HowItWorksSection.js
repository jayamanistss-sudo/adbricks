import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "HEAD-SALES",
      role: "ASSET TREE HOMES",
      text: "We are happy to inform you that your service and involvement was so good that as per our requirement your target has been achieved and we are glad to have a wonderful journey. We appreciate you for the quality site visits which you have given to us was most valuable clients.",
      bgColor: "#D6E8F5",
      avatar: "/b2a505434efa1fa4193736d7ffeb0769e9aefc1e.png"
    },
    {
      name: "CEO",
      role: "SPYKA HOMES PVT. LTD.",
      text: "As CEO of SPYKA HOMES PVT, LTD., I've had the privilege of collaborating with the outstanding leadership team at AD Bricks Media. Their expertise and commitment to understanding our needs have delivered impactful solutions. I value our continued partnership and appreciate their hard work.",
      bgColor: "#FFE5D9",
      avatar: "/b2a505434efa1fa4193736d7ffeb0769e9aefc1e (1).png"
    },
    {
      name: "Bala",
      role: "Space Aszure",
      text: "I would like take the moment and appreciate for the efforts put in, yes adbricks giving a prospective leads which are better to nurture and turn to meetings, I am taking this moment to appreciate and record my experience with Ad bricks and I strongly recommend adbricks & lead generation services.",
      bgColor: "#E5D9FF",
      avatar: "/b2a505434efa1fa4193736d7ffeb0769e9aefc1e.png"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return visible;
  };

  return (
    <>
      <section
        style={{
          padding: '60px 20px',
          background: 'linear-gradient(135deg, #E8F0FE 0%, #F0F4FF 100%)',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2
              style={{
                fontSize: '2.5rem',
                color: '#0066CC',
                marginBottom: '10px',
                fontWeight: '700'
              }}
            >
              What Our Client Say
            </h2>
            <p
              style={{
                fontSize: '1rem',
                color: '#333',
                fontWeight: '400'
              }}
            >
              Hear What Our Clients Have To Say About Their Journey With Us.
            </p>
          </div>

          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
            }}
            className="testimonials-grid-wrapper"
          >
            <button
              onClick={prevSlide}
              style={{
                background: '#FF6B35',
                border: 'none',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.background = '#FF5722';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = '#FF6B35';
              }}
            >
              <ChevronLeft color="white" size={24} />
            </button>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '25px',
                flex: 1
              }}
              className="testimonials-grid"
            >
              {getVisibleTestimonials().map((testimonial, index) => (
                <div
                  key={index}
                  style={{
                    background: 'white',
                    borderRadius: '10px',
                    padding: '30px 25px',
                    boxShadow:
                      index === 1
                        ? '0 4px 15px rgba(0,102,204,0.3)'
                        : '0 4px 15px rgba(0,0,0,0.1)',
                    border: index === 1 ? '2px solid #0066CC' : '2px solid transparent',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '420px'
                  }}
                >
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: testimonial.bgColor,
                      margin: '0 auto 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.5rem',
                      border: '4px solid white',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }}
                  >
                    <img src={testimonial.avatar} style={{ width: '60%', height: '60%' }} />
                  </div>

                  <h4
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      fontSize: '22px',
                      lineHeight: '100%',
                      letterSpacing: '1%',
                      textAlign: 'center',
                      textTransform: 'capitalize',
                      color: '#000',
                      marginBottom: '5px'
                    }}
                  >
                    {testimonial.name}
                  </h4>

                  <p
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 300,
                      fontSize: '22px',
                      lineHeight: '100%',
                      letterSpacing: '1%',
                      textAlign: 'center',
                      textTransform: 'capitalize',
                      color: '#666',
                      marginBottom: '20px'
                    }}
                  >
                    {testimonial.role}
                  </p>

                  <div
                    style={{
                      fontSize: '1.5rem',
                      color: '#0066CC',
                      marginBottom: '15px'
                    }}
                  >
                    <img
                      src="/3b8994b618ebb98866f8b24b03143b2bb5143b91.png"
                      style={{
                        width: '21px',
                        height: '21px',
                        position: 'absolute',
                        opacity: 1,
                        transform: 'rotate(0deg)'
                      }}
                      alt=""
                    />
                  </div>

                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: '#555',
                      lineHeight: '1.6',
                      textAlign: 'center',
                      flex: 1
                    }}
                  >
                    {testimonial.text}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={nextSlide}
              style={{
                background: '#FF6B35',
                border: 'none',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.background = '#FF5722';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = '#FF6B35';
              }}
            >
              <ChevronRight color="white" size={24} />
            </button>
          </div>
        </div>

        <style jsx>{`
          @media (max-width: 968px) {
            .testimonials-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>

      <section
        style={{
          padding: '60px 20px',
          background: '#FAF8F1',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2
              style={{
                fontSize: '2.5rem',
                color: '#0066CC',
                marginBottom: '10px',
                fontWeight: '700'
              }}
            >
              Frequently Asked Questions
            </h2>
            <p
              style={{
                fontSize: '1rem',
                color: '#333',
                fontWeight: '400'
              }}
            >
              About Buying Property In Chennai
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '25px',
              marginBottom: '40px'
            }}
          >
            {[
              {
                question: "What types of properties do you offer?",
                answer: "We offer a range of residential and commercial properties including apartments, villas, plots, and gated community homes. Each project is designed with quality, safety, and modern amenities in mind."
              },
              {
                question: "Are your projects RERA approved?",
                answer: "Yes, all our ongoing and upcoming projects comply with RERA guidelines to ensure transparency and trust for our buyers."
              },
              {
                question: "What payment plans or financing options do you provide?",
                answer: "We offer flexible payment schedules and have tie-ups with major banks and financial institutions to help customers easily secure home loans."
              },
              {
                question: "How can I book a property with you?",
                answer: "You can book a unit by contacting our sales team, scheduling a site visit, choosing the unit, and completing the initial booking payment."
              },
              {
                question: "Can I visit the site before making a decision?",
                answer: "Absolutely. We encourage all customers to schedule a site visit to explore the location, amenities, and construction progress."
              }
            ].map((faq, index) => (
              <div
                key={index}
                style={{
                  background: 'white',
                  borderRadius: '10px',
                  padding: '25px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,102,204,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                }}
              >
                <h3
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '18px',
                    lineHeight: '100%',
                    letterSpacing: '1%',
                    textTransform: 'capitalize',
                    color: '#000000',
                    marginBottom: '12px'
                  }}
                >
                  {index + 1}. {faq.question}
                </h3>

                <p
                  style={{
                    fontSize: '0.95rem',
                    color: '#7E7E7E',
                    lineHeight: '1.6'
                  }}
                >
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default TestimonialsSection;