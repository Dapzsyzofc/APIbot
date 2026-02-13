import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit3, Trash2, Loader2, AlertCircle, Server, Cpu } from 'lucide-react';
import ToggleSwitch from '../../components/ToggleSwitch';
import api from '../../lib/api';

export default function ApiList() {
    const [apis, setApis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const fetchApis = () => {
        setLoading(true);
        api.get('/manage/apis/admin')
            .then(res => setApis(res.data))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchApis(); }, []);

    const handleToggle = async (id, field) => {
        try {
            const res = await api.patch(`/manage/apis/${id}/toggle`, { field });
            setApis(prev => prev.map(a => a.id === id ? res.data : a));
        } catch (err) {
            alert('Failed to toggle.');
        }
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        try {
            await api.delete(`/manage/apis/${id}`);
            setApis(prev => prev.filter(a => a.id !== id));
        } catch (err) {
            alert('Failed to delete.');
        }
    };

    const filtered = apis.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white">API Manager</h1>
                        <p className="text-sm text-dark-400 mt-0.5">{apis.length} registered APIs</p>
                    </div>
                    <Link to="/admin/apis/new" className="btn-primary flex items-center gap-2">
                        <span className="flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Add API
                        </span>
                    </Link>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="input-dark !pl-10"
                        placeholder="Search APIs by name or category..."
                    />
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-neon-blue animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 glass-card rounded-2xl">
                        <AlertCircle className="w-10 h-10 text-dark-400 mx-auto mb-3" />
                        <p className="text-dark-300">No APIs found.</p>
                    </div>
                ) : (
                    <div className="glass-card rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-dark-400">Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-dark-400 hidden sm:table-cell">Category</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-dark-400">Type</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-dark-400">Active</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-dark-400">API Key</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-dark-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(a => (
                                        <tr key={a.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="text-white font-medium">{a.name}</p>
                                                    <p className="text-[11px] text-dark-500 truncate max-w-[200px]">
                                                        {a.apiType === 'local' ? `/handlers/${a.handlerFile}.js` : a.endpoint}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-dark-300 hidden sm:table-cell">{a.category}</td>
                                            <td className="px-4 py-3">
                                                {a.apiType === 'local' ? (
                                                    <span className="badge badge-violet flex items-center gap-1 w-fit">
                                                        <Cpu className="w-3 h-3" /> Local
                                                    </span>
                                                ) : (
                                                    <span className="badge badge-blue flex items-center gap-1 w-fit">
                                                        <Server className="w-3 h-3" /> Proxy
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <ToggleSwitch checked={a.isActive} onChange={() => handleToggle(a.id, 'isActive')} />
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <ToggleSwitch checked={a.requiresKey} onChange={() => handleToggle(a.id, 'requiresKey')} />
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => navigate(`/admin/apis/edit/${a.id}`)}
                                                        className="p-1.5 rounded-lg text-dark-300 hover:text-neon-blue hover:bg-neon-blue/10 transition-colors"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(a.id, a.name)}
                                                        className="p-1.5 rounded-lg text-dark-300 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
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
            </div>
        </div>
    );
}
