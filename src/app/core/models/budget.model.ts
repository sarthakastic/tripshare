export interface BudgetInput {
  destination: string;
  days: number;
  travelers: number;
  accommodationPerDay: number;
  foodPerDay: number;
  transportation: number;
  activities: number;
  other: number;
  currency: string;
}

export interface BudgetCalculation {
  accommodationTotal: number;
  foodTotal: number;
  transportation: number;
  activities: number;
  other: number;
  total: number;
  perPerson: number;
  perDay: number;
}
