export interface User {
  id: string;
  name: string;
  nameAr?: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'admin' | 'provider' | 'user';
  isVerified: boolean;
  createdAt: string;
  nationality?: string;
  nationalityAr?: string;
  age?: number;
}

export interface ServiceProvider extends User {
  role: 'provider';
  services: string[];
  workingArea: Array<{ en: string; ar: string }>;
  experience: number;
  rating: {
    overall: number;
    cost: number;
    speed: number;
    punctuality: number;
    reviewCount: number;
  };
  workingHours: {
    [key: string]: { start: string; end: string; available: boolean };
  };
  unavailableDates: string[];
  isApproved: boolean;
  description: string;
  descriptionAr: string;
}

export interface Service {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  icon: string;
  isApproved: boolean;
  requestedBy?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isReported?: boolean;
}

export interface ChatRoom {
  id: string;
  participants: [string, string];
  lastMessage?: ChatMessage;
  unreadCount: number;
}

export interface Booking {
  id: string;
  userId: string;
  providerId: string;
  serviceId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  providerId: string;
  bookingId: string;
  ratings: {
    cost: number;
    speed: number;
    punctuality: number;
  };
  comment?: string;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reportedUserType: 'user' | 'provider';
  type: 'inappropriate_behavior' | 'service_quality' | 'payment_dispute' | 'spam_fake_reviews' | 'safety_concern' | 'pricing_fraud' | 'other';
  category: 'conduct' | 'service' | 'payment' | 'platform_abuse' | 'safety' | 'fraud' | 'other';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high';
  evidence?: {
    screenshots?: string[];
    photos?: string[];
    chatMessages?: string[];
    bookingId?: string;
    reviewIds?: string[];
    suspiciousAccounts?: string[];
    priceComparisons?: string[];
    customerTestimonies?: string[];
    contract?: string;
    witnessStatement?: string;
  };
  adminNotes: string;
  resolution: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  resolvedBy: string | null;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'booking' | 'review' | 'approval';
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
}

export interface Language {
  code: 'en' | 'ar';
  name: string;
  isRTL: boolean;
}