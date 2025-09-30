import React, { useState, useEffect } from 'react';

const PostPropertyModal = ({ onClose, onSave }) => {
  const api = "https://demo.stss.in/admin/Config/router.php?router=";
  
  const [formData, setFormData] = useState({
    edit_property_id: '0',
    admin_id: '',
    propertyName: '',
    propertyType: '',
    transactionType: '',
    bhkConfiguration: [],
    pricePerSqft: '',
    expectedPriceLakhs: '',
    propetyage: '',
    inclusiveCharges: false,
    propertyPriority: 'Normal',
    state: 'Tamil Nadu',
    District: '',
    city: '',
    propertyAddress: '',
    landmark: '',
    ownerName: '',
    contactNumber: '',
    propertyDescription: '',
    rera_id: '',
    brandType: ''
  });

  const [propertyTypes, setPropertyTypes] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [brands, setBrands] = useState([]);
  const [builtupAreas, setBuiltupAreas] = useState({});
  const [nonBhkAreas, setNonBhkAreas] = useState(['']);
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
  const [showBhkSection, setShowBhkSection] = useState(true);
  const [removedImages, setRemovedImages] = useState([]);

  const bhkAreaSuggestions = {
    "1BHK": "300 - 700",
    "2BHK": "700 - 1200",
    "3BHK": "1200 - 1600",
    "4BHK": "1600 - 2200",
    "5+BHK": "2200 - 4000"
  };

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
    setFormData(prev => ({
      ...prev,
      admin_id: userDetails.admin_id || '',
      ownerName: userDetails.name || '',
      contactNumber: userDetails.phone || ''
    }));

    // Fetch all dropdown data
    Promise.all([
      fetch(`${api}property_type_list`).then(res => res.json()),
      fetch(`${api}district_list`).then(res => res.json()),
      fetch(`${api}city_list`).then(res => res.json()),
      fetch(`${api}brand_store_list`).then(res => res.json())
    ]).then(([propTypes, districtList, cityList, brandList]) => {
      setPropertyTypes(propTypes.data || []);
      setDistricts(districtList.data || []);
      setCities(cityList.data || []);
      setBrands(brandList.data || []);
    }).catch(err => console.error('Error fetching data:', err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBhkChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const newBhk = checked
        ? [...prev.bhkConfiguration, value]
        : prev.bhkConfiguration.filter(bhk => bhk !== value);
      
      // Update builtup areas when BHK changes
      if (!checked) {
        const newBuiltupAreas = { ...builtupAreas };
        delete newBuiltupAreas[`builtupArea[${value}]`];
        setBuiltupAreas(newBuiltupAreas);
      }
      
      return { ...prev, bhkConfiguration: newBhk };
    });
  };

  const handleBuiltupAreaChange = (bhk, value) => {
    setBuiltupAreas(prev => ({
      ...prev,
      [`builtupArea[${bhk}]`]: value
    }));
    calculatePrice();
  };

  const handlePropertyTypeChange = (e) => {
    const typeId = e.target.value;
    setFormData(prev => ({ ...prev, propertyType: typeId }));
    
    // Property types 3 and 4 are for plots/land (non-BHK)
    if (typeId === '3' || typeId === '4') {
      setShowBhkSection(false);
      setFormData(prev => ({ ...prev, bhkConfiguration: [] }));
      setBuiltupAreas({});
    } else {
      setShowBhkSection(true);
      setNonBhkAreas(['']);
    }
  };

  const calculatePrice = () => {
    if (!formData.pricePerSqft) return;
    
    let totalArea = 0;
    Object.values(builtupAreas).forEach(area => {
      const numArea = parseFloat(area) || 0;
      totalArea += numArea;
    });
    
    if (totalArea > 0) {
      const totalPrice = totalArea * parseFloat(formData.pricePerSqft);
      setFormData(prev => ({
        ...prev,
        expectedPriceLakhs: (totalPrice / 100000).toFixed(2)
      }));
    }
  };

  useEffect(() => {
    calculatePrice();
  }, [formData.pricePerSqft, builtupAreas]);

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setAdditionalImages(files);
    setAdditionalImagePreviews(files.map(file => URL.createObjectURL(file)));
  };

  const addNonBhkArea = () => {
    setNonBhkAreas(prev => [...prev, '']);
  };

  const removeNonBhkArea = (index) => {
    setNonBhkAreas(prev => prev.filter((_, i) => i !== index));
  };

  const handleNonBhkAreaChange = (index, value) => {
    setNonBhkAreas(prev => {
      const newAreas = [...prev];
      newAreas[index] = value;
      return newAreas;
    });
  };

  const removeNewImage = (index) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const propertyType = formData.propertyType;

    // Validation
    if (propertyType === '3' || propertyType === '4') {
      const hasValidArea = nonBhkAreas.some(area => area.trim() !== '');
      if (!hasValidArea) {
        alert('Please enter at least one built-up area.');
        return;
      }
    } else {
      if (formData.bhkConfiguration.length === 0) {
        alert('Please select at least one BHK option.');
        return;
      }
      
      const allAreasEntered = formData.bhkConfiguration.every(bhk => {
        const key = `builtupArea[${bhk}]`;
        return builtupAreas[key] && builtupAreas[key].trim() !== '';
      });
      
      if (!allAreasEntered) {
        alert('Please enter built-up area for all selected BHK configurations.');
        return;
      }
    }

    const submitFormData = new FormData();
    
    // Add all form fields
    Object.keys(formData).forEach(key => {
      if (key === 'bhkConfiguration') {
        formData[key].forEach(bhk => {
          submitFormData.append('bhkConfiguration[]', bhk);
        });
      } else if (key === 'inclusiveCharges') {
        submitFormData.append(key, formData[key] ? '1' : '0');
      } else {
        submitFormData.append(key, formData[key]);
      }
    });

    // Add builtup areas based on property type
    if (propertyType === '3' || propertyType === '4') {
      const validAreas = nonBhkAreas.filter(area => area.trim() !== '');
      submitFormData.append('nonBhkBuiltupArea', JSON.stringify(validAreas));
    } else {
      submitFormData.append('builtupArea', JSON.stringify(builtupAreas));
    }

    // Add removed images
    if (removedImages.length > 0) {
      submitFormData.append('removed_images', JSON.stringify(removedImages));
    }

    // Add images
    if (mainImage) {
      submitFormData.append('mainImage', mainImage);
    }
    additionalImages.forEach(img => {
      submitFormData.append('additionalImages[]', img);
    });

    try {
      const router = formData.edit_property_id !== '0' ? 'update_property' : 'add_property';
      const response = await fetch(`${api}${router}`, {
        method: 'POST',
        body: submitFormData
      });

      const result = await response.json();
      
      if (result.status === 'success' || result.success || result.status === 200) {
        alert('Property saved successfully!');
        
        // Refresh property list
        const propResponse = await fetch(`${api}property_list`);
        const propData = await propResponse.json();
        localStorage.setItem('userProperties', JSON.stringify(propData.data || []));
        
        onSave();
      } else {
        alert('Failed to save property: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  return (
    <div style={formStyle}>
      <input type="hidden" name="edit_property_id" value={formData.edit_property_id} />
      <input type="hidden" name="admin_id" value={formData.admin_id} />

      <div style={formGroupStyle}>
        <label style={labelStyle}>Property Name *</label>
        <input
          type="text"
          name="propertyName"
          value={formData.propertyName}
          onChange={handleInputChange}
          style={inputStyle}
          required
        />
      </div>

      <div style={rowStyle}>
        <div style={colStyle}>
          <label style={labelStyle}>Property Type *</label>
          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={handlePropertyTypeChange}
            style={inputStyle}
            required
          >
            <option value="" disabled>Select Property Type</option>
            {propertyTypes.map(pt => (
              <option key={pt.type_id} value={pt.type_id}>{pt.name}</option>
            ))}
          </select>
        </div>
        <div style={colStyle}>
          <label style={labelStyle}>Transaction Type *</label>
          <select
            name="transactionType"
            value={formData.transactionType}
            onChange={handleInputChange}
            style={inputStyle}
            required
          >
            <option value="" disabled>Select Transaction Type</option>
            <option value="Sale">Sale</option>
            <option value="Rent">Rent</option>
            <option value="Lease">Lease</option>
          </select>
        </div>
      </div>

      {showBhkSection ? (
        <div style={rowStyle}>
          <div style={colStyle}>
            <label style={labelStyle}>BHK Configuration *</label>
            <div style={checkboxContainerStyle}>
              {['1BHK', '2BHK', '3BHK', '4BHK', '5+BHK'].map(bhk => (
                <label key={bhk} style={checkboxLabelStyle}>
                  <input
                    type="checkbox"
                    value={bhk}
                    checked={formData.bhkConfiguration.includes(bhk)}
                    onChange={handleBhkChange}
                    style={checkboxStyle}
                  />
                  {bhk}
                </label>
              ))}
            </div>
            <small style={hintStyle}>Select one or more BHK options</small>
          </div>
          <div style={colStyle}>
            <label style={labelStyle}>Built-up Area (sq ft) *</label>
            {formData.bhkConfiguration.map(bhk => (
              <div key={bhk} style={{ marginBottom: '8px' }}>
                <input
                  type="text"
                  placeholder={`${bhk}: ${bhkAreaSuggestions[bhk]}`}
                  value={builtupAreas[`builtupArea[${bhk}]`] || ''}
                  onChange={(e) => handleBuiltupAreaChange(bhk, e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={formGroupStyle}>
          <label style={labelStyle}>Plot Area (sq ft) *</label>
          {nonBhkAreas.map((area, idx) => (
            <div key={idx} style={areaInputContainerStyle}>
              <input
                type="text"
                placeholder="Enter area in sq ft min-max"
                value={area}
                onChange={(e) => handleNonBhkAreaChange(idx, e.target.value)}
                style={{ ...inputStyle, marginBottom: '8px', marginRight: '10px' }}
                required={idx === 0}
              />
              {idx > 0 && (
                <button 
                  type="button" 
                  onClick={() => removeNonBhkArea(idx)} 
                  style={removeButtonStyle}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addNonBhkArea} style={addButtonStyle}>
            Add More Area
          </button>
        </div>
      )}

      <div style={rowStyle}>
        <div style={colStyle}>
          <label style={labelStyle}>Price per Sq Ft (₹) *</label>
          <input
            type="number"
            name="pricePerSqft"
            value={formData.pricePerSqft}
            onChange={handleInputChange}
            style={inputStyle}
            step="0.01"
            required
          />
        </div>
        <div style={colStyle}>
          <label style={labelStyle}>Property Age *</label>
          <select
            name="propetyage"
            value={formData.propetyage}
            onChange={handleInputChange}
            style={inputStyle}
            required
          >
            <option value="" disabled>Select Property Age</option>
            <option value="new">New</option>
            <option value="old">Old</option>
          </select>
        </div>
      </div>

      {formData.expectedPriceLakhs && (
        <div style={formGroupStyle}>
          <label style={labelStyle}>Expected Price (Lakhs)</label>
          <input
            type="text"
            value={`₹${formData.expectedPriceLakhs} Lakhs`}
            style={{ ...inputStyle, background: '#f3f4f6', cursor: 'not-allowed' }}
            readOnly
          />
        </div>
      )}

      <div style={formGroupStyle}>
        <label style={checkboxLabelStyle}>
          <input
            type="checkbox"
            name="inclusiveCharges"
            checked={formData.inclusiveCharges}
            onChange={handleInputChange}
            style={checkboxStyle}
          />
          Inclusive of all charges
        </label>
      </div>

      <div style={rowStyle}>
        <div style={colStyle}>
          <label style={labelStyle}>Property Priority *</label>
          <select
            name="propertyPriority"
            value={formData.propertyPriority}
            onChange={handleInputChange}
            style={inputStyle}
            required
          >
            <option value="Normal">Normal</option>
            <option value="Featured">Featured Property</option>
            <option value="Premium">Premium Property</option>
          </select>
          <small style={hintStyle}>Normal is default. Featured and Premium properties get higher visibility.</small>
        </div>
        <div style={colStyle}>
          <label style={labelStyle}>State *</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            style={{ ...inputStyle, background: '#f3f4f6' }}
            readOnly
          />
        </div>
      </div>

      <div style={rowStyle}>
        <div style={colStyle}>
          <label style={labelStyle}>City *</label>
          <select
            name="District"
            value={formData.District}
            onChange={handleInputChange}
            style={inputStyle}
            required
          >
            <option value="" disabled>Select City</option>
            {districts.map(d => (
              <option key={d.district_id} value={d.district_id}>{d.district_name}</option>
            ))}
          </select>
        </div>
        <div style={colStyle}>
          <label style={labelStyle}>Locality *</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            style={inputStyle}
            required
          >
            <option value="" disabled>Select Locality</option>
            {cities.map(c => (
              <option key={c.city_id} value={c.city_id}>{c.city_name}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Property Address *</label>
        <textarea
          name="propertyAddress"
          value={formData.propertyAddress}
          onChange={handleInputChange}
          style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
          required
        />
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Landmark *</label>
        <input
          type="text"
          name="landmark"
          value={formData.landmark}
          onChange={handleInputChange}
          style={inputStyle}
          required
        />
      </div>

      <div style={rowStyle}>
        <div style={colStyle}>
          <label style={labelStyle}>Owner Name *</label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleInputChange}
            style={inputStyle}
            required
          />
        </div>
        <div style={colStyle}>
          <label style={labelStyle}>Contact Number *</label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            style={inputStyle}
            required
          />
        </div>
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Property Description</label>
        <textarea
          name="propertyDescription"
          value={formData.propertyDescription}
          onChange={handleInputChange}
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
        />
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>RERA ID</label>
        <input
          type="text"
          name="rera_id"
          value={formData.rera_id}
          onChange={handleInputChange}
          style={inputStyle}
        />
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Brand Type</label>
        <select
          name="brandType"
          value={formData.brandType}
          onChange={handleInputChange}
          style={inputStyle}
        >
          <option value="">Select Brand</option>
          {brands.map(b => (
            <option key={b.brand_id} value={b.brand_id}>{b.name}</option>
          ))}
        </select>
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Main Property Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleMainImageChange}
          style={fileInputStyle}
        />
        {mainImagePreview && (
          <img src={mainImagePreview} alt="Main preview" style={previewImageStyle} />
        )}
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Additional Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleAdditionalImagesChange}
          style={fileInputStyle}
        />
        <small style={hintStyle}>You can select multiple images</small>
        <div style={previewContainerStyle}>
          {additionalImagePreviews.map((preview, idx) => (
            <div key={idx} style={previewItemStyle}>
              <img src={preview} alt={`Preview ${idx + 1}`} style={previewImageSmallStyle} />
              <button
                type="button"
                onClick={() => removeNewImage(idx)}
                style={removeImageButtonStyle}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={buttonContainerStyle}>
        <button type="button" onClick={onClose} style={cancelButtonStyle}>
          Cancel
        </button>
        <button type="button" onClick={handleSubmit} style={submitButtonStyle}>
          Save Property
        </button>
      </div>
    </div>
  );
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const formGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const rowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '15px'
};

const colStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const labelStyle = {
  fontWeight: '600',
  fontSize: '0.95rem',
  color: '#374151'
};

const inputStyle = {
  padding: '10px',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'border-color 0.2s'
};

const checkboxContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '15px',
  marginTop: '5px'
};

const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  fontSize: '0.95rem',
  cursor: 'pointer'
};

const checkboxStyle = {
  width: '16px',
  height: '16px',
  cursor: 'pointer'
};

const hintStyle = {
  fontSize: '0.85rem',
  color: '#6b7280',
  marginTop: '4px'
};

const areaInputContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '10px'
};

const addButtonStyle = {
  padding: '8px 16px',
  background: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.9rem',
  marginTop: '8px',
  alignSelf: 'flex-start'
};

const removeButtonStyle = {
  padding: '6px 12px',
  background: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.85rem'
};

const fileInputStyle = {
  padding: '8px',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '0.9rem'
};

const previewContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
  gap: '10px',
  marginTop: '10px'
};

const previewItemStyle = {
  position: 'relative'
};

const previewImageStyle = {
  width: '150px',
  height: '150px',
  objectFit: 'cover',
  borderRadius: '6px',
  border: '1px solid #e5e7eb',
  marginTop: '10px'
};

const previewImageSmallStyle = {
  width: '100%',
  height: '100px',
  objectFit: 'cover',
  borderRadius: '6px',
  border: '1px solid #e5e7eb'
};

const removeImageButtonStyle = {
  position: 'absolute',
  top: '5px',
  right: '5px',
  background: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  width: '24px',
  height: '24px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const buttonContainerStyle = {
  display: 'flex',
  gap: '10px',
  justifyContent: 'flex-end',
  marginTop: '20px',
  paddingTop: '20px',
  borderTop: '1px solid #e5e7eb'
};

const cancelButtonStyle = {
  padding: '10px 20px',
  background: '#6b7280',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.95rem',
  fontWeight: '600'
};

const submitButtonStyle = {
  padding: '10px 20px',
  background: '#3B82F6',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.95rem',
  fontWeight: '600'
};

export default PostPropertyModal;