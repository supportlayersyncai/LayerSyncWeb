import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/MainLayout';
import { Home } from './pages/Home';
import { RealEstate } from './pages/RealEstate';
import { SMB } from './pages/SMB';
import { WebDev } from './pages/WebDev';
import { Enterprise } from './pages/Enterprise';
import { Academy } from './pages/Academy';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="solutions/real-estate" element={<RealEstate />} />
        <Route path="solutions/smb" element={<SMB />} />
        <Route path="solutions/web-dev" element={<WebDev />} />
        <Route path="solutions/academy" element={<Academy />} />
        <Route path="solutions/enterprise" element={<Enterprise />} />
      </Route>
    </Routes>
  );
};

export default App;