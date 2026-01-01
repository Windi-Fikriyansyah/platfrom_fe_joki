export type Role = "client" | "freelancer" | "admin";

export type FreelancerProfile = {
  id?: string;
  system_name?: string;
  photo_url?: string;
  bio?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role?: Role;
  freelancer_profile?: FreelancerProfile | null;
};

export type Me = {
  id: string;
  name: string;
  email: string;
  role: Role;
  freelancer_profile?: FreelancerProfile | null;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string;
  created_at: string;
};

export type Conversation = {
  id: string;
  buyer_id: string;
  seller_id: string;
  product_id?: string | null;

  // User objects from backend
  buyer?: User;
  seller?: User;

  last_message?: Message | null;
  unread_count?: number;
  updated_at?: string;
};

export type WSIncoming =
  | { type: "message"; data: Message }
  | { type: "new_message"; message: Message }
  | { type: "ping"; data?: any }
  | { type: "system"; data: any };
