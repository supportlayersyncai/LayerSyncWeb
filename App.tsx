import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/MainLayout';
import { Home } from './pages/Home';
import { RealEstate } from './pages/RealEstate';
import { SMB } from './pages/SMB';
import { WebDev } from './pages/WebDev';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="solutions/real-estate" element={<RealEstate />} />
        <Route path="solutions/smb" element={<SMB />} />
        <Route path="solutions/web-dev" element={<WebDev />} />
      </Route>
    </Routes>
  );
};

export default App;