import { User, ServiceProvider, Service, ChatMessage, ChatRoom, Booking, Review, Notification, Report } from '../types';

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    role: 'user',
    isVerified: true,
    createdAt: '2024-01-15T08:00:00Z',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+1234567891',
    role: 'admin',
    isVerified: true,
    createdAt: '2024-01-01T08:00:00Z',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200'
  }
];

const mockProviders: ServiceProvider[] = [
  {
    id: '3',
    name: 'Ahmed Al-Rashid',
    nameAr: 'أحمد الراشد',
    email: 'ahmed@example.com',
    phone: '+966501234567',
    role: 'provider',
    isVerified: true,
    createdAt: '2024-01-10T08:00:00Z',
    nationality: 'Saudi',
    nationalityAr: 'سعودي',
    age: 35,
    services: ['1', '2', '5'], // Plumbing, AC Repair, Electrical
    workingArea: [
      { en: 'Riyadh', ar: 'الرياض' },
      { en: 'Al-Khobar', ar: 'الخبر' }
    ],
    experience: 8,
    rating: {
      overall: 4.8,
      cost: 4.7,
      speed: 4.9,
      punctuality: 4.8,
      reviewCount: 156
    },
    workingHours: {
      monday: { start: '08:00', end: '17:00', available: true },
      tuesday: { start: '08:00', end: '17:00', available: true },
      wednesday: { start: '08:00', end: '17:00', available: true },
      thursday: { start: '08:00', end: '17:00', available: true },
      friday: { start: '14:00', end: '18:00', available: true },
      saturday: { start: '08:00', end: '17:00', available: true },
      sunday: { start: '08:00', end: '17:00', available: false }
    },
    unavailableDates: ['2024-12-25', '2024-12-26'],
    isApproved: true,
    description: 'Professional plumber and electrician with 8 years of experience in residential and commercial services. Specialized in emergency repairs and installations.',
    descriptionAr: 'سباك وكهربائي محترف مع 8 سنوات من الخبرة في الخدمات السكنية والتجارية. متخصص في الإصلاحات الطارئة والتركيبات.',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    nameAr: 'سارة جونسون',
    email: 'sarah@example.com',
    phone: '+1234567892',
    role: 'provider',
    isVerified: true,
    createdAt: '2024-01-12T08:00:00Z',
    nationality: 'American',
    nationalityAr: 'أمريكية',
    age: 29,
    services: ['6', '7'], // House Cleaning, Gardening
    workingArea: [
      { en: 'New York', ar: 'نيويورك' },
      { en: 'Brooklyn', ar: 'بروكلين' }
    ],
    experience: 5,
    rating: {
      overall: 4.6,
      cost: 4.5,
      speed: 4.7,
      punctuality: 4.6,
      reviewCount: 89
    },
    workingHours: {
      monday: { start: '09:00', end: '16:00', available: true },
      tuesday: { start: '09:00', end: '16:00', available: true },
      wednesday: { start: '09:00', end: '16:00', available: true },
      thursday: { start: '09:00', end: '16:00', available: true },
      friday: { start: '09:00', end: '16:00', available: true },
      saturday: { start: '10:00', end: '14:00', available: true },
      sunday: { start: '10:00', end: '14:00', available: false }
    },
    unavailableDates: ['2024-12-31'],
    isApproved: true,
    description: 'Professional cleaning and gardening services with attention to detail and eco-friendly practices.',
    descriptionAr: 'خدمات تنظيف وبستنة احترافية مع الاهتمام بالتفاصيل والممارسات الصديقة للبيئة.',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    id: '5',
    name: 'Mohammed Hassan',
    nameAr: 'محمد حسن',
    email: 'mohammed@example.com',
    phone: '+966502345678',
    role: 'provider',
    isVerified: true,
    createdAt: '2024-01-08T08:00:00Z',
    nationality: 'Egyptian',
    nationalityAr: 'مصري',
    age: 42,
    services: ['3', '4'], // Water Delivery, Sewer Cleaning
    workingArea: [
      { en: 'Dubai', ar: 'دبي' },
      { en: 'Abu Dhabi', ar: 'أبو ظبي' }
    ],
    experience: 12,
    rating: {
      overall: 4.9,
      cost: 4.8,
      speed: 5.0,
      punctuality: 4.9,
      reviewCount: 203
    },
    workingHours: {
      monday: { start: '07:00', end: '19:00', available: true },
      tuesday: { start: '07:00', end: '19:00', available: true },
      wednesday: { start: '07:00', end: '19:00', available: true },
      thursday: { start: '07:00', end: '19:00', available: true },
      friday: { start: '07:00', end: '19:00', available: true },
      saturday: { start: '08:00', end: '16:00', available: true },
      sunday: { start: '08:00', end: '16:00', available: false }
    },
    unavailableDates: [],
    isApproved: true,
    description: 'Reliable water delivery and sewer cleaning services available 24/7 for emergency situations.',
    descriptionAr: 'خدمات توصيل المياه وتنظيف المجاري موثوقة ومتاحة على مدار الساعة للحالات الطارئة.',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    id: '6',
    name: 'Lisa Chen',
    nameAr: 'ليزا تشين',
    email: 'lisa@example.com',
    phone: '+1234567893',
    role: 'provider',
    isVerified: true,
    createdAt: '2024-01-14T08:00:00Z',
    nationality: 'Chinese',
    nationalityAr: 'صينية',
    age: 31,
    services: ['8', '6'], // Painting, House Cleaning
    workingArea: [
      { en: 'Los Angeles', ar: 'لوس أنجلوس' },
      { en: 'Beverly Hills', ar: 'بيفرلي هيلز' }
    ],
    experience: 7,
    rating: {
      overall: 4.7,
      cost: 4.6,
      speed: 4.8,
      punctuality: 4.7,
      reviewCount: 124
    },
    workingHours: {
      monday: { start: '08:00', end: '17:00', available: true },
      tuesday: { start: '08:00', end: '17:00', available: true },
      wednesday: { start: '08:00', end: '17:00', available: true },
      thursday: { start: '08:00', end: '17:00', available: true },
      friday: { start: '08:00', end: '17:00', available: true },
      saturday: { start: '09:00', end: '15:00', available: true },
      sunday: { start: '09:00', end: '15:00', available: false }
    },
    unavailableDates: ['2024-12-24', '2024-12-25'],
    isApproved: true,
    description: 'Professional painter and cleaner specializing in residential and commercial properties with premium finishes.',
    descriptionAr: 'رسام ومنظف محترف متخصص في العقارات السكنية والتجارية مع التشطيبات المتميزة.',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    id: '7',
    name: 'Carlos Rodriguez',
    nameAr: 'كارلوس رودريغيز',
    email: 'carlos@example.com',
    phone: '+1234567894',
    role: 'provider',
    isVerified: true,
    createdAt: '2024-01-16T08:00:00Z',
    nationality: 'Mexican',
    nationalityAr: 'مكسيكي',
    age: 38,
    services: ['1', '5', '8'], // Plumbing, Electrical, Painting
    workingArea: [
      { en: 'Miami', ar: 'ميامي' },
      { en: 'Fort Lauderdale', ar: 'فورت لودرديل' }
    ],
    experience: 15,
    rating: {
      overall: 4.9,
      cost: 4.9,
      speed: 4.8,
      punctuality: 5.0,
      reviewCount: 287
    },
    workingHours: {
      monday: { start: '07:00', end: '18:00', available: true },
      tuesday: { start: '07:00', end: '18:00', available: true },
      wednesday: { start: '07:00', end: '18:00', available: true },
      thursday: { start: '07:00', end: '18:00', available: true },
      friday: { start: '07:00', end: '18:00', available: true },
      saturday: { start: '08:00', end: '16:00', available: true },
      sunday: { start: '08:00', end: '16:00', available: false }
    },
    unavailableDates: [],
    isApproved: true,
    description: 'Multi-skilled craftsman with 15 years of experience in plumbing, electrical work, and painting. Licensed and insured.',
    descriptionAr: 'حرفي متعدد المهارات مع 15 عامًا من الخبرة في السباكة والأعمال الكهربائية والدهان. مرخص ومؤمن عليه.',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    id: '8',
    name: 'Fatima Al-Zahra',
    nameAr: 'فاطمة الزهراء',
    email: 'fatima@example.com',
    phone: '+966503456789',
    role: 'provider',
    isVerified: true,
    createdAt: '2024-01-18T08:00:00Z',
    nationality: 'Jordanian',
    nationalityAr: 'أردنية',
    age: 27,
    services: ['6', '7'], // House Cleaning, Gardening
    workingArea: [
      { en: 'Amman', ar: 'عمان' },
      { en: 'Zarqa', ar: 'الزرقاء' }
    ],
    experience: 4,
    rating: {
      overall: 4.5,
      cost: 4.4,
      speed: 4.6,
      punctuality: 4.5,
      reviewCount: 67
    },
    workingHours: {
      monday: { start: '09:00', end: '16:00', available: true },
      tuesday: { start: '09:00', end: '16:00', available: true },
      wednesday: { start: '09:00', end: '16:00', available: true },
      thursday: { start: '09:00', end: '16:00', available: true },
      friday: { start: '09:00', end: '16:00', available: false },
      saturday: { start: '10:00', end: '15:00', available: true },
      sunday: { start: '10:00', end: '15:00', available: true }
    },
    unavailableDates: ['2024-12-30', '2024-12-31'],
    isApproved: true,
    description: 'Dedicated cleaning and gardening professional with a focus on creating beautiful, healthy living spaces.',
    descriptionAr: 'محترفة تنظيف وبستنة مخصصة مع التركيز على إنشاء مساحات معيشة جميلة وصحية.',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200'
  }
];

