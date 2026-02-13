import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Gauge, Code2, Layers, Globe, Database, Terminal } from 'lucide-react';
import StatsCounter from '../components/StatsCounter';
import api from '../lib/api';

const features = [
    {
        icon: Zap,
        title: 'Lightning Fast',
        description: 'API proxy gateway dengan response time minimal. Optimized untuk performansi real-time.',
        gradient: 'from-yellow-500/20 to-orange-500/20',
        iconColor: 'text-yellow-400',
    },
    {
        icon: Shield,
        title: 'Secure by Design',
        description: 'API Key management built-in. Kontrol akses dengan mudah melalui admin dashboard.',
        gradient: 'from-green-500/20 to-emerald-500/20',
        iconColor: 'text-green-400',
    },
    {
        icon: Code2,
        title: 'Interactive Docs',
        description: 'Dokumentasi API interaktif ala Swagger. Test API langsung di browser tanpa tools tambahan.',
        gradient: 'from-neon-blue/20 to-cyan-500/20',
        iconColor: 'text-neon-blue',
    },
    {
        icon: Layers,
        title: 'Multi Category',
        description: 'Organisasikan API berdasarkan kategori: Tools, Games, AI, Downloader, dan banyak lagi.',
        gradient: 'from-neon-violet/20 to-purple-500/20',
        iconColor: 'text-neon-violet',
    },
    {
        icon: Globe,
        title: 'Bot Integration',
        description: 'Dirancang khusus untuk integrasi dengan Bot WhatsApp & Telegram. Copy endpoint, langsung pakai.',
        gradient: 'from-pink-500/20 to-rose-500/20',
        iconColor: 'text-pink-400',
    },
    {
        icon: Gauge,
        title: 'Local Handlers',
        description: 'Buat API custom dengan local handler. Tulis logic sendiri tanpa mengganggu struktur utama.',
        gradient: 'from-cyan-500/20 to-teal-500/20',
        iconColor: 'text-cyan-400',
    },
];

function FloatingParticles() {
    const particles = useMemo(() =>
        Array.from({ length: 20 }, (_, i) => ({
            id: i,
            size: Math.random() * 4 + 1,
            left: Math.random() * 100,
            duration: Math.random() * 20 + 15,
            delay: Math.random() * 10,
            color: ['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'][Math.floor(Math.random() * 4)],
        }))
        , []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map(p => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: `${p.left}%`,
                        backgroundColor: p.color,
                        animationDuration: `${p.duration}s`,
                        animationDelay: `${p.delay}s`,
                    }}
                />
            ))}
        </div>
    );
}

export default function Landing() {
    const [stats, setStats] = useState({ totalApis: 0, categories: 0, activeApis: 0, freeApis: 0 });
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        api.get('/manage/stats').then(res => setStats(res.data)).catch(() => { });
        api.get('/settings').then(res => setSettings(res.data)).catch(() => { });
    }, []);

    return (
        <div className="pt-16">
            {/* Hero Section */}
            <section className="hero-gradient relative min-h-[90vh] flex items-center justify-center px-4">
                <FloatingParticles />

                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-violet/10 rounded-full blur-[120px]" />

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8 animate-fade-in">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs font-medium text-dark-200">Live · API DapzSYZ v2.0</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-6 animate-slide-up">
                        <span className="text-white">Your</span>
                        <span className="gradient-text"> {settings?.heroTitle || 'API DapzSYZ'}</span>
                        <br />
                        <span className="text-white">for </span>
                        <span className="gradient-text-alt">{settings?.heroSubtitle || 'Bot Integration'}</span>
                    </h1>

                    <p className="text-base sm:text-lg text-dark-300 max-w-2xl mx-auto mb-8 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        {settings?.heroDescription || 'Platform lengkap untuk mengelola, mendokumentasikan, dan menguji API WhatsApp & Telegram Bot. Gateway aman dengan API Key management dan dokumentasi interaktif.'}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <Link to="/docs" className="btn-primary group">
                            <span className="flex items-center gap-2">
                                Explore API Docs
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    </div>

                    {/* Code Preview */}
                    <div className="max-w-lg mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <div className="code-block text-left">
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400/70" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                                    <div className="w-3 h-3 rounded-full bg-green-400/70" />
                                </div>
                                <span className="text-[10px] text-dark-500 ml-2">Terminal</span>
                            </div>
                            <div className="space-y-1 text-xs">
                                <p><span className="text-green-400">$</span> <span className="text-dark-300">curl</span> <span className="text-neon-blue">https://api.dapzsyz.com/api/gateway/</span><span className="text-neon-violet">{'<id>'}</span></p>
                                <p className="text-dark-500"># Response:</p>
                                <p className="text-yellow-300">{'{'}</p>
                                <p className="text-white ml-4">"status": <span className="text-green-400">"success"</span>,</p>
                                <p className="text-white ml-4">"data": <span className="text-neon-cyan">{'{ ... }'}</span></p>
                                <p className="text-yellow-300">{'}'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-4 relative">
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    <StatsCounter end={stats.totalApis} label="Total APIs" icon={Database} />
                    <StatsCounter end={stats.categories} label="Categories" icon={Layers} />
                    <StatsCounter end={stats.activeApis} label="Active APIs" icon={Zap} />
                    <StatsCounter end={stats.freeApis} label="Free APIs" icon={Terminal} />
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Powerful <span className="gradient-text">Features</span>
                        </h2>
                        <p className="text-dark-300 max-w-xl mx-auto">
                            Everything you need to manage and serve APIs for your WhatsApp & Telegram bots.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((feat, i) => (
                            <div
                                key={i}
                                className="glass-card rounded-2xl p-6 group"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <feat.icon className={`w-6 h-6 ${feat.iconColor}`} />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{feat.title}</h3>
                                <p className="text-sm text-dark-300 leading-relaxed">{feat.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-3xl mx-auto text-center glass-card rounded-3xl p-10 sm:p-14 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-blue via-neon-violet to-neon-pink" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                        Ready to get started?
                    </h2>
                    <p className="text-dark-300 mb-8 max-w-lg mx-auto">
                        Explore dokumentasi API lengkap untuk mulai mengintegrasikan bot-mu dengan DapzSYZ.
                    </p>
                    <Link to="/docs" className="btn-primary">
                        <span>Browse API Docs</span>
                    </Link>
                </div>
            </section>
        </div>
    );
}
