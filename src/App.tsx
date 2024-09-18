import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [loanAmount, setLoanAmount] = useState('100000');
  const [loanDuration, setLoanDuration] = useState('12');
  const [interestRate, setInterestRate] = useState('7.5');
  const [emi, setEmi] = useState<any>(null);
  const [totalInterest, setTotalInterest] = useState<any>(null);
  const [totalAmount, setTotalAmount] = useState<any>(null);
  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const annualInterestRate = parseFloat(interestRate);
    const months = parseInt(loanDuration);
    const monthlyInterestRate = annualInterestRate / (12 * 100);

    // EMI calculation
    const emiAmount = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) /
      (Math.pow(1 + monthlyInterestRate, months) - 1);

    setEmi(emiAmount.toFixed(2));

    // Total interest calculation
    const totalInterestAmount = (emiAmount * months) - principal;
    setTotalInterest(totalInterestAmount.toFixed(2));

    // Total amount (principal + interest)
    const totalAmountPaid = principal + totalInterestAmount;
    setTotalAmount(totalAmountPaid.toFixed(2));
  };

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, loanDuration, interestRate]);



  return (
    <div className='emiCal'>
      <div className='loanCard'>
        <h1 className='m-0'>EMI Calculator</h1>
        <div className='filed'>
          <div className='inputFiled'>
            <label>Loan Amount</label>
            <input
              type="number"
              min={1}
              max={5000000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="Enter loan amount"
            />
          </div>
          <div className='inputFiled'>
            <label>Loan Duration (in months)</label>
            <input
              type="number"
              min={1}
              max={360}
              value={loanDuration}
              onChange={(e) => setLoanDuration(e.target.value)}
              placeholder="Enter loan duration in months"
            />
          </div>
          <div className='inputFiled'  >
            <label>Interest Rate (annual)</label>
            <input
              type="number"
              min={1}
              max={18}
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="Enter annual interest rate"
            />
          </div>

        </div>
        <div className='reslut'>
          <h2 className='m-0'>Monthly EMI </h2>
          <h2 className='m-0'>  ₹{emi ? emi : 'Calculating...'}</h2>
          <p>Principal amount: ₹{loanAmount}</p>
          <p>Total interest: ₹{totalInterest}</p>
          <p>Total amount: ₹{totalAmount}</p>
        </div>
      </div>

      <div className='loanCard'>
        <h1 className='m-0'>EMI Calculator</h1>
        <div className='filed'>
          <div className='inputFiled'>
          <label>Loan Amount: ₹{loanAmount}</label>
            <input
              type="range"
              min="100000"
              max="5000000"
              step="10000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
            />
          </div>
          <div className='inputFiled'>
          <label>Loan Duration (months): {loanDuration}</label>
            <input
              type="range"
              min="6"
              max="360"
              step="6"
              value={loanDuration}
              onChange={(e) => setLoanDuration(e.target.value)}
            />
          </div>
          <div className='inputFiled'  >
          <label>Interest Rate: {interestRate}%</label>
            <input
              type="range"
              min="1"
              max="18"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
            />
          </div>

        </div>
        <div className='reslut'>
          <h2 className='m-0'>Monthly EMI </h2>
          <h2 className='m-0'>  ₹{emi ? emi : 'Calculating...'}</h2>
          <p>Principal amount: ₹{loanAmount}</p>
          <p>Total interest: ₹{totalInterest}</p>
          <p>Total amount: ₹{totalAmount}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
