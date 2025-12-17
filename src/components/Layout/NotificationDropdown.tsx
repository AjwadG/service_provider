import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, X, Check, MessageCircle, Calendar, Star, UserCheck, AlertTriangle, BarChart3, FileText, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { notificationAPI } from '../../api/mockAPI';
import { Notification } from '../../types';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) return;
      
      try {
        const data = await notificationAPI.getNotifications(user.id);
        setNotifications(data);
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      loadNotifications();
    }
  }, [user, isOpen]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      await Promise.all(unreadNotifications.map(n => notificationAPI.markAsRead(n.id)));
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      await handleMarkAsRead(notification.id);
    }

    // Admin-specific navigation logic
    if (user?.role === 'admin' && notification.data?.action) {
      switch (notification.data.action) {
        case 'review_provider':
          navigate('/admin?tab=providers');
          break;
        case 'review_service':
          navigate('/admin?tab=services');
          break;
        case 'investigate':
          navigate('/admin?tab=users');
          break;
        case 'support_needed':
          navigate('/admin?tab=dashboard');
          break;
        case 'verify_documents':
          navigate('/admin?tab=providers');
          break;
        case 'view_report':
          navigate('/admin?tab=dashboard');
          break;
        case 'bulk_approve':
          navigate('/admin?tab=services');
          break;
        default:
          navigate('/admin');
      }
    } else {
      // Regular navigation logic for non-admin users
      if (notification.data) {
        switch (notification.type) {
          case 'message':
            if (notification.data.providerId) {
              navigate(`/chat?provider=${notification.data.providerId}`);
            } else {
              navigate('/chat');
            }
            break;
          case 'booking':
            if (notification.data.bookingId) {
              navigate('/bookings');
            }
            break;
          case 'review':
            if (user?.role === 'provider') {
              navigate('/profile');
            } else if (notification.data.providerId) {
              navigate(`/provider/${notification.data.providerId}`);
            }
            break;
          case 'approval':
            navigate('/profile');
            break;
          default:
            navigate('/dashboard');
        }
      } else {
        // Default navigation based on type
        switch (notification.type) {
          case 'message':
            navigate('/chat');
            break;
          case 'booking':
            navigate('/bookings');
            break;
          case 'review':
            navigate('/profile');
            break;
          case 'approval':
            navigate('/profile');
            break;
          default:
            navigate('/dashboard');
        }
      }
    }

    onClose();
  };

  const getNotificationIcon = (notification: Notification) => {
    // Admin-specific icons
    if (user?.role === 'admin') {
      if (notification.data?.action) {
        switch (notification.data.action) {
          case 'review_provider':
          case 'verify_documents':
          case 'bulk_approve':
            return <UserCheck className="w-5 h-5 text-purple-600" />;
          case 'review_service':
            return <Star className="w-5 h-5 text-yellow-600" />;
          case 'investigate':
            return <Shield className="w-5 h-5 text-red-600" />;
          case 'support_needed':
            return <AlertTriangle className="w-5 h-5 text-orange-600" />;
          case 'view_report':
            return <BarChart3 className="w-5 h-5 text-green-600" />;
          default:
            return <Bell className="w-5 h-5 text-gray-600" />;
        }
      }
    }

    // Regular notification icons
    switch (notification.type) {
      case 'message':
        return <MessageCircle className="w-5 h-5 text-blue-600" />;
      case 'booking':
        return <Calendar className="w-5 h-5 text-green-600" />;
      case 'review':
        return <Star className="w-5 h-5 text-yellow-600" />;
      case 'approval':
        return <UserCheck className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationPriority = (notification: Notification) => {
    if (user?.role === 'admin' && notification.data?.action) {
      switch (notification.data.action) {
        case 'investigate':
        case 'support_needed':
          return 'high';
        case 'review_provider':
        case 'verify_documents':
          return 'medium';
        default:
          return 'normal';
      }
    }
    return 'normal';
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{t('nav.notifications')}</h3>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {t('notifications.mark.all.read')}
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">{t('notifications.no.notifications')}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map(notification => {
              const priority = getNotificationPriority(notification);
              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer relative ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  } ${
                    priority === 'high' ? 'border-l-4 border-red-500' :
                    priority === 'medium' ? 'border-l-4 border-yellow-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <p className={`text-sm font-medium ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {language.code === 'ar' ? notification.titleAr : notification.title}
                        </p>
                        {priority === 'high' && (
                          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 ml-2 rtl:ml-0 rtl:mr-2" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {language.code === 'ar' ? notification.messageAr : notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        className="flex-shrink-0 p-1 text-blue-600 hover:text-blue-700 rounded-lg hover:bg-blue-100"
                        title={t('notifications.mark.as.read')}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {!notification.isRead && (
                    <div className="absolute right-2 rtl:right-auto rtl:left-2 top-4 w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={() => {
              if (user?.role === 'admin') {
                navigate('/admin');
              } else {
                navigate('/notifications');
              }
              onClose();
            }}
            className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {t('notifications.view.all')}
          </button>
        </div>
      )}
    </div>
  );
};