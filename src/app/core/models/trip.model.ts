export interface TripActivity {
  id: string;
  time: string;
  title: string;
  notes: string;
}

export interface TripDay {
  id: string;
  label: string;
  activities: TripActivity[];
}

export interface Trip {
  id: string;
  name: string;
  destinationCode: string;
  destinationName: string;
  startDate: string;
  endDate: string;
  travelers: number;
  estimatedBudget: number;
  currency: string;
  notes: string;
  days: TripDay[];
  createdAt: string;
  updatedAt: string;
}
