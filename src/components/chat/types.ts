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

export type JobOfferStatus =
  | "pending"
  | "paid"
  | "working"
  | "delivered"
  | "completed"
  | "cancelled";

export type ProductMini = {
  id: number;
  title: string;
  cover_url?: string;
};

export type JobOffer = {
  id: string;
  order_code: string;
  conversation_id: string;
  freelancer_id: string;
  client_id: string;
  product_id?: number;

  price: number;
  platform_fee: number;
  net_amount: number;

  title: string;
  description: string;
  revision_count: number;

  start_date: string;
  delivery_date: string;
  delivery_format: string;
  notes: string;

  status: JobOfferStatus;
  work_delivery_link?: string;
  work_delivery_files?: string;
  used_revision_count: number;
  created_at: string;

  product?: ProductMini;
  freelancer?: User;
  client?: User;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  type?: "text" | "offer" | "system" | "delivery" | "revision" | "file";
  text: string;
  created_at: string;
  file_url?: string;
  file_name?: string;

  // For offer messages (text starts with [OFFER])
  offer_id?: string;
  offer?: JobOffer;
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
  latest_offer_status?: string;
};

export type WSIncoming =
  | { type: "message"; data: Message }
  | { type: "new_message"; message: Message; offer?: JobOffer }
  | { type: "offer_status_update"; offer: JobOffer }
  | { type: "ping"; data?: any }
  | { type: "system"; data: any };

export type ProductListItem = {
  id: string; // encrypted ID
  real_id: number;
  title: string;
  category: string;
  base_price: number;
  status: string;
  created_at: string;
};
