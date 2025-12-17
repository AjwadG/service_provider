import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Clock, Calendar, Phone, Mail, MessageCircle, BookOpen, Award, Users, CheckCircle, Wrench, Wind, Truck, Droplets, Zap, Sparkles, Flower, Palette } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { providerAPI, serviceAPI, reviewAPI } from '../../api/mockAPI';
import { ServiceProvider, Service, Review } from '../../types';

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Wrench, Wind, Truck, Droplets, Zap, Sparkles, Flower, Palette
};

export const ProviderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'availability'>('overview');

  useEffect(() => {
    const loadProviderData = async () => {
      if (!id) return;
      
      try {
        const [providerData, servicesData, reviewsData] = await Promise.all([
          providerAPI.getProvider(id),
          serviceAPI.getServices(),
          reviewAPI.getReviews(id)
        ]);
        
        setProvider(providerData);
        setServices(servicesData);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error loading provider data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProviderData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('provider.not.found')}</h2>
          <Link to="/providers" className="text-blue-600 hover:text-blue-700">
            {t('provider.back.providers')}
          </Link>
        </div>
      </div>
    );
  }

  const providerServices = services.filter(service => provider.services.includes(service.id));
  const workingDays = Object.entries(provider.workingHours).filter(([_, hours]) => hours.available);
  const providerName = language.code === 'ar' ? provider.nameAr || provider.name : provider.name;
  const workingAreas = provider.workingArea.map(area => 
    language.code === 'ar' ? area.ar : area.en
  ).join(', ');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/providers"
          className="inline-flex items-center space-x-2 rtl:space-x-reverse text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('provider.back.providers')}</span>
        </Link>

        {/* Provider Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8 rtl:space-x-reverse">
            {/* Avatar and Basic Info */}
            <div className="flex items-center space-x-6 rtl:space-x-reverse">
              {provider.avatar ? (
                <img
                  src={provider.avatar}
                  alt={providerName}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
                  <Users className="w-12 h-12 text-white" />
                </div>
              )}
              
              <div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{providerName}</h1>
                  {provider.isVerified && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                </div>
                <div className="flex items-center space-x-4 rtl:space-x-reverse text-gray-600 mb-2">
                  <span className="flex items-center">
                    <Award className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                    {provider.experience} {t('provider.years')} {t('provider.experience')}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                    {workingAreas}
                  </span>
                </div>
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold text-gray-900">{provider.rating.overall}</span>
                  <span className="text-gray-600">({provider.rating.reviewCount} {t('provider.reviews')})</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 rtl:space-x-reverse lg:ml-auto rtl:lg:ml-0 rtl:lg:mr-auto">
              {user ? (
                <>
                  <Link
                    to={`/chat?provider=${provider.id}`}
                    className="inline-flex items-center justify-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 font-medium"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>{t('provider.chat.now')}</span>
                  </Link>
                  <Link
                    to={`/booking?provider=${provider.id}`}
                    className="inline-flex items-center justify-center space-x-2 rtl:space-x-reverse border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>{t('provider.book.service')}</span>
                  </Link>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-3">{t('provider.sign.in.chat')}</p>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 font-medium"
                  >
                    <span>{t('provider.sign.in')}</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 rtl:space-x-reverse px-8">
              {[
                { id: 'overview', label: t('provider.overview'), icon: BookOpen },
                { id: 'reviews', label: t('provider.reviews'), icon: Star },
                { id: 'availability', label: t('provider.availability'), icon: Clock }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 rtl:space-x-reverse py-4 border-b-2 font-medium transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Description */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('provider.about')}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {language.code === 'ar' ? provider.descriptionAr || provider.description : provider.description || t('profile.no.description')}
                  </p>
                </div>

                {/* Services */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('provider.services.offered')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {providerServices.map(service => {
                      const IconComponent = iconMap[service.icon] || Wrench;
                      const serviceName = language.code === 'ar' ? service.nameAr : service.name;
                      const serviceCategory = language.code === 'ar' ? service.categoryAr : service.category;
                      
                      return (
                        <div key={service.id} className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg p-4 border border-blue-100">
                          <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-emerald-100 rounded-lg flex items-center justify-center">
                              <IconComponent className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{serviceName}</h4>
                              <p className="text-sm text-gray-600">{serviceCategory}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('provider.contact.info')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">{provider.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">{provider.email}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('provider.performance.stats')}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{provider.rating.cost}</div>
                      <div className="text-sm text-gray-600">{t('provider.cost.rating')}</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{provider.rating.speed}</div>
                      <div className="text-sm text-gray-600">{t('provider.speed.rating')}</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">{provider.rating.punctuality}</div>
                      <div className="text-sm text-gray-600">{t('provider.punctuality')}</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">{provider.rating.reviewCount}</div>
                      <div className="text-sm text-gray-600">{t('provider.total.reviews')}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">{t('provider.customer.reviews')}</h3>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-semibold">{provider.rating.overall}</span>
                    <span className="text-gray-600">({reviews.length} {t('provider.reviews')})</span>
                  </div>
                </div>

                {reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">{t('provider.no.reviews')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map(review => (
                      <div key={review.id} className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center space-x-1 rtl:space-x-reverse mb-2">
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
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">{t('review.cost')}: </span>
                                <span className="font-medium">{review.ratings.cost}/5</span>
                              </div>
                              <div>
                                <span className="text-gray-600">{t('review.speed')}: </span>
                                <span className="font-medium">{review.ratings.speed}/5</span>
                              </div>
                              <div>
                                <span className="text-gray-600">{t('review.punctuality')}: </span>
                                <span className="font-medium">{review.ratings.punctuality}/5</span>
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-gray-700">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Availability Tab */}
            {activeTab === 'availability' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">{t('provider.working.hours')}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">{t('provider.weekly.schedule')}</h4>
                    <div className="space-y-2">
                      {Object.entries(provider.workingHours).map(([day, hours]) => (
                        <div key={day} className="flex items-center justify-between py-2 px-4 bg-gray-50 rounded-lg">
                          <span className="font-medium capitalize">{t(`day.${day}`)}</span>
                          <span className={hours.available ? 'text-green-600' : 'text-red-600'}>
                            {hours.available ? `${hours.start} - ${hours.end}` : t('provider.closed')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">{t('provider.current.status')}</h4>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-green-800 font-medium">{t('provider.available.today')}</span>
                      </div>
                      <p className="text-green-700 text-sm mt-2">
                        {t('provider.accepting.bookings')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};