const mockServices: Service[] = [
  { 
    id: '1', 
    name: 'Plumbing', 
    nameAr: 'السباكة', 
    category: 'Home Maintenance', 
    categoryAr: 'صيانة المنزل', 
    icon: 'Wrench', 
    isApproved: true 
  },
  { 
    id: '2', 
    name: 'AC Repair', 
    nameAr: 'إصلاح المكيفات', 
    category: 'Home Maintenance', 
    categoryAr: 'صيانة المنزل', 
    icon: 'Wind', 
    isApproved: true 
  },
  { 
    id: '3', 
    name: 'Water Delivery', 
    nameAr: 'توصيل المياه', 
    category: 'Delivery', 
    categoryAr: 'التوصيل', 
    icon: 'Truck', 
    isApproved: true 
  },
  { 
    id: '4', 
    name: 'Sewer Cleaning', 
    nameAr: 'تنظيف المجاري', 
    category: 'Cleaning', 
    categoryAr: 'التنظيف', 
    icon: 'Droplets', 
    isApproved: true 
  },
  { 
    id: '5', 
    name: 'Electrical', 
    nameAr: 'الكهرباء', 
    category: 'Home Maintenance', 
    categoryAr: 'صيانة المنزل', 
    icon: 'Zap', 
    isApproved: true 
  },
  { 
    id: '6', 
    name: 'House Cleaning', 
    nameAr: 'تنظيف المنازل', 
    category: 'Cleaning', 
    categoryAr: 'التنظيف', 
    icon: 'Sparkles', 
    isApproved: true 
  },
  { 
    id: '7', 
    name: 'Gardening', 
    nameAr: 'البستنة', 
    category: 'Outdoor', 
    categoryAr: 'خارجي', 
    icon: 'Flower', 
    isApproved: true 
  },
  { 
    id: '8', 
    name: 'Painting', 
    nameAr: 'الدهان', 
    category: 'Home Improvement', 
    categoryAr: 'تحسين المنزل', 
    icon: 'Palette', 
    isApproved: true 
  }
];

