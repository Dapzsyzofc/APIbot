import { useEffect, useState } from 'react';
import { Key, Plus, Trash2, Copy, Check, Loader2, Shield, ShieldOff, AlertCircle } from 'lucide-react';
import ToggleSwitch from '../../components/ToggleSwitch';
import api from '../../lib/api';

export default function ApiKeys() {
    const [keys, setKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [owner, setOwner] = useState('');
    const [creating, setCreating] = useState(false);
    const [copiedId, setCopiedId] = useState(null);

    const fetchKeys = () => {
        setLoading(true);
        api.get('/apikeys')
            .then(res => setKeys(res.data))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchKeys(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!owner.trim()) return;
        setCreating(true);
        try {
            const res = await api.post('/apikeys', { owner: owner.trim() });
            setKeys(prev => [res.data, ...prev]);
            setOwner('');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to create key.');
        } finally {
            setCreating(false);
        }
    };

    const handleToggle = async (id) => {
        try {
            const res = await api.patch(`/apikeys/${id}/toggle`);
            setKeys(prev => prev.map(k => k.id === id ? res.data : k));
        } catch {
            alert('Failed to toggle key.');
        }
    };

    const handleDelete = async (id, ownerName) => {
        if (!confirm(`Delete key for "${ownerName}"? This cannot be undone.`)) return;
        try {
            await api.delete(`/apikeys/${id}`);
            setKeys(prev => prev.filter(k => k.id !== id));
        } catch {
            alert('Failed to delete key.');
        }
    };

    const copyKey = (id, key) => {
        navigator.clipboard.writeText(key);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const activeCount = keys.filter(k => k.isActive).length;
    const disabledCount = keys.filter(k => !k.isActive).length;

    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                        <Key className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">API Key Manager</h1>
                        <p className="text-sm text-dark-400 mt-0.5">Create, manage, and revoke API keys</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="glass-card rounded-2xl p-4 text-center">
                        <p className="text-2xl font-bold text-white">{keys.length}</p>
                        <p className="text-xs text-dark-400 mt-1">Total Keys</p>
                    </div>
                    <div className="glass-card rounded-2xl p-4 text-center">
                        <p className="text-2xl font-bold text-green-400">{activeCount}</p>
                        <p className="text-xs text-dark-400 mt-1">Active</p>
                    </div>
                    <div className="glass-card rounded-2xl p-4 text-center">
                        <p className="text-2xl font-bold text-red-400">{disabledCount}</p>
                        <p className="text-xs text-dark-400 mt-1">Disabled</p>
                    </div>
                </div>

                {/* Generate Key Form */}
                <form onSubmit={handleCreate} className="glass-card rounded-2xl p-5 mb-8">
                    <h2 className="text-sm font-semibold text-dark-200 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-neon-blue" />
                        Generate New API Key
                    </h2>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={owner}
                            onChange={e => setOwner(e.target.value)}
                            placeholder="Owner name (e.g. Bot_WhatsApp_A)"
                            className="input-dark flex-1"
                            required
                        />
                        <button
                            type="submit"
                            disabled={creating || !owner.trim()}
                            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            <span className="flex items-center gap-2">
                                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                                {creating ? 'Creating...' : 'Generate Key'}
                            </span>
                        </button>
                    </div>
                </form>

                {/* Keys Table */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-neon-blue animate-spin" />
                    </div>
                ) : keys.length === 0 ? (
                    <div className="text-center py-20 glass-card rounded-2xl">
                        <AlertCircle className="w-10 h-10 text-dark-400 mx-auto mb-3" />
                        <p className="text-dark-300">No API keys yet. Generate one above.</p>
                    </div>
                ) : (
                    <div className="glass-card rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-dark-400">Owner</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-dark-400">API Key</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-dark-400">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-dark-400 hidden sm:table-cell">Created</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-dark-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {keys.map(k => (
                                        <tr key={k.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    {k.isActive ? (
                                                        <Shield className="w-4 h-4 text-green-400 flex-shrink-0" />
                                                    ) : (
                                                        <ShieldOff className="w-4 h-4 text-red-400 flex-shrink-0" />
                                                    )}
                                                    <span className="text-white font-medium">{k.owner}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <code className="text-xs text-neon-cyan bg-dark-950/50 px-2 py-1 rounded-lg font-mono max-w-[200px] truncate block">
                                                        {k.key}
                                                    </code>
                                                    <button
                                                        onClick={() => copyKey(k.id, k.key)}
                                                        className="p-1 rounded-lg text-dark-400 hover:text-neon-blue hover:bg-neon-blue/10 transition-colors flex-shrink-0"
                                                        title="Copy key"
                                                    >
                                                        {copiedId === k.id ? (
                                                            <Check className="w-3.5 h-3.5 text-green-400" />
                                                        ) : (
                                                            <Copy className="w-3.5 h-3.5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <ToggleSwitch
                                                    checked={k.isActive}
                                                    onChange={() => handleToggle(k.id)}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-dark-400 text-xs hidden sm:table-cell">
                                                {new Date(k.createdAt).toLocaleDateString('id-ID', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={() => handleDelete(k.id, k.owner)}
                                                    className="p-1.5 rounded-lg text-dark-300 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                                    title="Delete key"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
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
