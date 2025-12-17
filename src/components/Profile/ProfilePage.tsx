import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Star, Award, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { providerAPI, serviceAPI, reviewAPI } from '../../api/mockAPI';
import { ServiceProvider, Service, Review } from '../../types';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editData, setEditData] = useState<Partial<ServiceProvider>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;

      try {
        const [servicesData, reviewsData] = await Promise.all([
          serviceAPI.getServices(),
          user.role === 'provider' ? reviewAPI.getReviews(user.id) : Promise.resolve([])
        ]);

        setServices(servicesData);
        setReviews(reviewsData);
        
        if (user.role === 'provider') {
          setEditData(user as ServiceProvider);
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [user]);

  const handleSave = async () => {
    if (!user || user.role !== 'provider') return;

    try {
      await providerAPI.updateProvider(user.id, editData);
      setIsEditing(false);
      // In a real app, you'd update the user context here
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user?.role === 'provider') {
      setEditData(user as ServiceProvider);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
          <p className="text-gray-600">You need to be logged in to view your profile</p>
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

  const provider = user.role === 'provider' ? user as ServiceProvider : null;
  const providerServices = provider ? services.filter(s => provider.services.includes(s.id)) : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('nav.profile')}
          </h1>
          <p className="text-xl text-gray-600">
            Manage your account information and settings
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Profile Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-2 rtl:space-x-reverse">
                <button
                  onClick={handleSave}
                  className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Avatar and Basic Info */}
            <div className="text-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                />
              ) : (
                <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-16 h-16 text-white" />
                </div>
              )}
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{user.name}</h3>
              <p className="text-gray-600 capitalize">{user.role}</p>
              
              {provider && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-semibold">{provider.rating.overall}</span>
                    <span className="text-gray-600">({provider.rating.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse text-gray-600">
                    <Award className="w-4 h-4" />
                    <span>{provider.experience} years experience</span>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-2">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Mail className="w-5 h-5 text-blue-600" />
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <span className="text-gray-700">{user.email}</span>
                  )}
                </div>

                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Phone className="w-5 h-5 text-blue-600" />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <span className="text-gray-700">{user.phone}</span>
                  )}
                </div>

                {provider && (
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">{provider.workingArea.join(', ')}</span>
                  </div>
                )}

                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Description for providers */}
              {provider && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">About</h4>
                  {isEditing ? (
                    <textarea
                      value={editData.description || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell customers about your services and experience..."
                    />
                  ) : (
                    <p className="text-gray-700">
                      {provider.description || 'No description provided.'}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Provider-specific sections */}
        {provider && (
          <>
            {/* Services */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Services Offered</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {providerServices.map(service => (
                  <div key={service.id} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-1">{service.name}</h4>
                    <p className="text-sm text-gray-600">{service.category}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Performance Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{provider.rating.cost}</div>
                  <div className="text-sm text-gray-600">Cost Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{provider.rating.speed}</div>
                  <div className="text-sm text-gray-600">Speed Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{provider.rating.punctuality}</div>
                  <div className="text-sm text-gray-600">Punctuality</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{provider.rating.reviewCount}</div>
                  <div className="text-sm text-gray-600">Total Reviews</div>
                </div>
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Reviews</h3>
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No reviews yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.slice(0, 5).map(review => (
                    <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
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
                        <p className="text-gray-700">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};