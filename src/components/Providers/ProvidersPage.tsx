import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, MapPin, Star, Users, Clock, Grid, List, Wrench, Wind, Truck, Droplets, Zap, Sparkles, Flower, Palette } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { providerAPI, serviceAPI } from '../../api/mockAPI';
import { ServiceProvider, Service } from '../../types';

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Wrench, Wind, Truck, Droplets, Zap, Sparkles, Flower, Palette
};

export const ProvidersPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedService, setSelectedService] = useState(searchParams.get('service') || 'all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [providersData, servicesData] = await Promise.all([
          providerAPI.getProviders(),
          serviceAPI.getServices()
        ]);
        setProviders(providersData);
        setServices(servicesData);
        setFilteredProviders(providersData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    let filtered = providers;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(provider => {
        const providerName = language.code === 'ar' ? provider.nameAr || provider.name : provider.name;
        return (
          providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.services.some(serviceId => {
            const service = services.find(s => s.id === serviceId);
            if (!service) return false;
            const serviceName = language.code === 'ar' ? service.nameAr : service.name;
            return serviceName.toLowerCase().includes(searchQuery.toLowerCase());
          })
        );
      });
    }

    // Service filter
    if (selectedService !== 'all') {
      filtered = filtered.filter(provider =>
        provider.services.includes(selectedService)
      );
    }

    // Location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(provider =>
        provider.workingArea.some(area => 
          (language.code === 'ar' ? area.ar : area.en) === selectedLocation
        )
      );
    }

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(provider =>
        provider.rating.overall >= minRating
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating.overall - a.rating.overall;
        case 'experience':
          return b.experience - a.experience;
        case 'reviews':
          return b.rating.reviewCount - a.rating.reviewCount;
        case 'name':
          const nameA = language.code === 'ar' ? a.nameAr || a.name : a.name;
          const nameB = language.code === 'ar' ? b.nameAr || b.name : b.name;
          return nameA.localeCompare(nameB);
        default:
          return 0;
      }
    });

    setFilteredProviders(filtered);
  }, [providers, services, searchQuery, selectedService, selectedLocation, minRating, sortBy, language]);

  const locations = ['all', ...Array.from(new Set(
    providers.flatMap(p => p.workingArea.map(area => 
      language.code === 'ar' ? area.ar : area.en
    ))
  ))];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('providers.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('providers.subtitle')}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('providers.search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Service Filter */}
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{t('providers.all.services')}</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {language.code === 'ar' ? service.nameAr : service.name}
                </option>
              ))}
            </select>

            {/* Location Filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{t('providers.all.locations')}</option>
              {locations.slice(1).map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="rating">{t('providers.highest.rated')}</option>
              <option value="experience">{t('providers.most.experienced')}</option>
              <option value="reviews">{t('providers.most.reviews')}</option>
              <option value="name">{t('providers.name.az')}</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center">
            {/* Rating Filter */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse mb-4 sm:mb-0">
              <span className="text-sm font-medium text-gray-700">{t('providers.min.rating')}</span>
              <div className="flex space-x-1 rtl:space-x-reverse">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                    className={`p-1 ${minRating >= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    <Star className="w-5 h-5 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            {t('providers.showing.results')} {filteredProviders.length} {t('providers.of')} {providers.length} {t('providers.providers')}
          </p>
        </div>

        {/* Providers Grid/List */}
        {filteredProviders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('providers.no.results')}</h3>
            <p className="text-gray-600">{t('providers.no.results.desc')}</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
            : 'space-y-6'
          }>
            {filteredProviders.map((provider) => {
              const providerName = language.code === 'ar' ? provider.nameAr || provider.name : provider.name;
              const workingAreas = provider.workingArea.map(area => 
                language.code === 'ar' ? area.ar : area.en
              ).join(', ');

              return (
                <div
                  key={provider.id}
                  className={`bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 ${
                    viewMode === 'list' ? 'p-6 flex items-center space-x-6 rtl:space-x-reverse' : 'p-6'
                  }`}
                >
                  {/* Provider Info */}
                  <div className={`flex items-center ${viewMode === 'list' ? 'flex-shrink-0' : 'mb-4'}`}>
                    {provider.avatar ? (
                      <img
                        src={provider.avatar}
                        alt={providerName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div className={`${viewMode === 'list' ? 'ml-4 rtl:ml-0 rtl:mr-4' : 'ml-4 rtl:ml-0 rtl:mr-4'}`}>
                      <h3 className="text-lg font-semibold text-gray-900">{providerName}</h3>
                      <p className="text-sm text-gray-600">{provider.experience} {t('provider.years')} {t('provider.experience')}</p>
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1 rtl:ml-0 rtl:mr-1">
                          {provider.rating.overall} ({provider.rating.reviewCount} {t('provider.reviews')})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Services and Location */}
                  <div className={`${viewMode === 'list' ? 'flex-1' : 'mb-4'}`}>
                    {/* Services Offered */}
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">{t('provider.services')}:</h4>
                      <div className="flex flex-wrap gap-2">
                        {provider.services.slice(0, viewMode === 'list' ? 4 : 3).map((serviceId) => {
                          const service = services.find(s => s.id === serviceId);
                          const IconComponent = service ? iconMap[service.icon] || Wrench : Wrench;
                          const serviceName = service ? (language.code === 'ar' ? service.nameAr : service.name) : '';
                          return service ? (
                            <span
                              key={serviceId}
                              className="inline-flex items-center space-x-1 rtl:space-x-reverse px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                            >
                              <IconComponent className="w-3 h-3" />
                              <span>{serviceName}</span>
                            </span>
                          ) : null;
                        })}
                        {provider.services.length > (viewMode === 'list' ? 4 : 3) && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                            +{provider.services.length - (viewMode === 'list' ? 4 : 3)} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                      <span>{workingAreas}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                      <span>{t('providers.available.today')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={`flex ${viewMode === 'list' ? 'space-x-3 rtl:space-x-reverse flex-shrink-0' : 'space-x-3 rtl:space-x-reverse'}`}>
                    <Link
                      to={`/provider/${provider.id}`}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-center py-2 px-4 rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 font-medium"
                    >
                      {t('common.view')}
                    </Link>
                    {user ? (
                      <Link
                        to={`/chat?provider=${provider.id}`}
                        className="flex-1 border border-blue-600 text-blue-600 text-center py-2 px-4 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium"
                      >
                        {t('provider.chat')}
                      </Link>
                    ) : (
                      <Link
                        to="/login"
                        className="flex-1 border border-gray-300 text-gray-600 text-center py-2 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                      >
                        {t('provider.sign.in')}
                      </Link>
                    )}
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