import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MessageCircle, Star, Users, Clock, TrendingUp, Award, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { bookingAPI, chatAPI, reviewAPI, providerAPI } from '../../api/mockAPI';
import { Booking, ChatRoom, Review } from '../../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      try {
        const [bookingsData, chatData, reviewsData] = await Promise.all([
          bookingAPI.getBookings(user.id),
          chatAPI.getChatRooms(user.id),
          user.role === 'provider' ? reviewAPI.getReviews(user.id) : Promise.resolve([])
        ]);

        setBookings(bookingsData);
        setChatRooms(chatData);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('error.please.sign.in')}</h2>
          <Link to="/login" className="text-blue-600 hover:text-blue-700">
            {t('nav.login')}
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed').slice(0, 3);
  const unreadMessages = chatRooms.filter(room => room.unreadCount > 0).length;
  const recentReviews = reviews.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t('dashboard.welcome')}, {user.name}!
          </h1>
          <p className="text-xl text-gray-600">
            {user.role === 'provider' 
              ? t('dashboard.provider.subtitle')
              : t('dashboard.user.subtitle')
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('dashboard.total.bookings')}</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('dashboard.active.chats')}</p>
                <p className="text-2xl font-bold text-gray-900">{chatRooms.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {user.role === 'provider' && (
            <>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t('dashboard.total.reviews')}</p>
                    <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t('dashboard.average.rating')}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {user.role === 'provider' && 'rating' in user ? user.rating.overall : '0.0'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </>
          )}

          {user.role === 'user' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('dashboard.unread.messages')}</p>
                  <p className="text-2xl font-bold text-gray-900">{unreadMessages}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{t('dashboard.recent.bookings')}</h2>
              <Link to="/bookings" className="text-blue-600 hover:text-blue-700 font-medium">
                {t('common.view')} {t('common.all')}
              </Link>
            </div>

            {upcomingBookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">{t('dashboard.no.upcoming')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map(booking => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{t('bookings.service')} {t('booking.title')}</p>
                      <p className="text-sm text-gray-600">{booking.date} {t('common.at')} {booking.time}</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {t(`common.${booking.status}`)}
                      </span>
                    </div>
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Messages or Reviews */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {user.role === 'provider' ? t('dashboard.recent.reviews') : t('dashboard.recent.messages')}
              </h2>
              <Link 
                to={user.role === 'provider' ? '/profile' : '/chat'} 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {t('common.view')} {t('common.all')}
              </Link>
            </div>

            {user.role === 'provider' ? (
              recentReviews.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">{t('dashboard.no.reviews')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentReviews.map(review => (
                    <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= Math.round((review.ratings.cost + review.ratings.speed + review.ratings.punctuality) / 3)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700 text-sm">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )
            ) : (
              chatRooms.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">{t('dashboard.no.messages')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatRooms.slice(0, 3).map(room => (
                    <div key={room.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{t('chat.room')}</p>
                        <p className="text-sm text-gray-600">
                          {room.lastMessage?.message.substring(0, 50)}...
                        </p>
                      </div>
                      {room.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                          {room.unreadCount}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('dashboard.quick.actions')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {user.role === 'provider' ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 rtl:space-x-reverse p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Users className="w-8 h-8 text-blue-600" />
                  <span className="font-medium text-gray-900">{t('dashboard.edit.profile')}</span>
                </Link>
                <Link
                  to="/chat"
                  className="flex items-center space-x-3 rtl:space-x-reverse p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <MessageCircle className="w-8 h-8 text-green-600" />
                  <span className="font-medium text-gray-900">{t('dashboard.messages')}</span>
                </Link>
                <Link
                  to="/bookings"
                  className="flex items-center space-x-3 rtl:space-x-reverse p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Calendar className="w-8 h-8 text-purple-600" />
                  <span className="font-medium text-gray-900">{t('dashboard.manage.bookings')}</span>
                </Link>
                <Link
                  to="/providers"
                  className="flex items-center space-x-3 rtl:space-x-reverse p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                  <span className="font-medium text-gray-900">{t('dashboard.view.analytics')}</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/providers"
                  className="flex items-center space-x-3 rtl:space-x-reverse p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Users className="w-8 h-8 text-blue-600" />
                  <span className="font-medium text-gray-900">{t('dashboard.find.providers')}</span>
                </Link>
                <Link
                  to="/services"
                  className="flex items-center space-x-3 rtl:space-x-reverse p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <MapPin className="w-8 h-8 text-green-600" />
                  <span className="font-medium text-gray-900">{t('dashboard.browse.services')}</span>
                </Link>
                <Link
                  to="/chat"
                  className="flex items-center space-x-3 rtl:space-x-reverse p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <MessageCircle className="w-8 h-8 text-purple-600" />
                  <span className="font-medium text-gray-900">{t('dashboard.messages')}</span>
                </Link>
                <Link
                  to="/bookings"
                  className="flex items-center space-x-3 rtl:space-x-reverse p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Calendar className="w-8 h-8 text-orange-600" />
                  <span className="font-medium text-gray-900">{t('dashboard.my.bookings')}</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};