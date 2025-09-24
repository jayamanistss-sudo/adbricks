import React, { useState, useEffect } from 'react';

const PostPropertyModal = ({ onSave, onClose }) => {
  const api = "https://demo.stss.in/admin/Config/router.php?router=";
  const [brandStore, setBrandStore] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    propertyType: "",
    transactionType: "",
    bhkConfiguration: "",
    builtupArea: "",
    pricePerSqft: "",
    expectedPriceLakhs: "",
    inclusiveCharges: false,
    propertyPriority: "Normal",
    state: "Tamil Nadu",
    District: "",
    city: "",
    propertyAddress: "",
    ownerName: "",
    contactNumber: "",
    propertyDescription: "",
    brandType: "",
    mainImage: null,
    additionalImages: [],
    propetyage: ""
  });
  useEffect(() => {
    const storedUser = localStorage.getItem("userDetails");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandRes, districtRes, cityRes, typeRes] = await Promise.all([
          fetch(`${api}brandstore_list`),
          fetch(`${api}district_type_list`),
          fetch(`${api}city_type_list`),
          fetch(`${api}property_type_list`)
        ]);
        const [brandData, districtData, cityData, typeData] = await Promise.all([
          brandRes.json(),
          districtRes.json(),
          cityRes.json(),
          typeRes.json()
        ]);
        setBrandStore(brandData.data || []);
        setDistricts(districtData.data || []);
        setCities(cityData.data || []);
        setPropertyTypes(typeData.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [api]);

  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalPreviews, setAdditionalPreviews] = useState([]);

  useEffect(() => {
    if (formData.builtupArea && formData.pricePerSqft) {
      const expected = (parseFloat(formData.builtupArea) * parseFloat(formData.pricePerSqft)) / 100000;
      setFormData(prev => ({ ...prev, expectedPriceLakhs: expected.toFixed(2) }));
    }
  }, [formData.builtupArea, formData.pricePerSqft]);

  const handleMainImage = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, mainImage: file });
    if (file) setMainImagePreview(URL.createObjectURL(file));
  };

  const handleAdditionalImages = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, additionalImages: files });
    setAdditionalPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const submitFormData = new FormData();

  Object.keys(formData).forEach((key) => {
    if (key === "additionalImages") {
      formData[key].forEach((file, index) => {
        submitFormData.append(`additionalImages[${index}]`, file);
      });
    } else if (key === "mainImage" && formData[key]) {
      submitFormData.append(key, formData[key]);
    } else {
      submitFormData.append(key, formData[key]);
    }
  });

  // ✅ Ensure ownerName & contactNumber are included from user
  if (user) {
    submitFormData.set("ownerName", user.name || "");
    submitFormData.set("contactNumber", user.phone || "");
  }

  try {
    const response = await fetch(`${api}add_property`, {
      method: "POST",
      body: submitFormData,
    });

    if (response.ok) {
      const result = await response.json();
      alert("Property posted successfully!");
      onClose();
      window.location.reload();
    } else {
      alert("Error posting property. Please try again.");
    }
  } catch (err) {
    console.error(err);
    alert("Error posting property. Please try again.");
  }
};


  const commonStyles = {
    wrapper: { background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" },
    formGroup: { marginBottom: "20px" },
    label: { display: "block", marginBottom: "6px", fontWeight: "500", fontSize: "14px", color: "#374151" },
    control: { width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "14px" },
    row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
    buttonRow: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" },
    btn: { padding: "10px 20px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
    saveBtn: { background: "#3b82f6", color: "white" },
    cancelBtn: { background: "#e5e7eb", color: "#374151" }
  };

  return (
    <form onSubmit={handleSubmit} style={commonStyles.wrapper}>
      <h2>Post Property</h2>
      <div style={commonStyles.row}>
        <div style={commonStyles.formGroup}>
          <label style={commonStyles.label}>Property Type *</label>
          <select style={commonStyles.control} value={formData.propertyType} onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })} required>
            <option value="">Select</option>
            {propertyTypes.map((type, i) => <option key={i} value={type.name || type.id}>{type.name || type.title || `Type ${i + 1}`}</option>)}
          </select>
        </div>
        <div style={commonStyles.formGroup}>
          <label style={commonStyles.label}>Transaction Type *</label>
          <select style={commonStyles.control} value={formData.transactionType} onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })} required>
            <option value="">Select</option>
            <option value="Sale">Sale</option>
            <option value="Rent">Rent</option>
            <option value="Lease">Lease</option>
          </select>
        </div>
      </div>
      <div style={commonStyles.row}>
        <div style={commonStyles.formGroup}>
          <label style={commonStyles.label}>BHK Configuration *</label>
          <select style={commonStyles.control} value={formData.bhkConfiguration} onChange={(e) => setFormData({ ...formData, bhkConfiguration: e.target.value })} required>
            <option value="">Select</option>
            <option value="1BHK">1BHK</option>
            <option value="2BHK">2BHK</option>
            <option value="3BHK">3BHK</option>
            <option value="4BHK">4BHK</option>
            <option value="5+BHK">5+BHK</option>
          </select>
        </div>
        <div style={commonStyles.formGroup}>
          <label style={commonStyles.label}>Built-up Area (sq ft) *</label>
          <input type="number" style={commonStyles.control} value={formData.builtupArea} onChange={(e) => setFormData({ ...formData, builtupArea: e.target.value })} required />
        </div>
      </div>
      <div style={commonStyles.row}>
        <div style={commonStyles.formGroup}>
          <label style={commonStyles.label}>Price per Sq Ft (₹) *</label>
          <input type="number" style={commonStyles.control} value={formData.pricePerSqft} onChange={(e) => setFormData({ ...formData, pricePerSqft: e.target.value })} required />
        </div>
        <div style={commonStyles.formGroup}>
          <label style={commonStyles.label}>Expected Price (Lakhs) *</label>
          <input type="number" style={commonStyles.control} value={formData.expectedPriceLakhs} readOnly required />
        </div>
      </div>
      <div style={commonStyles.formGroup}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" checked={formData.inclusiveCharges} onChange={(e) => setFormData({ ...formData, inclusiveCharges: e.target.checked })} /> Inclusive of all charges
        </label>
      </div>
      <div style={commonStyles.row}>
        <div style={commonStyles.formGroup}>
          <label style={commonStyles.label}>Property Priority *</label>
          <select style={commonStyles.control} value={formData.propertyPriority} onChange={(e) => setFormData({ ...formData, propertyPriority: e.target.value })} required>
            <option value="Normal">Normal</option>
            <option value="Featured">Featured</option>
            <option value="Premium">Premium</option>
          </select>
        </div>
        <div style={commonStyles.formGroup}>
          <label style={commonStyles.label}>State *</label>
          <input type="text" style={commonStyles.control} value={formData.state} readOnly required />
        </div>
      </div>
      <div style={commonStyles.row}>
        <div style={commonStyles.formGroup}>
          <label style={commonStyles.label}>District *</label>
          <select style={commonStyles.control} value={formData.district} onChange={(e) => setFormData({ ...formData, District: e.target.value })} required>
            <option value="">Select District</option>
            {districts.map((d, i) => <option key={i} value={d.name || d.district_id}>{d.district_name || d.title || `District ${i + 1}`}</option>)}
          </select>
        </div>
        <div style={commonStyles.formGroup}>
          <label style={commonStyles.label}>City *</label>
          <select style={commonStyles.control} value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required>
            <option value="">Select City</option>
            {cities.map((c, i) => <option key={i} value={c.name || c.city_id}>{c.city_name || c.title || `City ${i + 1}`}</option>)}
          </select>
        </div>
      </div>
      <div style={commonStyles.formGroup}>
        <label style={commonStyles.label}>Property Address *</label>
        <textarea style={commonStyles.control} value={formData.propertyAddress} onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })} required />
      </div>
      <div style={commonStyles.row}>
        <div style={commonStyles.formGroup}>
          <label style={commonStyles.label}>Owner Name *</label>
          <input type="text" style={commonStyles.control}  value={user?.name || ""} onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })} required  readOnly/>
        </div>
        <div style={commonStyles.formGroup}>
          <label style={commonStyles.label}>Contact Number *</label>
          <input type="tel" style={commonStyles.control} value={user?.phone || ""} onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })} required readOnly/>
        </div>
      </div>
      <div style={commonStyles.formGroup}>
        <label style={commonStyles.label}>Property Description *</label>
        <textarea style={commonStyles.control} value={formData.propertyDescription} onChange={(e) => setFormData({ ...formData, propertyDescription: e.target.value })} required />
      </div>
      <div style={commonStyles.formGroup}>
        <label style={commonStyles.label}>Property Age *</label>
        <select style={commonStyles.control} value={formData.propetyage} onChange={(e) => setFormData({ ...formData, propetyage: e.target.value })} required>
          <option value="">Select Property Age</option>
          <option value="new">New</option>
          <option value="old">Resale</option>
        </select>
      </div>
      <div style={commonStyles.formGroup}>
        <label style={commonStyles.label}>Main Property Image *</label>
        <input type="file" accept="image/*" onChange={handleMainImage} style={commonStyles.control} required />
        {mainImagePreview && <img src={mainImagePreview} alt="Main preview" style={{ marginTop: "10px", width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "6px" }} />}
      </div>
      <div style={commonStyles.formGroup}>
        <label style={commonStyles.label}>Additional Images *</label>
        <input type="file" accept="image/*" multiple onChange={handleAdditionalImages} style={commonStyles.control} required />
        <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
          {additionalPreviews.map((src, i) => <img key={i} src={src} alt={`Additional ${i + 1}`} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "4px", border: "1px solid #d1d5db" }} />)}
        </div>
      </div>
      <div style={commonStyles.buttonRow}>
        <button type="button" style={{ ...commonStyles.btn, ...commonStyles.cancelBtn }} onClick={onClose}>Cancel</button>
        <button type="submit" style={{ ...commonStyles.btn, ...commonStyles.saveBtn }}>Save Property</button>
      </div>
    </form>
  );
};

export default PostPropertyModal;
