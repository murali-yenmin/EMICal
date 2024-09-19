// src/pages/Home.tsx
import React, { useEffect } from 'react';
import bankdata from '../json/bankInfo.json';  
import LoanTable from './loanTable';
import { Loan } from '../type/loan';

const Home: React.FC = () => {
    const loanData: Loan[] = (bankdata as { loans: Loan[] }).loans; 

  return (
    <div className='bankTable'>
      <h2>Best Personal Loans In Malaysia 2024</h2>
      <p>Do you need a quick loan comparison from various banks and licensed financial lenders? We've compiled a list below for your easy reference.</p>
      <LoanTable data={loanData} />
    </div>
  );
};

export default Home;