const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    senderId: '1',
    receiverId: '3',
    message: 'Hello, I need help with a plumbing issue.',
    timestamp: '2024-01-20T10:30:00Z',
    isRead: true
  },
  {
    id: '2',
    senderId: '3',
    receiverId: '1',
    message: 'Hello! I\'d be happy to help. What kind of plumbing issue are you facing?',
    timestamp: '2024-01-20T10:35:00Z',
    isRead: true
  }
];

const mockBookings: Booking[] = [
  {
    id: '1',
    userId: '1',
    providerId: '3',
    serviceId: '1',
    date: '2024-01-25',
    time: '10:00',
    status: 'confirmed',
    notes: 'Kitchen sink is blocked',
    createdAt: '2024-01-20T10:00:00Z'
  }
];

const mockReviews: Review[] = [
  {
    id: '1',
    userId: '1',
    providerId: '3',
    bookingId: '1',
    ratings: {
      cost: 5,
      speed: 4,
      punctuality: 5
    },
    comment: 'Excellent service! Very professional and punctual.',
    createdAt: '2024-01-25T15:00:00Z'
  }
];

// Mock reports data
const mockReports: Report[] = [
  {
    id: 'report-1',
    reporterId: '1', // John Doe
    reportedUserId: '7', // Carlos Rodriguez
    reportedUserType: 'provider',
    type: 'inappropriate_behavior',
    category: 'conduct',
    title: 'Unprofessional Behavior',
    titleAr: 'سلوك غير مهني',
    description: 'The provider was rude and unprofessional during our interaction. He used inappropriate language and was disrespectful when I asked questions about the service.',
    descriptionAr: 'كان مقدم الخدمة وقحًا وغير مهني أثناء تفاعلنا. استخدم لغة غير لائقة وكان غير محترم عندما طرحت أسئلة حول الخدمة.',
    status: 'pending',
    priority: 'high',
    evidence: {
      screenshots: ['screenshot1.jpg', 'screenshot2.jpg'],
      chatMessages: ['msg-1', 'msg-2'],
      bookingId: '1'
    },
    adminNotes: '',
    resolution: '',
    createdAt: '2024-01-21T11:45:00Z',
    updatedAt: '2024-01-21T11:45:00Z',
    resolvedAt: null,
    resolvedBy: null
  },
  {
    id: 'report-2',
    reporterId: '4', // Sarah Johnson
    reportedUserId: '5', // Mohammed Hassan
    reportedUserType: 'provider',
    type: 'service_quality',
    category: 'service',
    title: 'Poor Service Quality',
    titleAr: 'جودة خدمة ضعيفة',
    description: 'The water delivery service was extremely poor. The water containers were dirty and the delivery was 3 hours late without any notification.',
    descriptionAr: 'كانت خدمة توصيل المياه ضعيفة للغاية. كانت حاويات المياه متسخة والتسليم تأخر 3 ساعات دون أي إشعار.',
    status: 'investigating',
    priority: 'medium',
    evidence: {
      photos: ['dirty_container1.jpg', 'dirty_container2.jpg'],
      bookingId: '2'
    },
    adminNotes: 'Contacted provider for explanation. Awaiting response.',
    resolution: '',
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-21T09:15:00Z',
    resolvedAt: null,
    resolvedBy: null
  },
  {
    id: 'report-3',
    reporterId: '6', // Lisa Chen
    reportedUserId: '1', // John Doe
    reportedUserType: 'user',
    type: 'payment_dispute',
    category: 'payment',
    title: 'Payment Dispute',
    titleAr: 'نزاع دفع',
    description: 'Customer is refusing to pay for completed painting service. Claims work was not satisfactory despite completion according to agreed specifications.',
    descriptionAr: 'العميل يرفض الدفع مقابل خدمة الدهان المكتملة. يدعي أن العمل لم يكن مرضيًا رغم الإنجاز وفقًا للمواصفات المتفق عليها.',
    status: 'resolved',
    priority: 'medium',
    evidence: {
      photos: ['completed_work1.jpg', 'completed_work2.jpg'],
      contract: 'painting_contract.pdf',
      bookingId: '3'
    },
    adminNotes: 'Reviewed evidence and contract. Work was completed as agreed.',
    resolution: 'Payment was processed through platform guarantee. Customer was educated about service standards.',
    createdAt: '2024-01-18T16:20:00Z',
    updatedAt: '2024-01-19T10:30:00Z',
    resolvedAt: '2024-01-19T10:30:00Z',
    resolvedBy: '2'
  },
  {
    id: 'report-4',
    reporterId: '3', // Ahmed Al-Rashid
    reportedUserId: '8', // Fatima Al-Zahra
    reportedUserType: 'provider',
    type: 'spam_fake_reviews',
    category: 'platform_abuse',
    title: 'Fake Reviews',
    titleAr: 'مراجعات مزيفة',
    description: 'This provider is posting fake positive reviews on their profile using multiple fake accounts to boost their rating unfairly.',
    descriptionAr: 'يقوم مقدم الخدمة هذا بنشر مراجعات إيجابية مزيفة على ملفه الشخصي باستخدام حسابات مزيفة متعددة لرفع تقييمه بشكل غير عادل.',
    status: 'investigating',
    priority: 'high',
    evidence: {
      suspiciousAccounts: ['fake-user-1', 'fake-user-2', 'fake-user-3'],
      reviewIds: ['review-fake-1', 'review-fake-2']
    },
    adminNotes: 'Analyzing review patterns and account creation dates. Suspicious activity detected.',
    resolution: '',
    createdAt: '2024-01-19T13:15:00Z',
    updatedAt: '2024-01-21T08:45:00Z',
    resolvedAt: null,
    resolvedBy: null
  },
  {
    id: 'report-5',
    reporterId: '1', // John Doe
    reportedUserId: '4', // Sarah Johnson
    reportedUserType: 'provider',
    type: 'safety_concern',
    category: 'safety',
    title: 'Safety Violation',
    titleAr: 'انتهاك السلامة',
    description: 'Provider did not follow basic safety protocols during house cleaning. Used harsh chemicals without proper ventilation and did not wear protective equipment.',
    descriptionAr: 'لم يتبع مقدم الخدمة بروتوكولات السلامة الأساسية أثناء تنظيف المنزل. استخدم مواد كيميائية قاسية دون تهوية مناسبة ولم يرتد معدات الحماية.',
    status: 'resolved',
    priority: 'high',
    evidence: {
      photos: ['safety_violation1.jpg'],
      witnessStatement: 'witness_statement.pdf'
    },
    adminNotes: 'Provider was contacted and provided safety training. Warning issued.',
    resolution: 'Provider completed mandatory safety training course. Profile updated with safety certification requirement.',
    createdAt: '2024-01-17T09:30:00Z',
    updatedAt: '2024-01-18T14:20:00Z',
    resolvedAt: '2024-01-18T14:20:00Z',
    resolvedBy: '2'
  },
  {
    id: 'report-6',
    reporterId: '5', // Mohammed Hassan
    reportedUserId: '6', // Lisa Chen
    reportedUserType: 'provider',
    type: 'pricing_fraud',
    category: 'fraud',
    title: 'Price Manipulation',
    titleAr: 'تلاعب في الأسعار',
    description: 'Provider is charging different prices to different customers for the same service without justification. Discriminatory pricing practices.',
    descriptionAr: 'يفرض مقدم الخدمة أسعارًا مختلفة على عملاء مختلفين لنفس الخدمة دون مبرر. ممارسات تسعير تمييزية.',
    status: 'pending',
    priority: 'medium',
    evidence: {
      priceComparisons: ['price_evidence1.pdf', 'price_evidence2.pdf'],
      customerTestimonies: ['testimony1.pdf', 'testimony2.pdf']
    },
    adminNotes: '',
    resolution: '',
    createdAt: '2024-01-21T15:45:00Z',
    updatedAt: '2024-01-21T15:45:00Z',
    resolvedAt: null,
    resolvedBy: null
  }
];

