import { calculateBudget } from './budget.calculator';

describe('calculateBudget', () => {
  it('sums daily costs with one-time expenses', () => {
    const result = calculateBudget({
      destination: 'Japan',
      days: 5,
      travelers: 2,
      accommodationPerDay: 100,
      foodPerDay: 40,
      transportation: 50,
      activities: 80,
      other: 20,
      currency: 'USD',
    });

    expect(result.accommodationTotal).toBe(500);
    expect(result.foodTotal).toBe(200);
    expect(result.total).toBe(850);
    expect(result.perPerson).toBe(425);
    expect(result.perDay).toBe(170);
  });

  it('avoids dividing by zero travelers or days', () => {
    const result = calculateBudget({
      destination: 'Iceland',
      days: 0,
      travelers: 0,
      accommodationPerDay: 90,
      foodPerDay: 30,
      transportation: 10,
      activities: 0,
      other: 0,
      currency: 'EUR',
    });

    expect(result.perPerson).toBe(10);
    expect(result.perDay).toBe(10);
  });
});
