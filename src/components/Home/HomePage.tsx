import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Users, CheckCircle, ArrowRight, Wrench, Wind, Truck, Droplets, Zap, Sparkles, Flower, Palette } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { serviceAPI, providerAPI } from '../../api/mockAPI';
import { Service, ServiceProvider } from '../../types';

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Wrench, Wind, Truck, Droplets, Zap, Sparkles, Flower, Palette
};

export const HomePage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [topProviders, setTopProviders] = useState<ServiceProvider[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesData, providersData] = await Promise.all([
          serviceAPI.getServices(),
          providerAPI.getProviders()
        ]);
        setServices(servicesData.slice(0, 8));
        setTopProviders(providersData.slice(0, 6));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to providers page with search query
      window.location.href = `/providers?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {t('home.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              {t('home.subtitle')}
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t('home.search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 rtl:pl-4 rtl:pr-12 pr-32 rtl:pr-4 rtl:pl-32 py-4 text-gray-900 bg-white rounded-2xl shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300/50 text-lg"
                />
                <button
                  type="submit"
                  className="absolute right-2 rtl:right-auto rtl:left-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 font-medium"
                >
                  {t('common.search')}
                </button>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/providers"
                className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg"
              >
                <span>{t('nav.providers')}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center space-x-2 rtl:space-x-reverse border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                <span>{t('nav.services')}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.featured.services')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {services.map((service) => {
              const IconComponent = iconMap[service.icon] || Wrench;
              const serviceName = language.code === 'ar' ? service.nameAr : service.name;
              const serviceCategory = language.code === 'ar' ? service.categoryAr : service.category;
              
              return (
                <Link
                  key={service.id}
                  to={`/providers?service=${service.id}`}
                  className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-blue-200 group-hover:to-emerald-200 transition-all duration-300">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {serviceName}
                  </h3>
                  <p className="text-sm text-gray-600">{serviceCategory}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top Providers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.top.providers')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('providers.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topProviders.map((provider) => {
              const providerName = language.code === 'ar' ? provider.nameAr || provider.name : provider.name;
              const workingAreas = provider.workingArea.map(area => 
                language.code === 'ar' ? area.ar : area.en
              ).join(', ');

              return (
                <div
                  key={provider.id}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
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
                    <div className="ml-4 rtl:ml-0 rtl:mr-4">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{providerName}</h3>
                        {provider.isVerified && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{provider.experience} {t('provider.years')} {t('provider.experience')}</p>
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1 rtl:ml-0 rtl:mr-1">
                          {provider.rating.overall} ({provider.rating.reviewCount} {t('provider.reviews')})
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Services Offered */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">{t('provider.services')}:</h4>
                    <div className="flex flex-wrap gap-2">
                      {provider.services.slice(0, 3).map((serviceId) => {
                        const service = services.find(s => s.id === serviceId);
                        const serviceName = service ? (language.code === 'ar' ? service.nameAr : service.name) : '';
                        return service ? (
                          <span
                            key={serviceId}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                          >
                            {serviceName}
                          </span>
                        ) : null;
                      })}
                      {provider.services.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          +{provider.services.length - 3} {t('common.more')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="mb-4 text-sm text-gray-600">
                    <span className="font-medium">{t('provider.working.area')}:</span> {workingAreas}
                  </div>

                  <div className="flex space-x-3 rtl:space-x-reverse">
                    <Link
                      to={`/provider/${provider.id}`}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-center py-2 rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 font-medium"
                    >
                      {t('common.view')}
                    </Link>
                    {user ? (
                      <Link
                        to={`/chat?provider=${provider.id}`}
                        className="flex-1 border border-blue-600 text-blue-600 text-center py-2 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium"
                      >
                        {t('provider.chat')}
                      </Link>
                    ) : (
                      <Link
                        to="/login"
                        className="flex-1 border border-gray-300 text-gray-600 text-center py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                      >
                        {t('provider.sign.in')}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.how.it.works')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('home.how.it.works.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('home.step1.title')}
              </h3>
              <p className="text-gray-600">
                {t('home.step1.desc')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('home.step2.title')}
              </h3>
              <p className="text-gray-600">
                {t('home.step2.desc')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('home.step3.title')}
              </h3>
              <p className="text-gray-600">
                {t('home.step3.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 bg-gradient-to-r from-blue-600 to-emerald-600 text-white overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-emerald-400/20 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-purple-400/10 rounded-full blur-xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('home.ready.title')}
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            {t('home.ready.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg"
                >
                  <span>{t('nav.register')}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/providers"
                  className="inline-flex items-center space-x-2 rtl:space-x-reverse border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200"
                >
                  <span>{t('home.browse.providers')}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </>
            ) : (
              <Link
                to="/providers"
                className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg"
              >
                <span>{t('home.find.providers')}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};