// Enhanced notifications with admin-specific content
const mockNotifications: Notification[] = [
  // Regular user notifications
  {
    id: '1',
    userId: '1',
    type: 'message',
    title: 'New Message',
    titleAr: 'رسالة جديدة',
    message: 'You have a new message from Ahmed Al-Rashid about your plumbing service request',
    messageAr: 'لديك رسالة جديدة من أحمد الراشد حول طلب خدمة السباكة الخاص بك',
    isRead: false,
    createdAt: '2024-01-20T14:30:00Z',
    data: { providerId: '3', chatRoomId: '1-3' }
  },
  {
    id: '2',
    userId: '1',
    type: 'booking',
    title: 'Booking Confirmed',
    titleAr: 'تم تأكيد الحجز',
    message: 'Your plumbing service booking with Ahmed Al-Rashid has been confirmed for January 25th at 10:00 AM',
    messageAr: 'تم تأكيد حجز خدمة السباكة الخاصة بك مع أحمد الراشد لتاريخ 25 يناير في الساعة 10:00 صباحًا',
    isRead: false,
    createdAt: '2024-01-20T12:15:00Z',
    data: { bookingId: '1', providerId: '3' }
  },
  {
    id: '3',
    userId: '3',
    type: 'review',
    title: 'New Review Received',
    titleAr: 'تم استلام مراجعة جديدة',
    message: 'John Doe left you a 5-star review for your plumbing service. Great job!',
    messageAr: 'ترك لك جون دو مراجعة 5 نجوم لخدمة السباكة الخاصة بك. عمل رائع!',
    isRead: true,
    createdAt: '2024-01-19T16:45:00Z',
    data: { reviewId: '1', userId: '1' }
  },
  {
    id: '4',
    userId: '4',
    type: 'approval',
    title: 'Profile Approved',
    titleAr: 'تمت الموافقة على الملف الشخصي',
    message: 'Congratulations! Your service provider profile has been approved and is now live',
    messageAr: 'تهانينا! تمت الموافقة على ملف مقدم الخدمة الخاص بك وهو الآن متاح',
    isRead: true,
    createdAt: '2024-01-18T09:20:00Z',
    data: { profileId: '4' }
  },
  {
    id: '5',
    userId: '1',
    type: 'booking',
    title: 'Service Completed',
    titleAr: 'تم إكمال الخدمة',
    message: 'Your plumbing service has been marked as completed. Please leave a review for Ahmed Al-Rashid',
    messageAr: 'تم تحديد خدمة السباكة الخاصة بك كمكتملة. يرجى ترك مراجعة لأحمد الراشد',
    isRead: true,
    createdAt: '2024-01-17T11:30:00Z',
    data: { bookingId: '1', providerId: '3' }
  },
  {
    id: '6',
    userId: '3',
    type: 'booking',
    title: 'New Booking Request',
    titleAr: 'طلب حجز جديد',
    message: 'You have a new booking request from Sarah Johnson for house cleaning service',
    messageAr: 'لديك طلب حجز جديد من سارة جونسون لخدمة تنظيف المنزل',
    isRead: false,
    createdAt: '2024-01-21T09:15:00Z',
    data: { bookingId: '2', userId: '4' }
  },
  {
    id: '7',
    userId: '1',
    type: 'message',
    title: 'Provider Response',
    titleAr: 'رد مقدم الخدمة',
    message: 'Mohammed Hassan responded to your water delivery inquiry',
    messageAr: 'رد محمد حسن على استفسارك حول توصيل المياه',
    isRead: false,
    createdAt: '2024-01-21T08:45:00Z',
    data: { providerId: '5', chatRoomId: '1-5' }
  },

  // Admin-specific notifications
  {
    id: '8',
    userId: '2', // Admin user
    type: 'approval',
    title: 'New Provider Registration',
    titleAr: 'تسجيل مقدم خدمة جديد',
    message: 'A new service provider "Michael Thompson" has registered and is pending approval. Please review their profile and documentation.',
    messageAr: 'قام مقدم خدمة جديد "مايكل تومسون" بالتسجيل وهو في انتظار الموافقة. يرجى مراجعة ملفه الشخصي والوثائق.',
    isRead: false,
    createdAt: '2024-01-21T15:30:00Z',
    data: { providerId: 'pending-1', action: 'review_provider' }
  },
  {
    id: '9',
    userId: '2', // Admin user
    type: 'approval',
    title: 'Service Request Submitted',
    titleAr: 'تم تقديم طلب خدمة',
    message: 'A new service "Pool Maintenance" has been requested by provider Lisa Chen. Review and approve if appropriate.',
    messageAr: 'تم طلب خدمة جديدة "صيانة المسابح" من قبل مقدم الخدمة ليزا تشين. راجع ووافق إذا كان مناسباً.',
    isRead: false,
    createdAt: '2024-01-21T14:20:00Z',
    data: { serviceId: 'pending-service-1', providerId: '6', action: 'review_service' }
  },
  {
    id: '10',
    userId: '2', // Admin user
    type: 'message',
    title: 'System Alert',
    titleAr: 'تنبيه النظام',
    message: 'High volume of user registrations detected today (47 new users). System performance is optimal.',
    messageAr: 'تم اكتشاف حجم كبير من تسجيلات المستخدمين اليوم (47 مستخدم جديد). أداء النظام مثالي.',
    isRead: true,
    createdAt: '2024-01-21T13:00:00Z',
    data: { type: 'system_alert', metric: 'user_registrations', count: 47 }
  },
  {
    id: '11',
    userId: '2', // Admin user
    type: 'review',
    title: 'Reported Content',
    titleAr: 'محتوى مبلغ عنه',
    message: 'A user has reported inappropriate behavior from provider "Carlos Rodriguez". Please investigate and take appropriate action.',
    messageAr: 'أبلغ مستخدم عن سلوك غير لائق من مقدم الخدمة "كارلوس رودريغيز". يرجى التحقيق واتخاذ الإجراء المناسب.',
    isRead: false,
    createdAt: '2024-01-21T11:45:00Z',
    data: { providerId: '7', reportId: 'report-1', reportType: 'behavior', action: 'investigate' }
  },
  {
    id: '12',
    userId: '2', // Admin user
    type: 'booking',
    title: 'Payment Issue Alert',
    titleAr: 'تنبيه مشكلة دفع',
    message: 'Multiple payment failures detected for booking #1234. Customer support intervention may be required.',
    messageAr: 'تم اكتشاف فشل متعدد في الدفع للحجز #1234. قد تكون هناك حاجة لتدخل دعم العملاء.',
    isRead: false,
    createdAt: '2024-01-21T10:30:00Z',
    data: { bookingId: '1234', userId: '1', issue: 'payment_failure', action: 'support_needed' }
  },
  {
    id: '13',
    userId: '2', // Admin user
    type: 'approval',
    title: 'Provider Verification Required',
    titleAr: 'مطلوب التحقق من مقدم الخدمة',
    message: 'Provider "Ahmed Al-Rashid" has uploaded new certification documents. Please verify and update their profile status.',
    messageAr: 'قام مقدم الخدمة "أحمد الراشد" بتحميل وثائق شهادة جديدة. يرجى التحقق وتحديث حالة ملفه الشخصي.',
    isRead: true,
    createdAt: '2024-01-20T16:20:00Z',
    data: { providerId: '3', documentType: 'certification', action: 'verify_documents' }
  },
  {
    id: '14',
    userId: '2', // Admin user
    type: 'message',
    title: 'Weekly Report Ready',
    titleAr: 'التقرير الأسبوعي جاهز',
    message: 'Your weekly platform analytics report is ready for review. 156 new bookings, 23 new providers, 4.7 average rating.',
    messageAr: 'تقرير تحليلات المنصة الأسبوعي جاهز للمراجعة. 156 حجز جديد، 23 مقدم خدمة جديد، متوسط تقييم 4.7.',
    isRead: true,
    createdAt: '2024-01-20T09:00:00Z',
    data: { reportType: 'weekly', bookings: 156, providers: 23, avgRating: 4.7, action: 'view_report' }
  },
  {
    id: '15',
    userId: '2', // Admin user
    type: 'approval',
    title: 'Bulk Service Update',
    titleAr: 'تحديث الخدمات بالجملة',
    message: 'Provider "Mohammed Hassan" has requested to add 3 new services to their profile. Bulk approval may be efficient.',
    messageAr: 'طلب مقدم الخدمة "محمد حسن" إضافة 3 خدمات جديدة إلى ملفه الشخصي. قد تكون الموافقة بالجملة فعالة.',
    isRead: false,
    createdAt: '2024-01-19T14:15:00Z',
    data: { providerId: '5', serviceCount: 3, services: ['pool-cleaning', 'carpet-cleaning', 'window-cleaning'], action: 'bulk_approve' }
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authAPI = {
  async login(email: string, password: string): Promise<User> {
    await delay(1000);
    const user = [...mockUsers, ...mockProviders].find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return user;
  },

  async register(userData: Partial<User>): Promise<User> {
    await delay(1000);
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      role: userData.role || 'user',
      isVerified: false,
      createdAt: new Date().toISOString(),
      ...userData
    };
    
    if (userData.role === 'provider') {
      const provider: ServiceProvider = {
        ...newUser,
        role: 'provider',
        nameAr: newUser.name,
        nationalityAr: '',
        services: [],
        workingArea: [],
        experience: 0,
        rating: {
          overall: 0,
          cost: 0,
          speed: 0,
          punctuality: 0,
          reviewCount: 0
        },
        workingHours: {
          monday: { start: '09:00', end: '17:00', available: true },
          tuesday: { start: '09:00', end: '17:00', available: true },
          wednesday: { start: '09:00', end: '17:00', available: true },
          thursday: { start: '09:00', end: '17:00', available: true },
          friday: { start: '09:00', end: '17:00', available: true },
          saturday: { start: '09:00', end: '17:00', available: false },
          sunday: { start: '09:00', end: '17:00', available: false }
        },
        unavailableDates: [],
        isApproved: false,
        description: '',
        descriptionAr: ''
      };
      mockProviders.push(provider);
      return provider;
    }
    
    mockUsers.push(newUser);
    return newUser;
  }
};

export const serviceAPI = {
  async getServices(): Promise<Service[]> {
    await delay(500);
    return mockServices;
  },

  async addService(service: Omit<Service, 'id'>): Promise<Service> {
    await delay(500);
    const newService: Service = {
      ...service,
      id: Math.random().toString(36).substr(2, 9)
    };
    mockServices.push(newService);
    return newService;
  }
};

export const providerAPI = {
  async getProviders(filters?: any): Promise<ServiceProvider[]> {
    await delay(500);
    return mockProviders.filter(p => p.isApproved);
  },

  async getProvider(id: string): Promise<ServiceProvider | null> {
    await delay(500);
    return mockProviders.find(p => p.id === id) || null;
  },

  async updateProvider(id: string, data: Partial<ServiceProvider>): Promise<ServiceProvider> {
    await delay(500);
    const index = mockProviders.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Provider not found');
    mockProviders[index] = { ...mockProviders[index], ...data };
    return mockProviders[index];
  }
};

export const chatAPI = {
  async getChatRooms(userId: string): Promise<ChatRoom[]> {
    await delay(500);
    const userMessages = mockChatMessages.filter(m => 
      m.senderId === userId || m.receiverId === userId
    );
    
    const rooms: ChatRoom[] = [];
    const participants = new Set<string>();
    
    userMessages.forEach(message => {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      if (!participants.has(otherUserId)) {
        participants.add(otherUserId);
        rooms.push({
          id: `${userId}-${otherUserId}`,
          participants: [userId, otherUserId] as [string, string],
          lastMessage: message,
          unreadCount: 0
        });
      }
    });
    
    return rooms;
  },

  async getMessages(roomId: string): Promise<ChatMessage[]> {
    await delay(500);
    return mockChatMessages;
  },

  async sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp' | 'isRead'>): Promise<ChatMessage> {
    await delay(500);
    const newMessage: ChatMessage = {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      isRead: false
    };
    mockChatMessages.push(newMessage);
    return newMessage;
  }
};

