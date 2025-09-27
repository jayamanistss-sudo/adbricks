import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import StatsSection from './StatsSection';
import BrandStoreSection from './BrandStoreSection';
import PropertyShowcase from './PropertyShowcase';
import PropertiesSection from './PropertiesSection';
import AboutSection from './AboutSection';
import HowItWorksSection from './HowItWorksSection';
import Footer from './Footer';
import FloatingCTA from './FloatingCTA';
import Modal from './Modal';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
// Improved LoginModal Component

export default function Home() {
    const [activeTab, setActiveTab] = useState('buy');
    const [selectedBHK, setSelectedBHK] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showPostPropertyModal, setShowPostPropertyModal] = useState(false);
    const [animatedStats, setAnimatedStats] = useState({});
    const [isScrolled, setIsScrolled] = useState(false);
    const [showFloatingCTA, setShowFloatingCTA] = useState(true);
    const [brandStore, setBrandStore] = useState(null);
    const [generalStatsdata, setGeneralStats] = useState([]);
    const [propertyList, setPropertyList] = useState([]);
    const statsRef = useRef(null);
    const api = "https://demo.stss.in/admin/Config/router.php?router=";

    useEffect(() => {
        fetch(`${api}brandstore_list`)
            .then(res => res.json())
            .then(data => setBrandStore(data))
            .catch(err => console.error("Error fetching brand store:", err));

        fetch(`${api}site_settings_list`)
            .then(res => res.json())
            .then(data => setGeneralStats(data))
            .catch(err => console.error("Error fetching site settings:", err));

        fetch(`${api}property_list`)
            .then(res => res.json())
            .then(data => setPropertyList(data))
            .catch(err => console.error("Error fetching property list:", err));
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 100;
            setIsScrolled(scrolled);

            const scrollTop = window.pageYOffset;
            setShowFloatingCTA(scrollTop < 300 || window.lastScrollTop > scrollTop);
            window.lastScrollTop = scrollTop;
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !animatedStats.started) {
                        setAnimatedStats({ started: true });
                        animateCounters();
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (statsRef.current) observer.observe(statsRef.current);
        return () => observer.disconnect();
    }, [animatedStats.started]);

    const animateCounters = () => {
        const counters = [
            { id: 'properties', target: 50000 },
            { id: 'customers', target: 25000 },
            { id: 'builders', target: 500 },
            { id: 'conversion', target: 89 }
        ];
        counters.forEach(counter => animateCounter(counter.id, counter.target));
    };

    const animateCounter = (id, target) => {
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            setAnimatedStats(prev => ({ ...prev, [id]: Math.floor(current).toLocaleString() }));
        }, 16);
    };

    const handleTabChange = tab => {
        setActiveTab(tab);
        if (tab === 'plot' || tab === 'commercial') setSelectedBHK('');
    };

    const getPropertyTypeOptions = () => {
        switch (activeTab) {
            case 'plot':
                return ['Plot Type', 'Residential Plot', 'Commercial Plot', 'Agricultural Land', 'Industrial Plot'];
            case 'commercial':
                return ['Commercial Type', 'Office Space', 'Retail Shop', 'Warehouse', 'Showroom'];
            default:
                return ['Property Type', 'Apartment', 'Villa', 'Independent House', 'Builder Floor'];
        }
    };

    const showBHKSelector = activeTab !== 'plot' && activeTab !== 'commercial';


    const PostPropertyModal = () => {
        const [formData, setFormData] = useState({
            propertyType: '',
            transactionType: '',
            area: '',
            price: '',
            address: '',
            name: '',
            contact: '',
            description: '',
            teleVerify: false
        });

        const commonStyles = {
            formGroup: { marginBottom: '20px' },
            formLabel: { 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500', 
                color: '#374151',
                fontSize: '14px'
            },
            formControl: { 
                width: '100%', 
                padding: '12px 16px', 
                border: '2px solid #e5e7eb', 
                borderRadius: '8px', 
                fontSize: '16px', 
                transition: 'border-color 0.2s ease',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
            },
            formRow: { 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '16px' 
            },
            button: { 
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
                border: 'none', 
                padding: '14px', 
                borderRadius: '8px', 
                fontWeight: '600', 
                color: 'white', 
                fontSize: '16px', 
                cursor: 'pointer', 
                transition: 'all 0.2s ease', 
                width: '100%' 
            },
            alert: { 
                padding: '16px', 
                borderRadius: '8px', 
                marginBottom: '24px', 
                background: '#d1fae5', 
                color: '#065f46', 
                border: '1px solid #a7f3d0',
                fontSize: '14px'
            }
        };

        return (
            <div>
                <div style={commonStyles.alert}>
                    <strong>FREE Listing!</strong> Your first property listing is completely free with no expiry date.
                </div>

                <div style={commonStyles.formRow}>
                    <div style={commonStyles.formGroup}>
                        <label style={commonStyles.formLabel}>Property Type</label>
                        <select 
                            style={commonStyles.formControl}
                            value={formData.propertyType}
                            onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                        >
                            <option value="">Select property type</option>
                            <option>Apartment</option>
                            <option>Villa</option>
                            <option>Independent House</option>
                            <option>Builder Floor</option>
                            <option>Plot/Land</option>
                            <option>Commercial Space</option>
                        </select>
                    </div>
                    <div style={commonStyles.formGroup}>
                        <label style={commonStyles.formLabel}>Transaction Type</label>
                        <select 
                            style={commonStyles.formControl}
                            value={formData.transactionType}
                            onChange={(e) => setFormData({...formData, transactionType: e.target.value})}
                        >
                            <option value="">Select transaction</option>
                            <option>Sale</option>
                            <option>Rent</option>
                            <option>Lease</option>
                        </select>
                    </div>
                </div>

                {showBHKSelector && (
                    <div style={commonStyles.formGroup}>
                        <label style={commonStyles.formLabel}>BHK Configuration</label>
                        <div style={{ 
                            display: 'flex', 
                            gap: '10px', 
                            margin: '15px 0', 
                            flexWrap: 'wrap' 
                        }}>
                            {['1', '2', '3', '4', '5+'].map(bhk => (
                                <div
                                    key={bhk}
                                    style={{
                                        padding: '10px 20px',
                                        border: `2px solid #3b82f6`,
                                        borderRadius: '25px',
                                        background: selectedBHK === bhk ? '#3b82f6' : 'white',
                                        color: selectedBHK === bhk ? 'white' : '#3b82f6',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        fontWeight: '500'
                                    }}
                                    onClick={() => setSelectedBHK(selectedBHK === bhk ? '' : bhk)}
                                >
                                    {bhk} BHK
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div style={commonStyles.formRow}>
                    <div style={commonStyles.formGroup}>
                        <label style={commonStyles.formLabel}>Built-up Area (sq ft)</label>
                        <input 
                            type="number" 
                            style={commonStyles.formControl} 
                            placeholder="Enter area in sq ft"
                            value={formData.area}
                            onChange={(e) => setFormData({...formData, area: e.target.value})}
                        />
                    </div>
                    <div style={commonStyles.formGroup}>
                        <label style={commonStyles.formLabel}>Expected Price</label>
                        <input 
                            type="number" 
                            style={commonStyles.formControl} 
                            placeholder="Enter price in lakhs"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                        />
                    </div>
                </div>

                <div style={commonStyles.formGroup}>
                    <label style={commonStyles.formLabel}>Property Address</label>
                    <textarea 
                        style={{...commonStyles.formControl, minHeight: '80px', resize: 'vertical'}} 
                        placeholder="Enter complete address with landmark"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                </div>

                <div style={commonStyles.formRow}>
                    <div style={commonStyles.formGroup}>
                        <label style={commonStyles.formLabel}>Your Name</label>
                        <input 
                            type="text" 
                            style={commonStyles.formControl} 
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div style={commonStyles.formGroup}>
                        <label style={commonStyles.formLabel}>Contact Number</label>
                        <input 
                            type="tel" 
                            style={commonStyles.formControl} 
                            placeholder="Enter mobile number"
                            value={formData.contact}
                            onChange={(e) => setFormData({...formData, contact: e.target.value})}
                        />
                    </div>
                </div>

                <div style={commonStyles.formGroup}>
                    <label style={commonStyles.formLabel}>Property Description</label>
                    <textarea 
                        style={{...commonStyles.formControl, minHeight: '100px', resize: 'vertical'}} 
                        placeholder="Describe your property features, amenities, nearby facilities etc."
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                </div>

                <div style={{
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <input 
                        type="checkbox" 
                        id="teleVerify"
                        checked={formData.teleVerify}
                        onChange={(e) => setFormData({...formData, teleVerify: e.target.checked})}
                        style={{ accentColor: '#3b82f6' }}
                    />
                    <label htmlFor="teleVerify" style={{ fontSize: '14px', color: '#6b7280' }}>
                        Enable tele-verification for genuine enquiries
                    </label>
                </div>

                <button type="button" style={commonStyles.button}>
                    Post Property FREE
                </button>

                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                    <small style={{ color: '#6b7280', fontSize: '12px' }}>
                        Your property will be reviewed and published within 2 hours
                    </small>
                </div>
            </div>
        );
    };

    return (
        <div style={{ 
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", 
            lineHeight: 1.6, 
            color: '#2c3e50', 
            margin: 0, 
            padding: 0, 
            boxSizing: 'border-box' 
        }}>
            <Navbar
                isScrolled={isScrolled}
                setShowLoginModal={setShowLoginModal}
                setShowPostPropertyModal={setShowPostPropertyModal}
                generalStatsdata={generalStatsdata}
                setShowRegisterModal={setShowRegisterModal}

            />
            <HeroSection
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                selectedBHK={selectedBHK}
                setSelectedBHK={setSelectedBHK}
                handleTabChange={handleTabChange}
                getPropertyTypeOptions={getPropertyTypeOptions}
                showBHKSelector={showBHKSelector}
            />
            <FeaturesSection />
            <StatsSection ref={statsRef} animatedStats={animatedStats} />
            <BrandStoreSection data={brandStore} />
            <PropertyShowcase data={propertyList} />
            <PropertiesSection data={propertyList} />
            <AboutSection  data={generalStatsdata}/>
            <HowItWorksSection />
            <Footer  data={generalStatsdata}/>
            {/* <FloatingCTA showFloatingCTA={showFloatingCTA} setShowPostPropertyModal={setShowPostPropertyModal} /> */}
            
            <LoginModal
                show={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                setShowRegisterModal = {setShowRegisterModal}
            />
             <RegisterModal
                show={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                setShowLoginModal = {setShowLoginModal}
            />
            <Modal show={showPostPropertyModal} onClose={() => setShowPostPropertyModal(false)} title="Post Your Property - FREE" size="large">
                <PostPropertyModal />
            </Modal>
        </div>
    );
}