import { useEffect, useState } from 'react';
import { Github, Instagram, MessageCircle, Zap, Heart } from 'lucide-react';
import api from '../lib/api';

const socialMeta = {
    whatsapp: { icon: MessageCircle, color: 'hover:text-green-400 hover:bg-green-400/10 hover:border-green-400/30', glow: 'hover:shadow-green-400/20' },
    github: { icon: Github, color: 'hover:text-white hover:bg-white/10 hover:border-white/20', glow: 'hover:shadow-white/10' },
    instagram: { icon: Instagram, color: 'hover:text-pink-400 hover:bg-pink-400/10 hover:border-pink-400/30', glow: 'hover:shadow-pink-400/20' },
};

export default function Footer() {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        api.get('/settings').then(res => setSettings(res.data)).catch(() => { });
    }, []);

    const socials = settings?.socials || {};
    const activeSocials = Object.entries(socials)
        .filter(([_, val]) => val.enabled && val.url)
        .map(([key, val]) => ({ key, url: val.url, ...socialMeta[key] }));

    return (
        <footer className="relative mt-auto border-t border-white/5">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-blue/50 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-violet flex items-center justify-center">
                                <Zap className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-lg font-bold">
                                <span className="gradient-text">API</span>
                                <span className="text-dark-100"> DapzSYZ</span>
                            </span>
                        </div>
                        <p className="text-sm text-dark-300 leading-relaxed max-w-xs">
                            {settings?.footerMotto || 'Platform API Documentation untuk Bot WhatsApp & Telegram. Kelola, uji, dan eksplorasi API dengan mudah.'}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-dark-100 uppercase tracking-wider">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/" className="text-sm text-dark-300 hover:text-neon-blue transition-colors duration-300">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="/docs" className="text-sm text-dark-300 hover:text-neon-blue transition-colors duration-300">
                                    API Documentation
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Connect with Developer */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-dark-100 uppercase tracking-wider">Connect with Developer</h3>
                        <p className="text-sm text-dark-300">Reach out through social media</p>
                        <div className="flex items-center gap-3">
                            {activeSocials.map(social => (
                                <a
                                    key={social.key}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-10 h-10 rounded-xl border border-white/5 bg-white/[0.03] flex items-center justify-center text-dark-300 transition-all duration-300 hover:shadow-lg ${social.color} ${social.glow}`}
                                    title={social.key}
                                >
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-dark-400">
                        © {new Date().getFullYear()} API DapzSYZ. All rights reserved.
                    </p>
                    <p className="text-xs text-dark-400 flex items-center gap-1">
                        {settings?.footerText || <>Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> by DapzSYZ</>}
                    </p>
                </div>
            </div>
        </footer>
    );
}
