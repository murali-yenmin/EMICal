export interface InterestRateRange {
  min: string;
  max: string;
}

export interface FeesAndCharges {
  interest_rate_apr: string;
  processing_fee: string;
  stamp_duty: string;
  early_termination_fee: string;
  late_penalty_fee: string;
}
export interface FormValues {
  borrowAmount?: number | null;
  monthlyIncome?: number | null;
  tenure?: string | null;
}
export interface EMIState {
  roundedEMI: number;
  annualRate: number;
}

export interface Requirements {
  minimum_annual_income: string;
  minimum_age: string;
  who_can_apply: string;
}

export interface Loan {
  name: string;
  interest_rate: {
    "12_months"?: string;
    "24_months"?: string;
    "36_to_48_months"?: string;
    "60_to_84_months"?: string;
    "60_to_84_months_high"?: string;
    "36_to_60_months"?: string;
    "24_to_36_months"?: string;
    "48_to_60_months"?: string;
  };
  loan_financing_amount: string;
  loan_financing_period: string;
  your_income: string;
  monthly_repayment: string;
  can_government_glc_apply: string;
  type: string;
  bank: string;
  interest_rate_range?: InterestRateRange;
  fees_and_charges?: FeesAndCharges;
  requirements?: Requirements;
}