export const bookingAPI = {
  async getBookings(userId: string): Promise<Booking[]> {
    await delay(500);
    return mockBookings.filter(b => b.userId === userId || b.providerId === userId);
  },

  async createBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
    await delay(500);
    const newBooking: Booking = {
      ...booking,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    mockBookings.push(newBooking);
    return newBooking;
  },

  async updateBooking(id: string, data: Partial<Booking>): Promise<Booking> {
    await delay(500);
    const index = mockBookings.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Booking not found');
    mockBookings[index] = { ...mockBookings[index], ...data };
    return mockBookings[index];
  }
};

export const reviewAPI = {
  async getReviews(providerId: string): Promise<Review[]> {
    await delay(500);
    return mockReviews.filter(r => r.providerId === providerId);
  },

  async createReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    await delay(500);
    const newReview: Review = {
      ...review,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    mockReviews.push(newReview);
    return newReview;
  }
};

export const reportsAPI = {
  async getReports(): Promise<Report[]> {
    await delay(500);
    return mockReports;
  },

  async getReport(id: string): Promise<Report | null> {
    await delay(500);
    return mockReports.find(r => r.id === id) || null;
  },

  async updateReportStatus(id: string, status: Report['status'], adminNotes?: string, resolution?: string): Promise<Report> {
    await delay(500);
    const index = mockReports.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Report not found');
    
    const updatedReport = {
      ...mockReports[index],
      status,
      adminNotes: adminNotes || mockReports[index].adminNotes,
      resolution: resolution || mockReports[index].resolution,
      updatedAt: new Date().toISOString(),
      resolvedAt: status === 'resolved' ? new Date().toISOString() : null,
      resolvedBy: status === 'resolved' ? '2' : null // Admin user ID
    };
    
    mockReports[index] = updatedReport;
    return updatedReport;
  },

  async createReport(report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Promise<Report> {
    await delay(500);
    const newReport: Report = {
      ...report,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockReports.push(newReport);
    return newReport;
  }
};

export const adminAPI = {
  async getUsers(): Promise<User[]> {
    await delay(500);
    return [...mockUsers, ...mockProviders];
  },

  async getPendingProviders(): Promise<ServiceProvider[]> {
    await delay(500);
    return mockProviders.filter(p => !p.isApproved);
  },

  async approveProvider(id: string): Promise<void> {
    await delay(500);
    const provider = mockProviders.find(p => p.id === id);
    if (provider) {
      provider.isApproved = true;
    }
  },

  async rejectProvider(id: string): Promise<void> {
    await delay(500);
    const index = mockProviders.findIndex(p => p.id === id);
    if (index !== -1) {
      mockProviders.splice(index, 1);
    }
  },

  async getSystemStats(): Promise<any> {
    await delay(500);
    return {
      totalUsers: mockUsers.length,
      totalProviders: mockProviders.filter(p => p.isApproved).length,
      pendingProviders: mockProviders.filter(p => !p.isApproved).length,
      totalBookings: mockBookings.length,
      totalReviews: mockReviews.length,
      totalReports: mockReports.length,
      pendingReports: mockReports.filter(r => r.status === 'pending').length,
      resolvedReports: mockReports.filter(r => r.status === 'resolved').length
    };
  }
};

export const notificationAPI = {
  async getNotifications(userId: string): Promise<Notification[]> {
    await delay(500);
    return mockNotifications.filter(n => n.userId === userId);
  },

  async markAsRead(notificationId: string): Promise<void> {
    await delay(200);
    const notification = mockNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
  }
};