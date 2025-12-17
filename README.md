# ServiceHub - Service Provider Platform

A modern, bilingual (English/Arabic) service provider platform built with React, TypeScript, and Tailwind CSS. Connect users with trusted service providers for various home and professional services.

## 🌟 Features

### 🔐 **Multi-Role Authentication System**
- **Users**: Book services, chat with providers, leave reviews
- **Service Providers**: Offer services, manage bookings, build business
- **Admins**: Manage platform, handle reports, oversee operations

### 🌍 **Bilingual Support**
- Full English and Arabic language support
- RTL (Right-to-Left) layout for Arabic
- Dynamic language switching
- Localized content and UI elements

### 💬 **Real-time Communication**
- Chat system between users and providers
- Notification system with real-time updates
- Message history and conversation management

### 📅 **Booking Management**
- Service booking with date/time selection
- Booking status tracking (pending, confirmed, completed, cancelled)
- Provider availability management
- Booking history and management

### ⭐ **Review & Rating System**
- Multi-criteria rating (cost, speed, punctuality)
- Written reviews and feedback
- Provider performance statistics
- Review management and moderation

### 🛡️ **Admin Dashboard**
- User and provider management
- Service approval system
- Report management and investigation
- System analytics and monitoring
- Content moderation tools

### 📱 **Responsive Design**
- Mobile-first responsive design
- Touch-friendly interface
- Optimized for all screen sizes
- Progressive Web App features

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Linting**: ESLint
- **Type Checking**: TypeScript

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd servicehub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🎯 Demo Accounts

### User Account
- **Email**: john@example.com
- **Password**: password

### Service Provider Account
- **Email**: ahmed@example.com
- **Password**: password

### Admin Account
- **Email**: admin@example.com
- **Password**: password

## 🏗️ Project Structure

```
src/
├── api/                    # API layer and mock data
├── components/            # React components
│   ├── Admin/            # Admin panel components
│   ├── Auth/             # Authentication components
│   ├── Bookings/         # Booking management
│   ├── Chat/             # Chat system
│   ├── Dashboard/        # Dashboard components
│   ├── Home/             # Homepage components
│   ├── Layout/           # Layout components
│   ├── Profile/          # User profile components
│   ├── Providers/        # Provider components
│   └── Services/         # Service components
├── contexts/             # React contexts
├── types/                # TypeScript type definitions
├── utils/                # Utility functions and translations
└── main.tsx             # Application entry point
```

## 🌟 Key Features Breakdown

### Service Categories
- **Home Maintenance**: Plumbing, AC Repair, Electrical
- **Cleaning**: House Cleaning, Sewer Cleaning
- **Delivery**: Water Delivery, Transportation
- **Outdoor**: Gardening, Landscaping
- **Home Improvement**: Painting, Renovation

### Provider Features
- Profile management with services offered
- Working hours and availability settings
- Service area configuration
- Performance analytics and ratings
- Booking and customer management

### User Features
- Service provider search and filtering
- Direct messaging with providers
- Service booking and scheduling
- Review and rating system
- Booking history and management

### Admin Features
- User and provider approval system
- Service category management
- Report investigation and resolution
- Platform analytics and monitoring
- Content moderation tools

## 🔧 Configuration

The application uses a mock API system for demonstration purposes. In a production environment, you would replace the mock API calls with real backend endpoints.

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_APP_NAME=ServiceHub
VITE_API_URL=your-api-url
```

## 🌐 Internationalization

The application supports English and Arabic languages with:
- Complete UI translation
- RTL layout support for Arabic
- Localized date and number formatting
- Dynamic language switching

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-optimized interface
- Mobile-specific navigation patterns
- Optimized performance for mobile devices

## 🛡️ Security Features

- Role-based access control
- Input validation and sanitization
- Secure authentication flow
- Report and moderation system
- Content filtering and monitoring

## 🚀 Deployment

The application is configured for deployment on various platforms:

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting provider

3. **Configure routing** for single-page application support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons provided by [Lucide React](https://lucide.dev/)
- Images from [Pexels](https://www.pexels.com/)
- UI inspiration from modern service platforms
- Arabic translations and RTL support

## 📞 Support

For support and questions, please open an issue in the GitHub repository or contact the development team.

---

**ServiceHub** - Connecting users with trusted service providers across the region. 🌟# service_provider
