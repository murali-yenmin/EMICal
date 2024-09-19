// src/Router.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Home from '../pages/home';
import BankInfo from '../pages/bankInfo';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/personal-loan/:id" element={<BankInfo />} /> 
      </Routes>
    </Router>
  );
};

export default AppRouter;
