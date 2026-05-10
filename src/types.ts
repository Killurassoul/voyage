export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferences: string[];
  lastBooking?: string;
  totalSpent: number;
}

export interface Booking {
  id: string;
  clientId: string;
  title: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  startDate: string;
  endDate: string;
  totalPrice: number;
}

export interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
  updatedAt: number;
}
