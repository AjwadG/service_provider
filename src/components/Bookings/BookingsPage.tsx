import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, Star, Filter, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { bookingAPI, providerAPI, serviceAPI } from '../../api/mockAPI';
import { Booking, ServiceProvider, Service } from '../../types';

export const BookingsPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBookingsData = async () => {
      if (!user) return;

      try {
        const [bookingsData, providersData, servicesData] = await Promise.all([
          bookingAPI.getBookings(user.id),
          providerAPI.getProviders(),
          serviceAPI.getServices()
        ]);

        setBookings(bookingsData);
        setProviders(providersData);
        setServices(servicesData);
        setFilteredBookings(bookingsData);
      } catch (error) {
        console.error('Error loading bookings data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookingsData();
  }, [user]);

  useEffect(() => {
    let filtered = bookings;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(booking => {
        const provider = providers.find(p => p.id === booking.providerId);
        const service = services.find(s => s.id === booking.serviceId);
        return (
          provider?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.notes?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    setFilteredBookings(filtered);
  }, [bookings, statusFilter, searchQuery, providers, services]);

  const handleStatusUpdate = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      await bookingAPI.updateBooking(bookingId, { status: newStatus });
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      ));
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
          <p className="text-gray-600">You need to be logged in to view bookings</p>
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

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('nav.bookings')}
          </h1>
          <p className="text-xl text-gray-600">
            {user.role === 'provider' 
              ? 'Manage your service bookings and appointments'
              : 'View and manage your service bookings'
            }
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">
              {statusFilter === 'all' 
                ? 'You have no bookings yet'
                : `No ${statusFilter} bookings found`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map(booking => {
              const provider = providers.find(p => p.id === booking.providerId);
              const service = services.find(s => s.id === booking.serviceId);
              
              return (
                <div key={booking.id} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    {/* Booking Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {service?.name || 'Service'}
                          </h3>
                          <div className="flex items-center space-x-4 rtl:space-x-reverse text-gray-600 mb-2">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                              <span>{provider?.name || 'Provider'}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                              <span>{booking.date}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                              <span>{booking.time}</span>
                            </div>
                          </div>
                          {booking.notes && (
                            <p className="text-gray-600 mb-2">
                              <strong>Notes:</strong> {booking.notes}
                            </p>
                          )}
                        </div>
                        
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>

                      {/* Provider Info */}
                      {provider && (
                        <div className="flex items-center space-x-4 rtl:space-x-reverse p-4 bg-gray-50 rounded-lg">
                          {provider.avatar ? (
                            <img
                              src={provider.avatar}
                              alt={provider.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-white" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{provider.name}</p>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">
                                {provider.rating.overall} ({provider.rating.reviewCount} reviews)
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                            <span>{provider.workingArea.join(', ')}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-6 lg:mt-0 lg:ml-6 rtl:lg:ml-0 rtl:lg:mr-6 flex flex-col space-y-2">
                      {user.role === 'provider' && booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 'completed')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                        >
                          Mark Complete
                        </button>
                      )}

                      {booking.status === 'completed' && user.role === 'user' && (
                        <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200 font-medium">
                          Leave Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};