import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Database, Key, Zap, Plus, List, Loader2, Cpu, Settings } from 'lucide-react';
import api from '../../lib/api';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [recentApis, setRecentApis] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get('/manage/stats'),
            api.get('/manage/apis/admin'),
        ]).then(([statsRes, apisRes]) => {
            setStats(statsRes.data);
            const sorted = apisRes.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            setRecentApis(sorted.slice(0, 5));
        }).finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-16">
                <Loader2 className="w-8 h-8 text-neon-blue animate-spin" />
            </div>
        );
    }

    const statCards = [
        { label: 'Total APIs', value: stats?.totalApis || 0, icon: Database, color: 'from-neon-blue/20 to-cyan-500/20', iconColor: 'text-neon-blue' },
        { label: 'Active', value: stats?.activeApis || 0, icon: Zap, color: 'from-green-500/20 to-emerald-500/20', iconColor: 'text-green-400' },
        { label: 'With Key', value: stats?.withKey || 0, icon: Key, color: 'from-yellow-500/20 to-orange-500/20', iconColor: 'text-yellow-400' },
        { label: 'Categories', value: stats?.categories || 0, icon: BarChart3, color: 'from-neon-violet/20 to-purple-500/20', iconColor: 'text-neon-violet' },
        { label: 'Local Handlers', value: stats?.localHandlers || 0, icon: Cpu, color: 'from-pink-500/20 to-rose-500/20', iconColor: 'text-pink-400' },
    ];

    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                        <p className="text-sm text-dark-400 mt-0.5">API DapzSYZ Admin Panel</p>
                    </div>
                    <Link to="/admin/apis/new" className="btn-primary flex items-center gap-2">
                        <span className="flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Add API
                        </span>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                    {statCards.map((stat, i) => (
                        <div key={i} className="glass-card rounded-2xl p-5">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                            </div>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <p className="text-xs text-dark-400 mt-0.5">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Link to="/admin/apis" className="glass-card rounded-2xl p-5 flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-xl bg-neon-blue/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <List className="w-6 h-6 text-neon-blue" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white">Manage APIs</h3>
                            <p className="text-xs text-dark-400">View, edit, and delete APIs</p>
                        </div>
                    </Link>
                    <Link to="/admin/apis/new" className="glass-card rounded-2xl p-5 flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-xl bg-neon-violet/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Plus className="w-6 h-6 text-neon-violet" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white">Add New API</h3>
                            <p className="text-xs text-dark-400">Register a new endpoint</p>
                        </div>
                    </Link>
                    <Link to="/admin/apikeys" className="glass-card rounded-2xl p-5 flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Key className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white">API Keys</h3>
                            <p className="text-xs text-dark-400">Create & manage keys</p>
                        </div>
                    </Link>
                    <Link to="/admin/settings" className="glass-card rounded-2xl p-5 flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Settings className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white">Global Settings</h3>
                            <p className="text-xs text-dark-400">Site content & socials</p>
                        </div>
                    </Link>
                </div>

                {/* Recent APIs */}
                <div className="glass-card rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-white/5">
                        <h2 className="text-sm font-semibold text-white">Recent APIs</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-dark-400">Name</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-dark-400">Category</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-dark-400">Type</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-dark-400">Method</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-dark-400">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentApis.map(a => (
                                    <tr key={a.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                        <td className="px-5 py-3 text-white font-medium">{a.name}</td>
                                        <td className="px-5 py-3 text-dark-300">{a.category}</td>
                                        <td className="px-5 py-3">
                                            <span className={`badge ${a.apiType === 'local' ? 'badge-violet' : 'badge-blue'}`}>
                                                {a.apiType === 'local' ? 'Local' : 'Proxy'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="badge badge-blue">{a.method}</span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className={`w-2.5 h-2.5 rounded-full ${a.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
