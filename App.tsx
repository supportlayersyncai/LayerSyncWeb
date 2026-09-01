import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/MainLayout';
import { Home } from './pages/Home';
import { SynCRM } from './pages/SynCRM';
import { WhatWeBuild } from './pages/WhatWeBuild';
import { Work } from './pages/Work';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Privacy, Terms } from './pages/Legal';
import { LayerMap } from './pages/LayerMap';
import { RealEstate } from './pages/RealEstate';
import { WebDev } from './pages/WebDev';
import { Academy } from './pages/Academy';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />

        {/* New IA */}
        <Route path="syncrm" element={<SynCRM />} />
        <Route path="what-we-build" element={<WhatWeBuild />} />
        <Route path="work" element={<Work />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />

        {/* Lead magnet — this URL is used in ManyChat campaigns, keep it stable */}
        <Route path="layer-map" element={<LayerMap />} />

        {/* Legal */}
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />

        {/* Standalone real-estate services page (links to SynCRM) */}
        <Route path="solutions/real-estate" element={<RealEstate />} />

        {/* Web Dev keeps its own page (active revenue line) */}
        <Route path="solutions/web-dev" element={<WebDev />} />

        {/* Academy: route stays live, dropped from primary nav */}
        <Route path="solutions/academy" element={<Academy />} />

        {/* SMB + Enterprise folded into What We Build — redirect old routes */}
        <Route path="solutions/smb" element={<Navigate to="/what-we-build" replace />} />
        <Route path="solutions/enterprise" element={<Navigate to="/what-we-build" replace />} />

        {/* Catch-all → home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
