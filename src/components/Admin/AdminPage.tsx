import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Settings, BarChart3, MessageSquare, Star, Calendar, TrendingUp, Plus, Edit, Trash2, UserX, RotateCcw, Shield, ShieldOff, AlertTriangle, FileText, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { adminAPI, serviceAPI, reportsAPI } from '../../api/mockAPI';
import { User, ServiceProvider, Service, Report } from '../../types';

interface ServiceFormData {
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  icon: string;
}

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'providers' | 'services' | 'reports'>('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [pendingProviders, setPendingProviders] = useState<ServiceProvider[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reportFilter, setReportFilter] = useState<'all' | 'pending' | 'investigating' | 'resolved' | 'dismissed'>('all');
  
  // Modal states
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceFormData, setServiceFormData] = useState<ServiceFormData>({
    name: '',
    nameAr: '',
    category: '',
    categoryAr: '',
    icon: 'Wrench'
  });

  const iconOptions = [
    'Wrench', 'Wind', 'Truck', 'Droplets', 'Zap', 'Sparkles', 'Flower', 'Palette',
    'Home', 'Car', 'Hammer', 'Brush', 'Scissors', 'Camera', 'Music', 'Book'
  ];

  useEffect(() => {
    const loadAdminData = async () => {
      if (!user || user.role !== 'admin') return;

      try {
        const [allUsersData, pendingData, servicesData, reportsData, statsData] = await Promise.all([
          adminAPI.getUsers(),
          adminAPI.getPendingProviders(),
          serviceAPI.getServices(),
          reportsAPI.getReports(),
          adminAPI.getSystemStats()
        ]);

        // Separate users and providers
        const regularUsers = allUsersData.filter(u => u.role === 'user');
        const allProviders = allUsersData.filter(u => u.role === 'provider') as ServiceProvider[];
        const approvedProviders = allProviders.filter(p => p.isApproved);

        setUsers(regularUsers);
        setProviders(approvedProviders);
        setPendingProviders(pendingData);
        setServices(servicesData);
        setReports(reportsData);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminData();
  }, [user]);

  const handleApproveProvider = async (providerId: string) => {
    try {
      await adminAPI.approveProvider(providerId);
      const approvedProvider = pendingProviders.find(p => p.id === providerId);
      if (approvedProvider) {
        setProviders(prev => [...prev, { ...approvedProvider, isApproved: true }]);
        setPendingProviders(prev => prev.filter(p => p.id !== providerId));
      }
    } catch (error) {
      console.error('Error approving provider:', error);
    }
  };

  const handleRejectProvider = async (providerId: string) => {
    try {
      await adminAPI.rejectProvider(providerId);
      setPendingProviders(prev => prev.filter(p => p.id !== providerId));
    } catch (error) {
      console.error('Error rejecting provider:', error);
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    // Mock implementation - in real app, this would call an API
    console.log('Deactivating user:', userId);
    // Update local state to show user as deactivated
  };

  const handleResetPassword = async (userId: string) => {
    // Mock implementation - in real app, this would call an API
    console.log('Resetting password for user:', userId);
    alert('Password reset email sent to user');
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        // Update existing service (mock implementation)
        const updatedService = { ...editingService, ...serviceFormData };
        setServices(prev => prev.map(s => s.id === editingService.id ? updatedService : s));
      } else {
        // Add new service
        const newService = await serviceAPI.addService({
          ...serviceFormData,
          isApproved: true
        });
        setServices(prev => [...prev, newService]);
      }
      
      setShowServiceModal(false);
      setEditingService(null);
      setServiceFormData({
        name: '',
        nameAr: '',
        category: '',
        categoryAr: '',
        icon: 'Wrench'
      });
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceFormData({
      name: service.name,
      nameAr: service.nameAr || '',
      category: service.category,
      categoryAr: service.categoryAr || '',
      icon: service.icon
    });
    setShowServiceModal(true);
  };

  const handleDeleteService = async (serviceId: string) => {
    if (confirm(t('admin.confirm.delete.service'))) {
      // Mock implementation
      setServices(prev => prev.filter(s => s.id !== serviceId));
    }
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const handleUpdateReportStatus = async (reportId: string, status: Report['status'], adminNotes?: string, resolution?: string) => {
    try {
      const updatedReport = await reportsAPI.updateReportStatus(reportId, status, adminNotes, resolution);
      setReports(prev => prev.map(r => r.id === reportId ? updatedReport : r));
      if (selectedReport && selectedReport.id === reportId) {
        setSelectedReport(updatedReport);
      }
    } catch (error) {
      console.error('Error updating report status:', error);
    }
  };

  const getReportStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'investigating':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'dismissed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Report['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getUserById = (userId: string) => {
    return [...users, ...providers].find(u => u.id === userId);
  };

  const filteredReports = reports.filter(report => {
    if (reportFilter === 'all') return true;
    return report.status === reportFilter;
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('admin.access.denied')}</h2>
          <p className="text-gray-600">{t('admin.no.permission')}</p>
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

  const tabs = [
    { id: 'dashboard', label: t('admin.dashboard'), icon: BarChart3 },
    { id: 'users', label: t('admin.users'), icon: Users },
    { id: 'providers', label: t('admin.providers'), icon: UserCheck },
    { id: 'services', label: t('admin.services'), icon: Settings },
    { id: 'reports', label: t('admin.reports'), icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('admin.dashboard')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('admin.subtitle')}
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 rtl:space-x-reverse px-8">
              {tabs.map(tab => {
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
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-blue-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">{t('admin.total.users')}</p>
                        <p className="text-3xl font-bold text-blue-900">{stats.totalUsers || 0}</p>
                      </div>
                      <Users className="w-12 h-12 text-blue-600" />
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">{t('admin.active.providers')}</p>
                        <p className="text-3xl font-bold text-green-900">{stats.totalProviders || 0}</p>
                      </div>
                      <UserCheck className="w-12 h-12 text-green-600" />
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-yellow-600">{t('admin.pending.providers')}</p>
                        <p className="text-3xl font-bold text-yellow-900">{stats.pendingProviders || 0}</p>
                      </div>
                      <Calendar className="w-12 h-12 text-yellow-600" />
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-red-600">{t('admin.pending.reports')}</p>
                        <p className="text-3xl font-bold text-red-900">{stats.pendingReports || 0}</p>
                      </div>
                      <AlertTriangle className="w-12 h-12 text-red-600" />
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.recent.users')}</h3>
                    <div className="space-y-3">
                      {[...users, ...providers].slice(0, 5).map(user => (
                        <div key={user.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-600">{t(`auth.role.${user.role}`)}</p>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.recent.reports')}</h3>
                    <div className="space-y-3">
                      {reports.slice(0, 5).map(report => (
                        <div key={report.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              report.priority === 'high' ? 'bg-red-100' :
                              report.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                            }`}>
                              <AlertTriangle className={`w-4 h-4 ${getPriorityColor(report.priority)}`} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{report.title}</p>
                              <p className="text-sm text-gray-600">{report.type.replace('_', ' ')}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getReportStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">{t('admin.all.users')}</h3>
                  <span className="text-sm text-gray-600">{users.length} {t('admin.users').toLowerCase()}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.user')}
                        </th>
                        <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.status')}
                        </th>
                        <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.joined')}
                        </th>
                        <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map(user => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-white" />
                              </div>
                              <div className="ml-4 rtl:ml-0 rtl:mr-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.isVerified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {user.isVerified ? t('admin.verified') : t('common.pending')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2 rtl:space-x-reverse">
                              <button
                                onClick={() => handleResetPassword(user.id)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                title={t('admin.reset.password')}
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeactivateUser(user.id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded"
                                title={t('admin.deactivate.user')}
                              >
                                <UserX className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Providers Tab */}
            {activeTab === 'providers' && (
              <div className="space-y-8">
                {/* Pending Approvals */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">{t('admin.pending.approvals')}</h3>
                  {pendingProviders.length === 0 ? (
                    <div className="text-center py-8">
                      <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">{t('admin.no.pending')}</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {pendingProviders.map(provider => (
                        <div key={provider.id} className="bg-gray-50 rounded-lg p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                                <Users className="w-8 h-8 text-white" />
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900">{provider.name}</h4>
                                <p className="text-gray-600">{provider.email}</p>
                                <p className="text-sm text-gray-500">
                                  {provider.experience} {t('provider.years')} {t('provider.experience')} • {provider.services.length} {t('provider.services').toLowerCase()}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2 rtl:space-x-reverse">
                              <button
                                onClick={() => handleApproveProvider(provider.id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                              >
                                {t('common.approve')}
                              </button>
                              <button
                                onClick={() => handleRejectProvider(provider.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                              >
                                {t('common.reject')}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Approved Providers */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">{t('admin.approved.providers')}</h3>
                    <span className="text-sm text-gray-600">{providers.length} {t('admin.providers').toLowerCase()}</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('admin.provider')}
                          </th>
                          <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('provider.rating')}
                          </th>
                          <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('provider.services')}
                          </th>
                          <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('admin.actions')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {providers.map(provider => (
                          <tr key={provider.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                                  <UserCheck className="w-5 h-5 text-white" />
                                </div>
                                <div className="ml-4 rtl:ml-0 rtl:mr-4">
                                  <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                                  <div className="text-sm text-gray-500">{provider.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                <span className="text-sm text-gray-900">{provider.rating.overall}</span>
                                <span className="text-sm text-gray-500 ml-1">({provider.rating.reviewCount})</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {provider.services.length} {t('provider.services').toLowerCase()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2 rtl:space-x-reverse">
                                <button
                                  onClick={() => handleResetPassword(provider.id)}
                                  className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                  title={t('admin.reset.password')}
                                >
                                  <RotateCcw className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeactivateUser(provider.id)}
                                  className="text-red-600 hover:text-red-900 p-1 rounded"
                                  title={t('admin.deactivate.provider')}
                                >
                                  <UserX className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">{t('admin.all.services')}</h3>
                  <button
                    onClick={() => setShowServiceModal(true)}
                    className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t('admin.add.service')}</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map(service => (
                    <div key={service.id} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {language.code === 'ar' ? service.nameAr : service.name}
                        </h4>
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <button
                            onClick={() => handleEditService(service)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title={t('common.edit')}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title={t('common.delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">
                        {language.code === 'ar' ? service.categoryAr : service.category}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        service.isApproved 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {service.isApproved ? t('admin.approved') : t('common.pending')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">{t('admin.reports')}</h3>
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <select
                      value={reportFilter}
                      onChange={(e) => setReportFilter(e.target.value as any)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">{t('admin.all.reports')}</option>
                      <option value="pending">{t('admin.pending.reports')}</option>
                      <option value="investigating">{t('admin.investigating.reports')}</option>
                      <option value="resolved">{t('admin.resolved.reports')}</option>
                      <option value="dismissed">{t('admin.dismissed.reports')}</option>
                    </select>
                    <span className="text-sm text-gray-600">
                      {filteredReports.length} {t('admin.reports').toLowerCase()}
                    </span>
                  </div>
                </div>

                {filteredReports.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin.no.reports')}</h3>
                    <p className="text-gray-600">{t('admin.no.reports.desc')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredReports.map(report => {
                      const reporter = getUserById(report.reporterId);
                      const reportedUser = getUserById(report.reportedUserId);
                      
                      return (
                        <div key={report.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  report.priority === 'high' ? 'bg-red-500' :
                                  report.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                }`}></div>
                                <h4 className="text-lg font-semibold text-gray-900">{report.title}</h4>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getReportStatusColor(report.status)}`}>
                                  {report.status}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <p className="text-sm text-gray-600 mb-1">{t('admin.reported.by')}:</p>
                                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                      <Users className="w-3 h-3 text-blue-600" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                      {reporter?.name || 'Unknown User'}
                                    </span>
                                    <span className="text-xs text-gray-500">({reporter?.role})</span>
                                  </div>
                                </div>
                                
                                <div>
                                  <p className="text-sm text-gray-600 mb-1">{t('admin.reported.user')}:</p>
                                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                      report.reportedUserType === 'provider' ? 'bg-green-100' : 'bg-gray-100'
                                    }`}>
                                      {report.reportedUserType === 'provider' ? (
                                        <UserCheck className="w-3 h-3 text-green-600" />
                                      ) : (
                                        <Users className="w-3 h-3 text-gray-600" />
                                      )}
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                      {reportedUser?.name || 'Unknown User'}
                                    </span>
                                    <span className="text-xs text-gray-500">({report.reportedUserType})</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-1">{t('admin.report.type')}:</p>
                                <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                                  {report.type.replace('_', ' ')}
                                </span>
                              </div>
                              
                              <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                                {report.description}
                              </p>
                              
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>{t('admin.created')}: {new Date(report.createdAt).toLocaleDateString()}</span>
                                {report.resolvedAt && (
                                  <span>{t('admin.resolved')}: {new Date(report.resolvedAt).toLocaleDateString()}</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col space-y-2 ml-4 rtl:ml-0 rtl:mr-4">
                              <button
                                onClick={() => handleViewReport(report)}
                                className="inline-flex items-center space-x-1 rtl:space-x-reverse px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors duration-200"
                              >
                                <Eye className="w-3 h-3" />
                                <span>{t('admin.view.details')}</span>
                              </button>
                              
                              {report.status === 'pending' && (
                                <button
                                  onClick={() => handleUpdateReportStatus(report.id, 'investigating')}
                                  className="inline-flex items-center space-x-1 rtl:space-x-reverse px-3 py-1 bg-yellow-600 text-white text-xs font-medium rounded hover:bg-yellow-700 transition-colors duration-200"
                                >
                                  <Clock className="w-3 h-3" />
                                  <span>{t('admin.investigate')}</span>
                                </button>
                              )}
                              
                              {report.status === 'investigating' && (
                                <div className="flex flex-col space-y-1">
                                  <button
                                    onClick={() => handleUpdateReportStatus(report.id, 'resolved', '', 'Issue resolved through admin intervention')}
                                    className="inline-flex items-center space-x-1 rtl:space-x-reverse px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors duration-200"
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                    <span>{t('admin.resolve')}</span>
                                  </button>
                                  <button
                                    onClick={() => handleUpdateReportStatus(report.id, 'dismissed', '', 'Report dismissed after investigation')}
                                    className="inline-flex items-center space-x-1 rtl:space-x-reverse px-3 py-1 bg-gray-600 text-white text-xs font-medium rounded hover:bg-gray-700 transition-colors duration-200"
                                  >
                                    <XCircle className="w-3 h-3" />
                                    <span>{t('admin.dismiss')}</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Service Modal */}
        {showServiceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {editingService ? t('admin.edit.service') : t('admin.add.service')}
              </h3>
              <form onSubmit={handleServiceSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.service.name.en')}
                  </label>
                  <input
                    type="text"
                    value={serviceFormData.name}
                    onChange={(e) => setServiceFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.service.name.ar')}
                  </label>
                  <input
                    type="text"
                    value={serviceFormData.nameAr}
                    onChange={(e) => setServiceFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.category.en')}
                  </label>
                  <input
                    type="text"
                    value={serviceFormData.category}
                    onChange={(e) => setServiceFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.category.ar')}
                  </label>
                  <input
                    type="text"
                    value={serviceFormData.categoryAr}
                    onChange={(e) => setServiceFormData(prev => ({ ...prev, categoryAr: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.icon')}
                  </label>
                  <select
                    value={serviceFormData.icon}
                    onChange={(e) => setServiceFormData(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-4 rtl:space-x-reverse pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    {editingService ? t('common.save') : t('admin.add.service')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowServiceModal(false);
                      setEditingService(null);
                      setServiceFormData({
                        name: '',
                        nameAr: '',
                        category: '',
                        categoryAr: '',
                        icon: 'Wrench'
                      });
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Report Details Modal */}
        {showReportModal && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-gray-900">{t('admin.report.details')}</h3>
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Report Header */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-semibold text-gray-900">{selectedReport.title}</h4>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getReportStatusColor(selectedReport.status)}`}>
                          {selectedReport.status}
                        </span>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                          selectedReport.priority === 'high' ? 'bg-red-100 text-red-800' :
                          selectedReport.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {selectedReport.priority} priority
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{t('admin.report.type')}:</p>
                        <p className="font-medium text-gray-900">{selectedReport.type.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{t('admin.category')}:</p>
                        <p className="font-medium text-gray-900">{selectedReport.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{t('admin.created')}:</p>
                        <p className="font-medium text-gray-900">{new Date(selectedReport.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Involved Users */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.reporter')}</h5>
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{getUserById(selectedReport.reporterId)?.name || 'Unknown User'}</p>
                          <p className="text-sm text-gray-600">{getUserById(selectedReport.reporterId)?.email}</p>
                          <p className="text-xs text-gray-500">{getUserById(selectedReport.reporterId)?.role}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 rounded-lg p-6">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.reported.user')}</h5>
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          selectedReport.reportedUserType === 'provider' ? 'bg-green-600' : 'bg-gray-600'
                        }`}>
                          {selectedReport.reportedUserType === 'provider' ? (
                            <UserCheck className="w-6 h-6 text-white" />
                          ) : (
                            <Users className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{getUserById(selectedReport.reportedUserId)?.name || 'Unknown User'}</p>
                          <p className="text-sm text-gray-600">{getUserById(selectedReport.reportedUserId)?.email}</p>
                          <p className="text-xs text-gray-500">{selectedReport.reportedUserType}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h5 className="text-lg font-semibold text-gray-900 mb-3">{t('admin.description')}</h5>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">{selectedReport.description}</p>
                    </div>
                  </div>

                  {/* Evidence */}
                  {selectedReport.evidence && Object.keys(selectedReport.evidence).length > 0 && (
                    <div>
                      <h5 className="text-lg font-semibold text-gray-900 mb-3">{t('admin.evidence')}</h5>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedReport.evidence.screenshots && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">{t('admin.screenshots')}:</p>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {selectedReport.evidence.screenshots.map((screenshot, index) => (
                                  <li key={index}>• {screenshot}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {selectedReport.evidence.photos && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">{t('admin.photos')}:</p>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {selectedReport.evidence.photos.map((photo, index) => (
                                  <li key={index}>• {photo}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {selectedReport.evidence.bookingId && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">{t('admin.related.booking')}:</p>
                              <p className="text-sm text-gray-600">#{selectedReport.evidence.bookingId}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Admin Notes */}
                  <div>
                    <h5 className="text-lg font-semibold text-gray-900 mb-3">{t('admin.notes')}</h5>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">{selectedReport.adminNotes || t('admin.no.notes')}</p>
                    </div>
                  </div>

                  {/* Resolution */}
                  {selectedReport.resolution && (
                    <div>
                      <h5 className="text-lg font-semibold text-gray-900 mb-3">{t('admin.resolution')}</h5>
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-gray-700">{selectedReport.resolution}</p>
                        {selectedReport.resolvedAt && (
                          <p className="text-sm text-gray-600 mt-2">
                            {t('admin.resolved.on')}: {new Date(selectedReport.resolvedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {selectedReport.status !== 'resolved' && selectedReport.status !== 'dismissed' && (
                    <div className="flex space-x-4 rtl:space-x-reverse pt-6 border-t border-gray-200">
                      {selectedReport.status === 'pending' && (
                        <button
                          onClick={() => {
                            handleUpdateReportStatus(selectedReport.id, 'investigating');
                            setShowReportModal(false);
                          }}
                          className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200"
                        >
                          {t('admin.start.investigation')}
                        </button>
                      )}
                      
                      {selectedReport.status === 'investigating' && (
                        <>
                          <button
                            onClick={() => {
                              handleUpdateReportStatus(selectedReport.id, 'resolved', '', 'Issue resolved through admin intervention');
                              setShowReportModal(false);
                            }}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                          >
                            {t('admin.mark.resolved')}
                          </button>
                          <button
                            onClick={() => {
                              handleUpdateReportStatus(selectedReport.id, 'dismissed', '', 'Report dismissed after investigation');
                              setShowReportModal(false);
                            }}
                            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                          >
                            {t('admin.dismiss.report')}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};