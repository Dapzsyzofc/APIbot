import { useState, useEffect } from 'react';
import { Save, Loader2, Settings as SettingsIcon, Globe, MessageSquare, Type } from 'lucide-react';
import ToggleSwitch from '../../components/ToggleSwitch';
import api from '../../lib/api';

export default function Settings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [form, setForm] = useState({
        heroTitle: '',
        heroSubtitle: '',
        heroDescription: '',
        footerText: '',
        footerMotto: '',
        socials: {
            whatsapp: { url: '', enabled: true },
            github: { url: '', enabled: true },
            instagram: { url: '', enabled: true },
        },
    });

    useEffect(() => {
        api.get('/settings')
            .then(res => setForm(res.data))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSocial = (platform, field, value) => {
        setForm(prev => ({
            ...prev,
            socials: {
                ...prev.socials,
                [platform]: {
                    ...prev.socials[platform],
                    [field]: value,
                },
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSaved(false);
        try {
            await api.put('/settings', form);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

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
                    <div className="w-10 h-10 rounded-xl bg-neon-violet/10 flex items-center justify-center">
                        <SettingsIcon className="w-5 h-5 text-neon-violet" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Global Settings</h1>
                        <p className="text-sm text-dark-400 mt-0.5">Manage site content and social media links</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Hero Section */}
                    <div className="glass-card rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Type className="w-4 h-4 text-neon-blue" />
                            <h2 className="text-sm font-semibold text-dark-200 uppercase tracking-wider">Hero Section</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-dark-300 mb-1.5">Hero Title</label>
                                <input type="text" value={form.heroTitle} onChange={e => handleChange('heroTitle', e.target.value)} className="input-dark" placeholder="API DapzSYZ" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-dark-300 mb-1.5">Subtitle</label>
                                <input type="text" value={form.heroSubtitle} onChange={e => handleChange('heroSubtitle', e.target.value)} className="input-dark" placeholder="for Bot Integration" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-dark-300 mb-1.5">Description</label>
                            <textarea value={form.heroDescription} onChange={e => handleChange('heroDescription', e.target.value)} className="input-dark min-h-[80px] resize-y" placeholder="Landing page description..." />
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="glass-card rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="w-4 h-4 text-neon-cyan" />
                            <h2 className="text-sm font-semibold text-dark-200 uppercase tracking-wider">Footer</h2>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-dark-300 mb-1.5">Footer Motto</label>
                            <input type="text" value={form.footerMotto} onChange={e => handleChange('footerMotto', e.target.value)} className="input-dark" placeholder="Platform API Documentation..." />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-dark-300 mb-1.5">Footer Copyright Text</label>
                            <input type="text" value={form.footerText} onChange={e => handleChange('footerText', e.target.value)} className="input-dark" placeholder="Made with ❤️ by DapzSYZ" />
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="glass-card rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Globe className="w-4 h-4 text-green-400" />
                            <h2 className="text-sm font-semibold text-dark-200 uppercase tracking-wider">Social Media</h2>
                        </div>

                        {(['whatsapp', 'github', 'instagram']).map(platform => (
                            <div key={platform} className="flex items-center gap-3 p-3 rounded-xl bg-dark-950/50 border border-white/[0.03]">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-semibold text-dark-200 capitalize">{platform}</label>
                                        <ToggleSwitch
                                            checked={form.socials[platform]?.enabled ?? true}
                                            onChange={v => handleSocial(platform, 'enabled', v)}
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={form.socials[platform]?.url || ''}
                                        onChange={e => handleSocial(platform, 'url', e.target.value)}
                                        className="input-dark !py-1.5 text-xs"
                                        placeholder={`${platform} URL...`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Submit */}
                    <div className="flex items-center gap-3 justify-end">
                        {saved && (
                            <span className="text-xs font-semibold text-green-400 animate-pulse">✓ Saved successfully!</span>
                        )}
                        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            <span className="flex items-center gap-2">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {saving ? 'Saving...' : 'Save Settings'}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
