import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Wrench, Wind, Truck, Droplets, Zap, Sparkles, Flower, Palette } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { serviceAPI } from '../../api/mockAPI';
import { Service } from '../../types';
import { Link } from 'react-router-dom';

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Wrench, Wind, Truck, Droplets, Zap, Sparkles, Flower, Palette
};

export const ServicesPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await serviceAPI.getServices();
        setServices(data);
        setFilteredServices(data);
      } catch (error) {
        console.error('Error loading services:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadServices();
  }, []);

  useEffect(() => {
    let filtered = services;

    if (searchQuery) {
      filtered = filtered.filter(service => {
        const name = language.code === 'ar' ? service.nameAr : service.name;
        const category = language.code === 'ar' ? service.categoryAr : service.category;
        return (
          name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => {
        const category = language.code === 'ar' ? service.categoryAr : service.category;
        return category === selectedCategory;
      });
    }

    setFilteredServices(filtered);
  }, [services, searchQuery, selectedCategory, language]);

  const categories = ['all', ...Array.from(new Set(services.map(s => 
    language.code === 'ar' ? s.categoryAr : s.category
  )))];

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
            {t('services.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('services.subtitle')}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('services.search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{t('services.all.categories')}</option>
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
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

        {/* Services Grid/List */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('services.no.results')}</h3>
            <p className="text-gray-600">{t('services.no.results.desc')}</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {filteredServices.map((service) => {
              const IconComponent = iconMap[service.icon] || Wrench;
              const serviceName = language.code === 'ar' ? service.nameAr : service.name;
              const serviceCategory = language.code === 'ar' ? service.categoryAr : service.category;
              
              if (viewMode === 'list') {
                return (
                  <Link
                    key={service.id}
                    to={`/providers?service=${service.id}`}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex items-center space-x-4 rtl:space-x-reverse"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-emerald-100 rounded-2xl flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{serviceName}</h3>
                      <p className="text-gray-600 mb-2">{serviceCategory}</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {t('services.available')}
                      </span>
                    </div>
                  </Link>
                );
              }

              return (
                <Link
                  key={service.id}
                  to={`/providers?service=${service.id}`}
                  className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 text-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-blue-200 group-hover:to-emerald-200 transition-all duration-300">
                    <IconComponent className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{serviceName}</h3>
                  <p className="text-sm text-gray-600 mb-3">{serviceCategory}</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {t('services.available')}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};