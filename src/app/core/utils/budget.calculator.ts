import { BudgetCalculation, BudgetInput } from '../models/budget.model';

export function calculateBudget(input: BudgetInput): BudgetCalculation {
  const days = Math.max(0, input.days);
  const travelers = Math.max(1, input.travelers);
  const accommodationTotal = days * input.accommodationPerDay;
  const foodTotal = days * input.foodPerDay;
  const transportation = Math.max(0, input.transportation);
  const activities = Math.max(0, input.activities);
  const other = Math.max(0, input.other);
  const total = accommodationTotal + foodTotal + transportation + activities + other;
  const perPerson = total / travelers;
  const perDay = days > 0 ? total / days : total;

  return {
    accommodationTotal,
    foodTotal,
    transportation,
    activities,
    other,
    total,
    perPerson,
    perDay,
  };
}
