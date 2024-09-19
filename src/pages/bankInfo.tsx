import React, { useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import bankdata from '../json/bankInfo.json';
import { EMIState } from '../type/loan';

type Action = { type: 'UPDATE_EMI'; payload: EMIState };

const emiReducer = (state: EMIState, action: Action): EMIState => {
  switch (action.type) {
    case 'UPDATE_EMI':
      return {
        ...state,
        roundedEMI: action.payload.roundedEMI,
        annualRate: action.payload.annualRate,
      };
    default:
      return state;
  }
};

const BankInfo: React.FC = () => {
  const { id } = useParams();
  const loan = bankdata.loans.find(loan => loan.name.replace(/\s+/g, '_') === id);
  const loanRate = loan?.interest_rate ? Object.entries(loan.interest_rate) : [];
  const [selectedOption, setSelectedOption] = useState<{ value: string; label: string }>({ value: '1', label: '1 years' });
  const initialState: EMIState = { roundedEMI: 0, annualRate: 0 };
  const [emiInfo, dispatch] = useReducer(emiReducer, initialState);

  const handleChange = (option: any) => {
    setSelectedOption(option);
    setValue('tenure', option.value);
  };

  const annualIncome: any = loan?.your_income?.replace(/^\s*RM\s*/, '');
  const monthIncome = () => {
    const cleanedValue = annualIncome?.replace(/,/g, '');
    const value: number = Number(cleanedValue);
    if (isNaN(value)) {
      return 0;
    } else {
      return value / 12;
    }
  };

  const schema = yup.object().shape({
    borrowAmount: yup
      .number()
      .min(10000, 'Minimum borrow amount is 10,000')
      .required('Borrow amount is required'),
    monthlyIncome: yup
      .number()
      .min(monthIncome(), `Minimum monthly income is RM${monthIncome()}`)
      .required('Monthly income is required'),
    tenure: yup
      .string()
      .required('Tenure is required'),
  });

  const { control, trigger, setError, formState: { errors }, watch, setValue, clearErrors } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      tenure: selectedOption.value
    }
  });

  const generateDropdownOptions = (list: any) => {
    let start: any, end: any;
    const monthsMatch = list.match(/(\d+) - (\d+) months/);
    const yearsMatch = list.match(/(\d+) - (\d+) years/);
    if (monthsMatch) {
      start = parseInt(monthsMatch[1], 10);
      end = parseInt(monthsMatch[2], 10);
      start = Math.ceil(start / 12);
      end = Math.ceil(end / 12);
    } else if (yearsMatch) {
      start = parseInt(yearsMatch[1], 10);
      end = parseInt(yearsMatch[2], 10);
    } else {
      return [];
    }
    return Array.from({ length: end - start + 1 }, (_, index) => {
      const value = start + index;
      return { value: `${value}`, label: `${value} year${value > 1 ? 's' : ''}` };
    });
  };

  const getInterestRate = (months: number): string | undefined => {
    const interestRates = loan?.interest_rate;

    if (interestRates) {
      let rate: string = '';

      if (months <= 12) {
        rate = interestRates["12_months"] || '';
      } else if (months <= 24) {
        rate = interestRates["24_months"] || '';
      } else if (months <= 48) {
        rate = interestRates["36_to_48_months"] || '';
      } else if (months <= 84) {
        rate = interestRates["60_to_84_months"] || '';
      } else {
        rate = interestRates["60_to_84_months_high"] || '';
      }

      return rate.replace('% p.a.', '').trim();
    }

    return undefined;
  };


  const principal = watch('borrowAmount');
  const yearlyInco = watch('monthlyIncome');
  const duration = selectedOption?.value;
  const calculateEMI = () => {
    trigger();
    if (principal && duration) {
      if (Object.keys(errors).length === 0) {
        const months = Number(duration) * 12;
        const annualRate = Number(getInterestRate(months));
        if (annualRate) {
          const P = Number(principal); 
          const r = annualRate / (12 * 100)
          const n = months;
          const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
          const roundedEMI = Number(emi.toFixed(2));
          dispatch({
            type: 'UPDATE_EMI',
            payload: { roundedEMI, annualRate }
          });
        }
      }
    }
  };


  useEffect(() => {
    if (principal && yearlyInco && duration)
      calculateEMI();
  }, [principal, yearlyInco, duration]);

  return (
    <div className='bankInfo'>
      <h2 className='title'>{loan?.name}</h2>
      <div className="bankBio">
        <div>
          <h5 className='m-0'>Interest Rate</h5>
          <p> From {loan?.interest_rate_range?.min}</p>
        </div>
        <div>
          <h5 className='m-0'> Financing</h5>
          <p> {loan?.loan_financing_amount}</p>
        </div>
        <div>
          <h5 className='m-0'> Tenure</h5>
          <p>{loan?.loan_financing_period}</p>
        </div>
        <div>
          <h5 className='m-0'> Loan Type</h5>
          <p>{loan?.type}</p>
        </div>
        <div>
          <h5 className='m-0'> Min. Income</h5>
          <p>{monthIncome()}/Month</p>
        </div>
      </div>
      <div className='card calculator'>
        <h3 className='m-0'>Loan calculator</h3>
        <div className='filedSection'>
          <div>
            <div>
              <label>Borrow</label>
              <br />
              <Controller
                name="borrowAmount"
                control={control}
                render={({ field }) => (
                  <label className='cal-input'>
                    RM
                    <input
                      type="number"
                      min={10000}
                      placeholder="10000"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        if (e.target.value) {
                          const value = Number(e.target.value);
                          if (value >= 10000) {
                            clearErrors('borrowAmount');
                          }
                        }
                        else {
                          field.onChange(undefined);
                          trigger('borrowAmount')
                        }
                      }}
                    />
                  </label>
                )}
              />
              {errors.borrowAmount && <p className='error'>{errors.borrowAmount.message}</p>}
            </div>
            <div className='mt-1'>
              <label>My monthly income is</label>
              <br />
              <Controller
                name="monthlyIncome"
                control={control}
                render={({ field }) => (
                  <label className='cal-input'>
                    RM
                    <input
                      type="number"
                      placeholder={monthIncome().toString()}
                      {...field}
                      onChange={(e) => {
                        if (e.target.value) {
                          field.onChange(e.target.value);
                          const value = Number(e.target.value);
                          const amout = monthIncome();
                          console.log(value >= amout, "943")
                          if (value >= amout) {
                            clearErrors('monthlyIncome');
                          }
                        } else { 
                          field.onChange(undefined);
                          trigger('monthlyIncome');
                        }
                      }}
                    />
                  </label>
                )}
              />
              {errors.monthlyIncome && <p className='error'>{errors.monthlyIncome.message}</p>}
            </div></div>
          <div>
            <label>Tenure</label>
            <br />
            <Controller
              name="tenure"
              control={control}
              render={({ field }) => (
                <Select
                  value={selectedOption}
                  className='dropDown'
                  onChange={(option) => {
                    if (option) {
                      handleChange(option);
                      field.onChange(option.value);
                    }
                  }}
                  options={generateDropdownOptions(loan?.loan_financing_period) || []}
                  placeholder="Select an option"
                />
              )}
            />
            {errors.tenure && <p className='error'>{errors.tenure.message}</p>}
          </div>
          <div className='emiValue'>
            {emiInfo?.roundedEMI> 0 && Object.keys(errors).length === 0 ?<>
            <p>Your monthly repayment is:</p>
            <h1 className='m-0'>RM{emiInfo?.roundedEMI}</h1>
            <p>Interest rate is</p>
            <h1 className='m-0'>{emiInfo?.annualRate}% p.a.</h1></>:
            <div className='noCal'>
              <> No Calculation</>
              </div>}
          </div>
        </div>
        <p className='mt-1'>Disclaimer: For illustration purposes only. The final loan amount, monthly repayment, plus the interest rates are subject to the bank's assessment and approval.</p>
      </div>
      <div className='card backInterset mt-1'>
        <h3 className='m-0'>Interest rates</h3>
        <p>Based on your loan amount & loan period, the interest rates are as low as the following</p>
        <table className='table-container'>
          <thead>
            <tr>
              <th>You borrow</th>
              <th>Loan period</th>
              <th>Your Income</th>
              <th>Interest rate</th>
            </tr>
          </thead>
          <tbody>
            {loanRate.map((items, index) => {
              return <tr key={`rate-${index}`}>
                <td>{loan?.loan_financing_amount}</td>
                <td>{items[0].replace(/_/g, ' ')}</td>
                <td>{loan?.your_income}</td>
                <td>{items[1].replace(/_/g, ' ')}</td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
      <div className='card mt-1'>
        <h3 className='m-0'>Fees & Charges</h3>
        <table className='table-container mt-1'>
          <thead>
            <tr>
              <th>Interest Rate / APR</th>
              <th>Processing Fee</th>
              <th>Stamp Duty</th>
              <th>Early Termination Fee</th>
              <th>Late Penalty Fee</th>
            </tr>
          </thead>
          <tbody>
            <tr >
              <td>{loan?.fees_and_charges?.interest_rate_apr}</td>
              <td>{loan?.fees_and_charges?.processing_fee}</td>
              <td>{loan?.fees_and_charges?.stamp_duty}</td>
              <td>{loan?.fees_and_charges?.early_termination_fee}</td>
              <td>{loan?.fees_and_charges?.late_penalty_fee}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='card mt-1 mb-1'>
        <h3 className='m-0'>Requirements</h3>
        <table className='table-container mt-1'>
          <thead>
            <tr>
              <th>Minimum Annual Income</th>
              <th>Minimum Age</th>
              <th>Who can apply</th>
            </tr>
          </thead>
          <tbody>
            <tr >
              <td>{loan?.requirements?.minimum_age}</td>
              <td>{loan?.requirements?.minimum_annual_income}</td>
              <td>{loan?.requirements?.who_can_apply}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BankInfo;

