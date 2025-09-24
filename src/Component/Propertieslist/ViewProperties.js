import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../Apiurl';

const PropertiesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    transactionType: 'all',
    propertyType: 'all',
    brandType: 'all',
    bhk: [],
    district: '',
    city: '',
    priceRange: { min: '', max: '' },
    areaRange: { min: '', max: '' },
    verified: false,
    newLaunch: false,
    isResale: false
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState([]);
  const [propertyList, setPropertyList] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [brandStore, setBrandStore] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const propertiesPerPage = 12;
  const apiUrl = "https://demo.stss.in/admin/Config/router.php?router=";

  const parseBudgetRange = useCallback((budget) => {
    if (!budget) return { min: '', max: '' };
    
    if (budget === '50L-1Cr') return { min: '50', max: '100' };
    if (budget === '1Cr-2Cr') return { min: '100', max: '200' };
    if (budget === '2Cr-5Cr') return { min: '200', max: '500' };
    if (budget === '5Cr+') return { min: '500', max: '' };
    
    if (budget.includes('L-') || budget.includes('Cr-') || budget.includes('L+') || budget.includes('Cr+')) {
      const parts = budget.replace(/L|Cr/g, '').split('-');
      if (parts.length === 2) {
        const minValue = parseFloat(parts[0]) || '';
        const maxValue = parseFloat(parts[1]) || '';
        if (budget.includes('L')) {
          return { min: minValue.toString(), max: maxValue.toString() };
        } else if (budget.includes('Cr')) {
          return { min: (minValue * 100).toString(), max: (maxValue * 100).toString() };
        }
      } else if (budget.includes('+')) {
        const minValue = parseFloat(parts[0]) || '';
        if (budget.includes('L+')) {
          return { min: minValue.toString(), max: '' };
        } else if (budget.includes('Cr+')) {
          return { min: (minValue * 100).toString(), max: '' };
        }
      }
    }
    
    return { min: '', max: '' };
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const district = urlParams.get('district') || '';
    const city = urlParams.get('city') || '';
    const budget = urlParams.get('budget') || '';
    const isResaleParam = urlParams.get('is_resale');
    const brandType = urlParams.get('brand_id') || '';
    
    let isResale = false;
    if (isResaleParam !== null) {
      isResale = isResaleParam === '1';
    }
    
    const priceRange = parseBudgetRange(budget);
    
    setFilters(prev => ({
      ...prev,
      district,
      city,
      isResale: isResaleParam !== null ? isResale : prev.isResale,
      priceRange,
      brandType
    }));
  }, [location.search, parseBudgetRange]);

  const fetchInitialData = useCallback(async () => {
    try {
      const [propRes, distRes, brandRes, typeRes] = await Promise.all([
        fetch(`${apiUrl}property_list`).then(res => res.json()),
        api('district_type_list', 'GET'),
        api('brandstore_list', 'GET'),
        api('property_type_list', 'GET')
      ]);
      
      if (propRes.data) {
        setPropertyList(propRes.data.filter(p => p.is_published === "1"));
      }
      if (distRes.status === 200) {
        setDistricts(distRes.data.filter(d => d.active === "1"));
      }
      if (brandRes.status === 200) {
        setBrandStore(brandRes.data);
      }
      if (typeRes.status === 200) {
        setPropertyTypes(typeRes.data);
      }
    } catch (err) {
      console.error('Error fetching initial data:', err);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    if (!filters.district) {
      setCities([]);
      setFilters(prev => ({ ...prev, city: '' }));
      return;
    }
    
    const fetchCities = async () => {
      try {
        const res = await api('city_type_list', 'GET');
        if (res.status === 200) {
          const filteredCities = res.data.filter(c => c.active === "1" && c.district_id === filters.district);
          setCities(filteredCities);
          
          const urlParams = new URLSearchParams(location.search);
          const urlCity = urlParams.get('city') || '';
          
          if (urlCity) {
            const cityExists = filteredCities.find(c => c.city_id === urlCity);
            if (cityExists) {
              setFilters(prev => ({ ...prev, city: urlCity }));
            } else {
              setFilters(prev => ({ ...prev, city: '' }));
            }
          } else if (filters.city && !filteredCities.find(c => c.city_id === filters.city)) {
            setFilters(prev => ({ ...prev, city: '' }));
          }
        }
      } catch (err) {
        console.error('Error fetching cities:', err);
      }
    };
    
    fetchCities();
  }, [filters.district, location.search]);

  const transformedProperties = useMemo(() => {
    return propertyList.map(property => ({
      id: property.property_id,
      title: property.property_description?.substring(0, 50) + '...' || `${property.bhk_configuration} ${property.property_type_name}`,
      price: parseFloat(property.expected_price_lakhs || 0) * 100000,
      location: `${property.city_name}, ${property.district_name}`,
      area: parseFloat(property.builtup_area_sqft || 0),
      bhk: parseInt(property.bhk_configuration?.charAt(0) || 0),
      type: property.property_type_name,
      transactionType: property.transaction_type?.toLowerCase() === 'lease' ? 'rent' : 'sale',
      image: property.image_url,
      priority: property.property_priority,
      verified: property.property_priority === "Featured",
      premium: property.property_priority === "Premium",
      normal: property.property_priority === "Normal",
      newLaunch: property.is_published === "1",
      builder: property.brand_store_name || "Individual",
      ownerName: property.owner_name,
      contactNumber: property.contact_number,
      pricePerSqft: parseFloat(property.price_per_sqft || 0),
      createdAt: property.created_at,
      interestedCount: parseInt(property.interested_count || 0),
      districtId: property.district_id,
      cityId: property.city_id,
      brand_store_name: property.brand_store_name,
      isResale: property.is_resale === "1"
    }));
  }, [propertyList]);

  useEffect(() => {
    setLoading(true);
    setProperties(transformedProperties);
    setLoading(false);
  }, [transformedProperties]);

  const handleFilterChange = useCallback((filterType, value) => {
    setFilters(prev => {
      if (filterType === 'bhk') {
        const updatedArray = prev.bhk.includes(value) 
          ? prev.bhk.filter(x => x !== value) 
          : [...prev.bhk, value];
        return { ...prev, bhk: updatedArray };
      }
      if (filterType === 'priceRange' || filterType === 'areaRange') {
        return { ...prev, [filterType]: { ...prev[filterType], ...value } };
      }
      return { ...prev, [filterType]: value };
    });
    setCurrentPage(1);
  }, []);

  const applyFilters = useCallback((list) => {
    return list.filter(p => {
      if (filters.transactionType !== 'all' && p.transactionType !== filters.transactionType) return false;
      if (filters.propertyType !== 'all' && p.type !== filters.propertyType) return false;
      if (filters.brandType !== 'all' && filters.brandType !== '' && p.brand_store_name !== filters.brandType) return false;
      if (filters.bhk.length && !filters.bhk.includes(p.bhk.toString())) return false;
      if (filters.district && filters.district !== '' && p.districtId !== filters.district) return false;
      if (filters.city && filters.city !== '' && p.cityId !== filters.city) return false;
      if (filters.priceRange.min && filters.priceRange.min !== '' && p.price < parseInt(filters.priceRange.min) * 100000) return false;
      if (filters.priceRange.max && filters.priceRange.max !== '' && p.price > parseInt(filters.priceRange.max) * 100000) return false;
      if (filters.areaRange.min && filters.areaRange.min !== '' && p.area < parseInt(filters.areaRange.min)) return false;
      if (filters.areaRange.max && filters.areaRange.max !== '' && p.area > parseInt(filters.areaRange.max)) return false;
      if (filters.verified && !p.verified) return false;
      if (filters.newLaunch && !p.newLaunch) return false;
      if (filters.isResale !== undefined && filters.isResale !== false && p.isResale !== filters.isResale) return false;
      return true;
    });
  }, [filters]);

  const sortProperties = useCallback((list) => {
    return [...list].sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'area-large': return b.area - a.area;
        case 'area-small': return a.area - b.area;
        case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
        case 'priority': {
          const priorityOrder = { 'Featured': 3, 'Premium': 2, 'Normal': 1 };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        }
        default: return 0;
      }
    });
  }, [sortBy]);

  const filteredProperties = useMemo(() => applyFilters(properties), [applyFilters, properties]);
  const sortedProperties = useMemo(() => sortProperties(filteredProperties), [sortProperties, filteredProperties]);
  const totalPages = Math.ceil(sortedProperties.length / propertiesPerPage);
  const currentProperties = useMemo(() => 
    sortedProperties.slice((currentPage - 1) * propertiesPerPage, currentPage * propertiesPerPage),
    [sortedProperties, currentPage, propertiesPerPage]
  );

  const clearAllFilters = useCallback(() => {
    setFilters({
      transactionType: 'all',
      propertyType: 'all',
      brandType: 'all',
      bhk: [],
      district: '',
      city: '',
      priceRange: { min: '', max: '' },
      areaRange: { min: '', max: '' },
      verified: false,
      newLaunch: false,
      isResale: false
    });
    setCurrentPage(1);
    navigate('/properties', { replace: true });
  }, [navigate]);

  const formatPrice = useCallback((price, transactionType) => {
    if (transactionType === 'rent') return `₹${price.toLocaleString()}/month`;
    return price >= 10000000 ? `₹${(price / 10000000).toFixed(1)} Cr` : `₹${(price / 100000).toFixed(0)} L`;
  }, []);

  const getPriorityBadge = useCallback((priority) => {
    switch (priority) {
      case 'Featured':
        return { text: 'Featured', class: 'badge-featured', icon: '⭐' };
      case 'Premium':
        return { text: 'Premium', class: 'badge-premium', icon: '💎' };
      case 'Normal':
        return { text: 'Normal', class: 'badge-normal', icon: '🏠' };
      default:
        return null;
    }
  }, []);

  const handlePropertyClick = useCallback((propertyId) => {
    window.location.href = `/propertiesDetails/${propertyId}`;
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading properties...</p>
        <style jsx>{`
          .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
          .loading-spinner { width: 50px; height: 50px; border: 4px solid rgba(255,255,255,0.3); border-top: 4px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="properties-page">
      <style jsx>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .properties-page { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); min-height: 100vh; }
        
        .header { 
          background: #3498db;
          color: white; 
          padding: 80px 20px 60px; 
          text-align: center; 
          position: relative;
          overflow: hidden;
        }
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
          opacity: 0.3;
        }
        .header h1 { font-size: 3rem; margin-bottom: 15px; font-weight: 800; position: relative; z-index: 1; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
        .header p { opacity: 0.9; font-size: 1.2rem; position: relative; z-index: 1; }
        
        .container { margin: 0 auto; padding: 30px 20px; }
        .main { display: grid; grid-template-columns: 320px 1fr; gap: 30px; margin-top: 20px; }
        
        .filters { 
          background: white; 
          border-radius: 20px; 
          padding: 30px; 
          height: fit-content; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
          position: sticky; 
          top: 30px;
          border: 1px solid rgba(255,255,255,0.8);
        }
        .filters h3 { color: #2c3e50; margin-bottom: 25px; font-size: 1.4rem; font-weight: 700; }
        
        .filter-group { margin-bottom: 25px; }
        .filter-label { 
          display: block; 
          font-weight: 600; 
          color: #2c3e50; 
          margin-bottom: 10px; 
          font-size: 0.95rem; 
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .filter-input, .filter-select { 
          width: 100%; 
          padding: 12px 16px; 
          border: 2px solid #e1e8ed; 
          border-radius: 12px; 
          font-size: 0.95rem; 
          transition: all 0.3s ease;
          background: #f8f9fa;
        }
        .filter-input:focus, .filter-select:focus { 
          outline: none; 
          border-color: #667eea; 
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .checkbox-group { display: flex; flex-direction: column; gap: 12px; }
        .checkbox-item { 
          display: flex; 
          align-items: center; 
          gap: 10px; 
          padding: 8px 12px;
          border-radius: 8px;
          transition: background-color 0.3s ease;
        }
        .checkbox-item:hover { background-color: #f8f9fa; }
        .checkbox-item input { 
          margin: 0; 
          width: 18px; 
          height: 18px; 
          accent-color: #667eea;
        }
        .checkbox-item label { font-size: 0.9rem; cursor: pointer; font-weight: 500; }
        
        .range-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        
        .clear-btn { 
          background: linear-gradient(135deg, #ff6b6b, #ee5a24); 
          color: white; 
          border: none; 
          padding: 10px 20px; 
          border-radius: 10px; 
          cursor: pointer; 
          font-size: 0.85rem; 
          font-weight: 600;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .clear-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4); }
        
        .content { 
          background: white; 
          border-radius: 20px; 
          padding: 30px; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
          border: 1px solid rgba(255,255,255,0.8);
        }
        
        .content-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-bottom: 30px; 
          flex-wrap: wrap; 
          gap: 20px; 
          padding-bottom: 20px;
          border-bottom: 2px solid #f8f9fa;
        }
        .content-title { color: #2c3e50; font-size: 1.8rem; margin: 0; font-weight: 700; }
        .content-subtitle { color: #718096; font-size: 0.95rem; margin: 8px 0 0; }
        
        .controls { display: flex; align-items: center; gap: 20px; }
        
        .view-toggle { 
          display: flex; 
          border: 2px solid #e1e8ed; 
          border-radius: 12px; 
          overflow: hidden;
          background: #f8f9fa;
        }
        .view-btn { 
          background: transparent; 
          border: none; 
          padding: 10px 15px; 
          cursor: pointer; 
          color: #718096; 
          transition: all 0.3s ease;
          font-size: 1.1rem;
        }
        .view-btn.active { 
          background: #3498db;
          color: white; 
        }
        
        .sort-select { 
          padding: 10px 16px; 
          border: 2px solid #e1e8ed; 
          border-radius: 12px; 
          font-size: 0.95rem; 
          background: #f8f9fa;
          cursor: pointer;
        }
        
        .toggle-filters { 
          display: none; 
          background: linear-gradient(135deg, #667eea, #764ba2); 
          color: white; 
          border: none; 
          padding: 12px 24px; 
          border-radius: 12px; 
          cursor: pointer; 
          margin-bottom: 20px; 
          font-weight: 600;
        }
        
        .properties-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); 
          gap: 25px; 
        }
        .properties-list { display: flex; flex-direction: column; gap: 20px; }
        
        .card { 
          background: white; 
          border-radius: 20px; 
          overflow: hidden; 
          box-shadow: 0 5px 20px rgba(0,0,0,0.08); 
          transition: all 0.4s ease; 
          border: 1px solid rgba(255,255,255,0.8); 
          position: relative;
          cursor: pointer;
        }
        .card:hover { 
          transform: translateY(-8px); 
          box-shadow: 0 15px 40px rgba(0,0,0,0.15); 
        }
        
        .card-image { 
          height: 220px; 
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: white; 
          position: relative; 
          background-size: cover; 
          background-position: center; 
        }
        .card-image::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.2), rgba(0,0,0,0.4));
          z-index: 1;
        }
        
        .badges { 
          position: absolute; 
          top: 15px; 
          left: 15px; 
          display: flex; 
          flex-direction: column; 
          gap: 8px; 
          z-index: 2;
        }
        .badge { 
          padding: 6px 12px; 
          border-radius: 20px; 
          font-size: 0.75rem; 
          font-weight: 700; 
          text-transform: uppercase; 
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 4px;
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .badge-featured { background: linear-gradient(135deg, #ffd700, #ffb347); color: #2c3e50; }
        .badge-premium { background: linear-gradient(135deg, #e056fd, #686de0); color: white; }
        .badge-normal { background: linear-gradient(135deg, #74b9ff, #0984e3); color: white; }
        .badge-new { background: linear-gradient(135deg, #00b894, #00cec9); color: white; }
        
        .card-body { padding: 25px; }
        
        .price { 
          font-size: 1.4rem; 
          font-weight: 800; 
          color: #e74c3c; 
          margin-bottom: 8px; 
        }
        .price-sqft { 
          font-size: 0.85rem; 
          color: #95a5a6; 
          font-weight: 500;
        }
        
        .title { 
          font-size: 1.1rem; 
          font-weight: 600; 
          color: #2c3e50; 
          margin-bottom: 10px; 
          line-height: 1.4; 
        }
        
        .location { 
          color: #718096; 
          margin-bottom: 15px; 
          font-size: 0.95rem; 
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .specs { 
          display: flex; 
          flex-wrap: wrap; 
          gap: 8px; 
          margin-bottom: 15px; 
          font-size: 0.85rem; 
        }
        .spec { 
          background: linear-gradient(135deg, #f8f9fa, #e9ecef); 
          padding: 6px 12px; 
          border-radius: 15px; 
          color: #495057;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .brand-name {
          font-size: 0.9rem;
          color: #667eea;
          font-weight: 600;
          margin-bottom: 15px;
          padding: 8px 12px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
          border-radius: 10px;
          border-left: 3px solid #667eea;
        }
        
        .actions { display: flex; gap: 12px; }
        .btn { 
          padding: 12px 20px; 
          border: none; 
          border-radius: 12px; 
          cursor: pointer; 
          font-weight: 600; 
          text-align: center; 
          transition: all 0.3s ease; 
          flex: 1; 
          font-size: 0.9rem; 
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .btn-primary { 
          background: #3498db;
          color: white; 
        }
        .btn-outline { 
          background: white; 
          color: #667eea; 
          border: 2px solid #667eea; 
        }
        .btn:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }
        
        .list-item { 
          display: grid; 
          grid-template-columns: 220px 1fr auto; 
          gap: 25px; 
          padding: 25px; 
          border: 2px solid #f8f9fa; 
          border-radius: 20px; 
          background: white;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .list-item:hover { 
          border-color: #667eea; 
          box-shadow: 0 8px 25px rgba(0,0,0,0.1); 
          transform: translateY(-2px);
        }
        
        .list-image { 
          height: 140px; 
          border-radius: 15px; 
          background: #3498db;
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: white; 
          background-size: cover; 
          background-position: center; 
          position: relative;
        }
        
        .list-actions { 
          display: flex; 
          flex-direction: column; 
          gap: 12px; 
          min-width: 160px; 
        }
        
        .pagination { 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          gap: 8px; 
          margin-top: 40px; 
        }
        .page-btn { 
          padding: 12px 16px; 
          border: 2px solid #e1e8ed; 
          background: white; 
          color: #718096; 
          border-radius: 12px; 
          cursor: pointer; 
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .page-btn:hover, .page-btn.active { 
          background: #3498db;
          color: white; 
          border-color: #667eea; 
          transform: translateY(-2px);
        }
        .page-btn:disabled { 
          opacity: 0.5; 
          cursor: not-allowed; 
          transform: none;
        }
        
        .no-results { 
          text-align: center; 
          padding: 60px 20px; 
          color: #718096; 
        }
        .no-results h3 { 
          color: #2c3e50; 
          margin-bottom: 15px; 
          font-size: 1.5rem;
        }
        
        @media (max-width: 768px) {
          .main { grid-template-columns: 1fr; }
          .filters { position: static; display: ${showFilters ? 'block' : 'none'}; }
          .toggle-filters { display: block; }
          .properties-grid { grid-template-columns: 1fr; }
          .content-header { flex-direction: column; align-items: stretch; }
          .controls { justify-content: center; }
          .list-item { grid-template-columns: 1fr; }
          .list-actions { flex-direction: row; min-width: auto; }
          .header h1 { font-size: 2rem; }
        }
      `}</style>

      <div className="header">
        <h1>Properties in {districts.find(d => d.district_id === filters.district)?.district_name || 'All Locations'}</h1>
        <p>{filteredProperties.length} premium properties found</p>
      </div>

      <div className="container">
        <div className="main">
          <div className="filters">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h3>Advanced Filters</h3>
              <button className="clear-btn" onClick={clearAllFilters}>Clear All</button>
            </div>

            <div className="filter-group">
              <label className="filter-label">Looking For</label>
              <select className="filter-select" value={filters.transactionType} onChange={(e) => handleFilterChange('transactionType', e.target.value)}>
                <option value="all">All</option>
                <option value="sale">Buy</option>
                <option value="rent">Rent</option>
                <option value="lease">Lease</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Property Type</label>
              <select
                className="filter-select"
                value={filters.propertyType}
                onChange={(e) => handleFilterChange('propertyType', e.target.value)}
              >
                <option value="all">All Types</option>
                {propertyTypes
                  .filter(pt => pt.active === "1")
                  .map(pt => (
                    <option key={pt.type_id} value={pt.name}>
                      {pt.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Brand Type</label>
              <select
                className="filter-select"
                value={filters.brandType || 'all'}
                onChange={(e) => handleFilterChange('brandType', e.target.value)}
              >
                <option value="all">All Types</option>
                {brandStore &&
                  brandStore
                    .filter(brand => brand.active === "1")
                    .map(brand => (
                      <option key={brand.brand_id} value={brand.name}>
                        {brand.name}
                      </option>
                    ))
                }
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">BHK Configuration</label>
              <div className="checkbox-group">
                {['1', '2', '3', '4', '5+'].map(bhk => (
                  <div key={bhk} className="checkbox-item">
                    <input type="checkbox" id={`bhk-${bhk}`} checked={filters.bhk.includes(bhk)} onChange={() => handleFilterChange('bhk', bhk)} />
                    <label htmlFor={`bhk-${bhk}`}>{bhk} BHK</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">District</label>
              <select className="filter-select" value={filters.district} onChange={(e) => handleFilterChange('district', e.target.value)}>
                <option value="">Select District</option>
                {districts.map(d => <option key={d.district_id} value={d.district_id}>{d.district_name}</option>)}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">City</label>
              <select className="filter-select" value={filters.city} onChange={(e) => handleFilterChange('city', e.target.value)} disabled={!filters.district}>
                <option value="">{filters.district ? 'Select City' : 'Select District First'}</option>
                {cities.map(c => <option key={c.city_id} value={c.city_id}>{c.city_name}</option>)}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Price Range (Lakhs)</label>
              <div className="range-inputs">
                <input type="number" className="filter-input" placeholder="Min Price" value={filters.priceRange.min} onChange={(e) => handleFilterChange('priceRange', { min: e.target.value })} />
                <input type="number" className="filter-input" placeholder="Max Price" value={filters.priceRange.max} onChange={(e) => handleFilterChange('priceRange', { max: e.target.value })} />
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Area Range (sq ft)</label>
              <div className="range-inputs">
                <input type="number" className="filter-input" placeholder="Min Area" value={filters.areaRange.min} onChange={(e) => handleFilterChange('areaRange', { min: e.target.value })} />
                <input type="number" className="filter-input" placeholder="Max Area" value={filters.areaRange.max} onChange={(e) => handleFilterChange('areaRange', { max: e.target.value })} />
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Property Features</label>
              <div className="checkbox-group">
                <div className="checkbox-item">
                  <input type="checkbox" id="verified" checked={filters.verified} onChange={(e) => handleFilterChange('verified', e.target.checked)} />
                  <label htmlFor="verified">Featured Properties</label>
                </div>
                <div className="checkbox-item">
                  <input type="checkbox" id="newLaunch" checked={filters.newLaunch} onChange={(e) => handleFilterChange('newLaunch', e.target.checked)} />
                  <label htmlFor="newLaunch">Published Only</label>
                </div>
                <div className="checkbox-item">
                  <input type="checkbox" id="isResale" checked={filters.isResale} onChange={(e) => handleFilterChange('isResale', e.target.checked)} />
                  <label htmlFor="isResale">Resale Properties</label>
                </div>
              </div>
            </div>
          </div>

          <div className="content">
            <button className="toggle-filters" onClick={() => setShowFilters(!showFilters)}>
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>

            <div className="content-header">
              <div>
                <h2 className="content-title">{filteredProperties.length} Properties Found</h2>
                <p className="content-subtitle">Showing {((currentPage - 1) * propertiesPerPage) + 1} - {Math.min(currentPage * propertiesPerPage, filteredProperties.length)} of {filteredProperties.length} results</p>
              </div>
              <div className="controls">
                <div className="view-toggle">
                  <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>⊞</button>
                  <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>☰</button>
                </div>
                <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="relevance">Relevance</option>
                  <option value="priority">Priority</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="area-large">Area: Large to Small</option>
                  <option value="area-small">Area: Small to Large</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {currentProperties.length === 0 ? (
              <div className="no-results">
                <h3>No Properties Found</h3>
                <p>We couldn't find any properties matching your criteria. Try adjusting your filters to see more results.</p>
                <button className="btn btn-primary" onClick={clearAllFilters} style={{ marginTop: '20px', maxWidth: '200px' }}>Clear All Filters</button>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid' ? 'properties-grid' : 'properties-list'}>
                  {currentProperties.map((property) => {
                    const priorityBadge = getPriorityBadge(property.priority);
                    return viewMode === 'grid' ? (
                      <div key={property.id} className="card" onClick={() => handlePropertyClick(property.id)}>
                        <div className="card-image" style={{ backgroundImage: property.image ? `url(${property.image})` : 'none' }}>
                          <div className="badges">
                            {priorityBadge && (
                              <span className={`badge ${priorityBadge.class}`}>
                                {priorityBadge.icon} {priorityBadge.text}
                              </span>
                            )}
                            {property.newLaunch && <span className="badge badge-new">🆕 New</span>}
                            {property.isResale && <span className="badge badge-new">🔄 Resale</span>}
                          </div>
                          {!property.image && <span style={{ fontSize: '3rem', zIndex: 2 }}>🏠</span>}
                        </div>
                        <div className="card-body">
                          <div className="price">
                            {formatPrice(property.price, property.transactionType)}
                            {property.pricePerSqft > 0 && <div className="price-sqft">₹{property.pricePerSqft.toLocaleString()}/sq ft</div>}
                          </div>
                          <h3 className="title">{property.title}</h3>
                          <div className="location">
                            📍 {property.location}
                          </div>
                          <div className="specs">
                            <span className="spec">🏠 {property.bhk} BHK</span>
                            <span className="spec">📏 {property.area.toLocaleString()} sq ft</span>
                            <span className="spec">🏢 {property.type}</span>
                          </div>
                          {property.brand_store_name && (
                            <div className="brand-name">
                              🏗️ {property.brand_store_name}
                            </div>
                          )}
                          <div className="actions">
                            <button className="btn btn-primary" onClick={(e) => {
                              e.stopPropagation();
                              handlePropertyClick(property.id);
                            }}>Contact Now</button>
                            <button className="btn btn-outline" onClick={(e) => {
                              e.stopPropagation();
                              handlePropertyClick(property.id);
                            }}>View Details</button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div key={property.id} className="list-item" onClick={() => handlePropertyClick(property.id)}>
                        <div className="list-image" style={{ backgroundImage: property.image ? `url(${property.image})` : 'none' }}>
                          {!property.image && <span style={{ fontSize: '2rem' }}>🏠</span>}
                          <div className="badges">
                            {priorityBadge && (
                              <span className={`badge ${priorityBadge.class}`}>
                                {priorityBadge.icon} {priorityBadge.text}
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="price">
                            {formatPrice(property.price, property.transactionType)}
                            {property.pricePerSqft > 0 && <span className="price-sqft"> (₹{property.pricePerSqft.toLocaleString()}/sq ft)</span>}
                          </div>
                          <h3 className="title">{property.title}</h3>
                          <div className="location">📍 {property.location}</div>
                          <div className="specs">
                            <span className="spec">🏠 {property.bhk} BHK</span>
                            <span className="spec">📏 {property.area.toLocaleString()} sq ft</span>
                            <span className="spec">🏢 {property.type}</span>
                          </div>
                          {property.brand_store_name && (
                            <div className="brand-name">
                              🏗️ {property.brand_store_name}
                            </div>
                          )}
                        </div>
                        <div className="list-actions">
                          <button className="btn btn-primary" onClick={(e) => {
                            e.stopPropagation();
                            handlePropertyClick(property.id);
                          }}>Contact Now</button>
                          <button className="btn btn-outline" onClick={(e) => {
                            e.stopPropagation();
                            handlePropertyClick(property.id);
                          }}>View Details</button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="page-btn"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      ‹ Previous
                    </button>
                    {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                      const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                      if (pageNum > totalPages) return null;
                      return (
                        <button
                          key={pageNum}
                          className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      className="page-btn"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next ›
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;