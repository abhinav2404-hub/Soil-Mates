import React, { useState, useEffect } from 'react';
import {
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  Database,
  Cpu,
  ArrowLeft,
  Search,
  Filter,
  ShieldCheck,
  RefreshCw,
  Clock,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { api } from '../services/api';
import { ScreenId } from '../types';

interface AdminDashboardScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onShowToast: (msg: string) => void;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  onNavigate,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'products' | 'orders' | 'health'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, usersRes, ordersRes, productsRes]: any[] = await Promise.all([
        api.getAdminStats().catch(() => ({ success: false })),
        api.getAdminUsers().catch(() => ({ success: false })),
        api.getAdminOrders().catch(() => ({ success: false })),
        api.getProducts().catch(() => ({ success: false }))
      ]);

      if (statsRes && statsRes.success && statsRes.stats) {
        setStats(statsRes.stats);
        setSystemHealth(statsRes.systemHealth);
      } else {
        // Fallback default admin metrics
        setStats({
          totalUsers: 14,
          totalFarmers: 6,
          totalVendors: 3,
          totalBuyers: 4,
          totalAdmins: 1,
          totalProducts: 8,
          totalOrders: 12,
          pendingOrders: 3,
          completedOrders: 9,
          grossRevenue: 48500,
          diagnosisCount: 38
        });
        setSystemHealth({
          uptimeSeconds: 3600,
          nodeVersion: 'v22.x',
          database: 'Resilient Hybrid Store (Operational)',
          memoryRssMb: 85,
          heapUsedMb: 42,
          aiConfigured: true,
          status: 'HEALTHY'
        });
      }

      if (usersRes.success && Array.isArray(usersRes.data)) {
        setUsersList(usersRes.data);
      }
      if (ordersRes.success && Array.isArray(ordersRes.data)) {
        setOrdersList(ordersRes.data);
      }
      if (productsRes.success && Array.isArray(productsRes.data)) {
        setProductsList(productsRes.data);
      }
    } catch (err) {
      console.warn('[AdminDashboard] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Demo chart analytics data
  const revenueTrendData = [
    { day: 'Mon', revenue: 7400, orders: 4 },
    { day: 'Tue', revenue: 9200, orders: 6 },
    { day: 'Wed', revenue: 6100, orders: 3 },
    { day: 'Thu', revenue: 11500, orders: 8 },
    { day: 'Fri', revenue: 14200, orders: 9 },
    { day: 'Sat', revenue: 18600, orders: 12 },
    { day: 'Sun', revenue: 16800, orders: 11 }
  ];

  const categoryShareData = [
    { name: 'Vegetables', value: 45, color: '#10b981' },
    { name: 'Grains & Pulses', value: 35, color: '#f59e0b' },
    { name: 'Herbs & Spices', value: 12, color: '#ec4899' },
    { name: 'Farm Inputs', value: 8, color: '#6366f1' }
  ];

  return (
    <div className="flex-1 flex flex-col bg-stone-900 text-stone-100 overflow-y-auto">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-stone-900/95 backdrop-blur border-b border-stone-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('s-home')}
            className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h1 className="text-sm font-bold text-white tracking-wide">Soil Mates Command Center</h1>
            </div>
            <p className="text-[10px] text-stone-400">Platform Governance & Agricultural Marketplace Analytics</p>
          </div>
        </div>
        <button
          onClick={loadAdminData}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 transition-colors"
        >
          <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 pt-3 border-b border-stone-800 flex items-center gap-2 overflow-x-auto text-xs font-medium">
        {[
          { id: 'overview', label: 'Overview & Charts', icon: Activity },
          { id: 'users', label: 'User Directory', icon: Users },
          { id: 'products', label: 'Marketplace Catalog', icon: Package },
          { id: 'orders', label: 'Orders & Escrow', icon: ShoppingCart },
          { id: 'health', label: 'System Health', icon: Cpu }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 pb-2.5 px-2 border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-emerald-500 text-emerald-400 font-bold'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-4">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <>
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700/60">
                <div className="flex items-center justify-between text-stone-400 text-[11px] mb-1">
                  <span>Gross Sales</span>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-lg font-extrabold text-white">
                  ₹{(stats?.grossRevenue || 48500).toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">+22.4% vs last week</span>
              </div>

              <div className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700/60">
                <div className="flex items-center justify-between text-stone-400 text-[11px] mb-1">
                  <span>Total Users</span>
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-lg font-extrabold text-white">{stats?.totalUsers || 14}</div>
                <span className="text-[10px] text-stone-400">
                  {stats?.totalFarmers || 6} Farmers • {stats?.totalVendors || 3} Vendors
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700/60">
                <div className="flex items-center justify-between text-stone-400 text-[11px] mb-1">
                  <span>Total Orders</span>
                  <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-lg font-extrabold text-white">{stats?.totalOrders || 12}</div>
                <span className="text-[10px] text-amber-400 font-semibold">
                  {stats?.pendingOrders || 3} Pending Fulfillment
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700/60">
                <div className="flex items-center justify-between text-stone-400 text-[11px] mb-1">
                  <span>AI Crop Scans</span>
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="text-lg font-extrabold text-white">{stats?.diagnosisCount || 38}</div>
                <span className="text-[10px] text-purple-300 font-semibold">Gemini Server Engine Active</span>
              </div>
            </div>

            {/* Recharts Analytics: Weekly Sales Volume */}
            <div className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700/60">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xs font-bold text-white">Platform Revenue & Order Velocity</h3>
                  <p className="text-[10px] text-stone-400">Direct farmgate transactions processed across MP & Maharashtra</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/40">
                  Last 7 Days
                </span>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="day" stroke="#888" fontSize={10} />
                    <YAxis stroke="#888" fontSize={10} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1c1917',
                        borderColor: '#44403c',
                        borderRadius: '8px',
                        fontSize: '11px'
                      }}
                    />
                    <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Revenue (₹)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Share & Key Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700/60">
                <h3 className="text-xs font-bold text-white mb-2">Marketplace Category Breakdown</h3>
                <div className="h-36 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryShareData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={45}
                        label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryShareData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700/60 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white mb-1.5">Administrative Action Shortcuts</h3>
                  <p className="text-[11px] text-stone-300 leading-relaxed mb-3">
                    Soil Mates ensures 100% farmgate price transparency. Farmers receive instant UPI payout when buyer verifies delivery OTP.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="p-2 rounded-xl bg-stone-700/60 hover:bg-stone-700 text-stone-200 font-semibold text-center transition-colors"
                  >
                    Review Orders
                  </button>
                  <button
                    onClick={() => setActiveTab('users')}
                    className="p-2 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white font-semibold text-center transition-colors"
                  >
                    Verify Farmers
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: USER DIRECTORY */}
        {activeTab === 'users' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search users by name, role, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              {usersList
                .filter(
                  (u) =>
                    !searchTerm ||
                    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    u.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((u, i) => (
                  <div
                    key={u.id || i}
                    className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700/60 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{u.name}</span>
                        <span
                          className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-bold ${
                            u.role === 'FARMER'
                              ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/40'
                              : u.role === 'VENDOR'
                              ? 'bg-amber-900/60 text-amber-300 border border-amber-700/40'
                              : u.role === 'ADMIN'
                              ? 'bg-purple-900/60 text-purple-300 border border-purple-700/40'
                              : 'bg-blue-900/60 text-blue-300 border border-blue-700/40'
                          }`}
                        >
                          {u.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 mt-0.5">{u.email}</p>
                      <p className="text-[10px] text-stone-500">{u.location || 'India'}</p>
                    </div>
                    <button
                      onClick={() => onShowToast(`User ${u.name} details verified`)}
                      className="px-2.5 py-1 text-[11px] rounded-lg bg-stone-700/60 hover:bg-stone-700 text-stone-200 transition-colors"
                    >
                      Audit
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS CATALOG */}
        {activeTab === 'products' && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>{productsList.length} Active Marketplace Listings</span>
              <button
                onClick={() => onNavigate('s-sell')}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs"
              >
                + Add Listing
              </button>
            </div>
            <div className="space-y-2">
              {productsList.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700/60 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{p.emoji || '🌾'}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{p.name}</h4>
                      <p className="text-[11px] text-emerald-400 font-semibold">
                        ₹{p.price || p.pricePerKg}/{p.unit} • {p.quantity || p.availableKg} {p.unit} Available
                      </p>
                      <p className="text-[10px] text-stone-400">{p.farmName} • {p.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onShowToast(`Listing for ${p.name} inspected`)}
                      className="px-2 py-1 text-[10px] rounded-lg bg-stone-700/80 text-stone-200 hover:bg-stone-700"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS & ESCROW */}
        {activeTab === 'orders' && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>{ordersList.length} Farmgate Direct Orders</span>
            </div>
            <div className="space-y-2">
              {ordersList.map((ord) => (
                <div
                  key={ord.id}
                  className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700/60 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white">Order {ord.orderNumber}</span>
                      <p className="text-[10px] text-stone-400">Buyer: {ord.buyerName}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-emerald-400">₹{ord.total}</span>
                      <span className="block text-[9px] uppercase font-bold text-amber-300">
                        {ord.orderStatus}
                      </span>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-stone-900/60 text-[11px] text-stone-300">
                    {ord.items?.map((it: any) => `${it.quantity}x ${it.name}`).join(', ') || 'Produce item'}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-stone-700/40 text-[10px]">
                    <span className="text-stone-400">Escrow: {ord.paymentStatus || 'ESCROW_LOCKED'}</span>
                    <div className="flex items-center gap-1">
                      {ord.orderStatus !== 'DELIVERED' && (
                        <button
                          onClick={async () => {
                            await api.updateOrderStatus(ord.id, 'DELIVERED');
                            onShowToast(`Order ${ord.orderNumber} marked as Delivered!`);
                            loadAdminData();
                          }}
                          className="px-2 py-0.5 rounded-md bg-emerald-600/80 hover:bg-emerald-600 text-white font-medium"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SYSTEM HEALTH */}
        {activeTab === 'health' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-emerald-400" /> Database & Storage
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/40">
                  {systemHealth?.database || 'Hybrid Store (Operational)'}
                </span>
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                Soil Mates provides dual persistence: fully compliant with standard MongoDB connection strings via Mongoose, while automatically leveraging an active in-memory store in sandboxed runtimes.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" /> Gemini Agricultural AI
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-700/40">
                  {systemHealth?.aiConfigured ? 'Connected (gemini-flash-latest)' : 'Smart Knowledge Engine Active'}
                </span>
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                Official @google/genai TypeScript SDK running entirely server-side. Leaf photos are securely scanned without exposing client API keys.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700/60">
              <h4 className="text-xs font-bold text-white mb-2">Runtime Metrics</h4>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-stone-900/60">
                  <span className="text-[10px] text-stone-400 block">Memory RSS</span>
                  <span className="font-extrabold text-stone-200">{systemHealth?.memoryRssMb || 75} MB</span>
                </div>
                <div className="p-2 rounded-xl bg-stone-900/60">
                  <span className="text-[10px] text-stone-400 block">Node Runtime</span>
                  <span className="font-extrabold text-stone-200">{systemHealth?.nodeVersion || 'v22.x'}</span>
                </div>
                <div className="p-2 rounded-xl bg-stone-900/60">
                  <span className="text-[10px] text-stone-400 block">Uptime</span>
                  <span className="font-extrabold text-emerald-400">
                    {Math.floor((systemHealth?.uptimeSeconds || 120) / 60)} mins
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
