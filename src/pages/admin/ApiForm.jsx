import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash2, Loader2 } from 'lucide-react';
import ToggleSwitch from '../../components/ToggleSwitch';
import api from '../../lib/api';

const methodOptions = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

export default function ApiForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);
    const [showCatSuggestions, setShowCatSuggestions] = useState(false);

    const [form, setForm] = useState({
        name: '',
        endpoint: '',
        category: '',
        description: '',
        method: 'GET',
        requiresKey: false,
        apiType: 'proxy',
        handlerFile: '',
        parameters: [],
        statusCodes: [],
    });

    // Load existing categories for autocomplete
    useEffect(() => {
        api.get('/manage/categories')
            .then(res => setCategories(res.data))
            .catch(() => { });
    }, []);

    // Load API data for edit mode
    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            api.get(`/manage/apis/${id}`)
                .then(res => {
                    setForm({
                        name: res.data.name || '',
                        endpoint: res.data.endpoint || '',
                        category: res.data.category || '',
                        description: res.data.description || '',
                        method: res.data.method || 'GET',
                        requiresKey: res.data.requiresKey || false,
                        apiType: res.data.apiType || 'proxy',
                        handlerFile: res.data.handlerFile || '',
                        parameters: res.data.parameters || [],
                        statusCodes: res.data.statusCodes || [],
                    });
                })
                .finally(() => setLoading(false));
        }
    }, [id, isEdit]);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    // Parameters CRUD
    const addParameter = () => {
        setForm(prev => ({
            ...prev,
            parameters: [...prev.parameters, { name: '', type: 'string', status: 'required', description: '' }],
        }));
    };

    const updateParameter = (index, field, value) => {
        setForm(prev => ({
            ...prev,
            parameters: prev.parameters.map((p, i) => i === index ? { ...p, [field]: value } : p),
        }));
    };

    const removeParameter = (index) => {
        setForm(prev => ({
            ...prev,
            parameters: prev.parameters.filter((_, i) => i !== index),
        }));
    };

    // Status Codes CRUD
    const addStatusCode = () => {
        setForm(prev => ({
            ...prev,
            statusCodes: [...prev.statusCodes, { code: '', message: '', description: '' }],
        }));
    };

    const updateStatusCode = (index, field, value) => {
        setForm(prev => ({
            ...prev,
            statusCodes: prev.statusCodes.map((sc, i) => i === index ? { ...sc, [field]: value } : sc),
        }));
    };

    const removeStatusCode = (index) => {
        setForm(prev => ({
            ...prev,
            statusCodes: prev.statusCodes.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (isEdit) {
                await api.put(`/manage/apis/${id}`, form);
            } else {
                await api.post('/manage/apis', form);
            }
            navigate('/admin/apis');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to save.');
        } finally {
            setSaving(false);
        }
    };

    const filteredCategories = categories.filter(c =>
        c.toLowerCase().includes(form.category.toLowerCase()) && c.toLowerCase() !== form.category.toLowerCase()
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-16">
                <Loader2 className="w-8 h-8 text-neon-blue animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <button onClick={() => navigate('/admin/apis')} className="p-2 rounded-xl text-dark-300 hover:text-white hover:bg-white/5 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit API' : 'Add New API'}</h1>
                        <p className="text-sm text-dark-400 mt-0.5">Configure endpoint details and documentation</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="glass-card rounded-2xl p-6 space-y-4">
                        <h2 className="text-sm font-semibold text-dark-200 uppercase tracking-wider mb-2">Basic Information</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-dark-300 mb-1.5">API Name *</label>
                                <input type="text" value={form.name} onChange={e => handleChange('name', e.target.value)} className="input-dark" placeholder="e.g. Remove Background" required />
                            </div>

                            {/* Category — text input with autocomplete */}
                            <div className="relative">
                                <label className="block text-xs font-medium text-dark-300 mb-1.5">Category *</label>
                                <input
                                    type="text"
                                    value={form.category}
                                    onChange={e => { handleChange('category', e.target.value); setShowCatSuggestions(true); }}
                                    onFocus={() => setShowCatSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowCatSuggestions(false), 200)}
                                    className="input-dark"
                                    placeholder="Type or select category"
                                    required
                                />
                                {showCatSuggestions && filteredCategories.length > 0 && (
                                    <div className="absolute z-20 top-full left-0 right-0 mt-1 glass rounded-xl border border-white/10 shadow-xl overflow-hidden">
                                        {filteredCategories.map(cat => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => { handleChange('category', cat); setShowCatSuggestions(false); }}
                                                className="block w-full text-left px-3 py-2 text-sm text-dark-200 hover:bg-white/5 hover:text-white transition-colors"
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-dark-300 mb-1.5">Description</label>
                            <textarea value={form.description} onChange={e => handleChange('description', e.target.value)} className="input-dark min-h-[80px] resize-y" placeholder="Describe what this API does..." />
                        </div>
                    </div>

                    {/* API Type & Endpoint */}
                    <div className="glass-card rounded-2xl p-6 space-y-4">
                        <h2 className="text-sm font-semibold text-dark-200 uppercase tracking-wider mb-2">API Configuration</h2>

                        {/* Api Type Toggle */}
                        <div>
                            <label className="block text-xs font-medium text-dark-300 mb-2">API Type</label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleChange('apiType', 'proxy')}
                                    className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all duration-300 ${form.apiType === 'proxy'
                                            ? 'bg-neon-blue/10 border-neon-blue/30 text-neon-blue shadow-lg shadow-neon-blue/10'
                                            : 'bg-white/[0.03] border-white/10 text-dark-300 hover:bg-white/5'
                                        }`}
                                >
                                    🌐 Proxy
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleChange('apiType', 'local')}
                                    className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all duration-300 ${form.apiType === 'local'
                                            ? 'bg-neon-violet/10 border-neon-violet/30 text-neon-violet shadow-lg shadow-neon-violet/10'
                                            : 'bg-white/[0.03] border-white/10 text-dark-300 hover:bg-white/5'
                                        }`}
                                >
                                    ⚡ Local Handler
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {form.apiType === 'proxy' ? (
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-medium text-dark-300 mb-1.5">Endpoint URL *</label>
                                    <input type="url" value={form.endpoint} onChange={e => handleChange('endpoint', e.target.value)} className="input-dark" placeholder="https://api.example.com/endpoint" required={form.apiType === 'proxy'} />
                                </div>
                            ) : (
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-medium text-dark-300 mb-1.5">Handler File Name *</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-dark-500">/handlers/</span>
                                        <input type="text" value={form.handlerFile} onChange={e => handleChange('handlerFile', e.target.value)} className="input-dark flex-1" placeholder="e.g. image-ai" required={form.apiType === 'local'} />
                                        <span className="text-xs text-dark-500">.js</span>
                                    </div>
                                    <p className="text-[10px] text-dark-500 mt-1">File must exist in /server/handlers/ and export a function(req, res)</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-medium text-dark-300 mb-1.5">Method</label>
                                <select value={form.method} onChange={e => handleChange('method', e.target.value)} className="input-dark">
                                    {methodOptions.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-dark-300">Requires API Key</label>
                                <ToggleSwitch checked={form.requiresKey} onChange={v => handleChange('requiresKey', v)} />
                            </div>
                        </div>
                    </div>

                    {/* Parameters */}
                    <div className="glass-card rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-dark-200 uppercase tracking-wider">Parameters</h2>
                            <button type="button" onClick={addParameter} className="flex items-center gap-1 text-xs font-semibold text-neon-blue hover:text-neon-cyan transition-colors">
                                <Plus className="w-3.5 h-3.5" /> Add
                            </button>
                        </div>

                        {form.parameters.length === 0 && (
                            <p className="text-xs text-dark-500 text-center py-4">No parameters added yet.</p>
                        )}

                        <div className="space-y-3">
                            {form.parameters.map((param, i) => (
                                <div key={i} className="grid grid-cols-12 gap-2 items-start p-3 rounded-xl bg-dark-950/50 border border-white/[0.03]">
                                    <div className="col-span-3">
                                        <input type="text" value={param.name} onChange={e => updateParameter(i, 'name', e.target.value)} className="input-dark !py-1.5 text-xs" placeholder="name" />
                                    </div>
                                    <div className="col-span-2">
                                        <select value={param.type} onChange={e => updateParameter(i, 'type', e.target.value)} className="input-dark !py-1.5 text-xs">
                                            <option value="string">String</option>
                                            <option value="number">Number</option>
                                            <option value="file">File</option>
                                            <option value="boolean">Boolean</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <select value={param.status || (param.required ? 'required' : 'optional')} onChange={e => updateParameter(i, 'status', e.target.value)} className="input-dark !py-1.5 text-xs">
                                            <option value="required">Required</option>
                                            <option value="optional">Optional</option>
                                        </select>
                                    </div>
                                    <div className="col-span-4">
                                        <input type="text" value={param.description} onChange={e => updateParameter(i, 'description', e.target.value)} className="input-dark !py-1.5 text-xs" placeholder="Description" />
                                    </div>
                                    <div className="col-span-1 flex justify-end">
                                        <button type="button" onClick={() => removeParameter(i)} className="p-1.5 text-dark-400 hover:text-red-400 transition-colors">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Status Codes */}
                    <div className="glass-card rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-dark-200 uppercase tracking-wider">HTTP Status Codes</h2>
                            <button type="button" onClick={addStatusCode} className="flex items-center gap-1 text-xs font-semibold text-neon-blue hover:text-neon-cyan transition-colors">
                                <Plus className="w-3.5 h-3.5" /> Add
                            </button>
                        </div>

                        {form.statusCodes.length === 0 && (
                            <p className="text-xs text-dark-500 text-center py-4">No status codes added yet.</p>
                        )}

                        <div className="space-y-3">
                            {form.statusCodes.map((sc, i) => (
                                <div key={i} className="grid grid-cols-12 gap-2 items-start p-3 rounded-xl bg-dark-950/50 border border-white/[0.03]">
                                    <div className="col-span-2">
                                        <input type="text" value={sc.code} onChange={e => updateStatusCode(i, 'code', e.target.value)} className="input-dark !py-1.5 text-xs" placeholder="200" />
                                    </div>
                                    <div className="col-span-3">
                                        <input type="text" value={sc.message} onChange={e => updateStatusCode(i, 'message', e.target.value)} className="input-dark !py-1.5 text-xs" placeholder="Success" />
                                    </div>
                                    <div className="col-span-6">
                                        <input type="text" value={sc.description} onChange={e => updateStatusCode(i, 'description', e.target.value)} className="input-dark !py-1.5 text-xs" placeholder="Request berhasil" />
                                    </div>
                                    <div className="col-span-1 flex justify-end">
                                        <button type="button" onClick={() => removeStatusCode(i)} className="p-1.5 text-dark-400 hover:text-red-400 transition-colors">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center gap-3 justify-end">
                        <button type="button" onClick={() => navigate('/admin/apis')} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-dark-300 hover:text-white hover:bg-white/5 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            <span className="flex items-center gap-2">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {saving ? 'Saving...' : isEdit ? 'Update API' : 'Create API'}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
