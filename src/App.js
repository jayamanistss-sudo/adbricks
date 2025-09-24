import { Route, Routes } from 'react-router-dom';
import PropertiesPage from './Component/Propertieslist/ViewProperties';
import Home from './Component/Home';
import PropertyDetailsPage from './Component/Propertieslist/ViewDetails';
import HomeLoanSection from './Component/Homeloan';
import InteriorDesignSection from './Component/interiors';
import ProfilePage from './Component/Profile';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/properties" element={<PropertiesPage />} />
      <Route path="/homeloan" element={<HomeLoanSection />} />
      <Route path="/interiors" element={<InteriorDesignSection />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/propertiesDetails/:id" element={<PropertyDetailsPage />} />
    </Routes>
  );
};

export default App;
