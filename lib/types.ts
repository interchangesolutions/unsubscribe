export interface Subscription {
  id: string;
  name: string;
  email: string;
  frequency: number; // emails per month
  lastOpened: number; // days since last opened
  category?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}