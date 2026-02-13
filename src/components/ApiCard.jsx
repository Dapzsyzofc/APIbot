import { useState } from 'react';
import { ExternalLink, Lock, Unlock, ChevronDown, ChevronUp, Play, Copy, Check, Server, Cpu } from 'lucide-react';
import TryItOut from './TryItOut';

const methodColors = {
    GET: 'badge-green',
    POST: 'badge-blue',
    PUT: 'badge-yellow',
    DELETE: 'badge-red',
    PATCH: 'badge-violet',
};

// Status code icon + color config
const getStatusCodeStyle = (code) => {
    const c = String(code);
    if (c.startsWith('2')) return { icon: '✅', badge: 'sc-green' };
    if (c === '429') return { icon: '⚠️', badge: 'sc-yellow' };
    if (c.startsWith('4')) return { icon: '❌', badge: 'sc-red' };
    if (c.startsWith('5')) return { icon: '❌', badge: 'sc-red' };
    return { icon: 'ℹ️', badge: 'sc-blue' };
};

export default function ApiCard({ api }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showTryIt, setShowTryIt] = useState(false);
    const [copied, setCopied] = useState(false);

    const copyEndpoint = () => {
        const gatewayUrl = `${window.location.origin}/api/gateway/${api.id}`;
        navigator.clipboard.writeText(gatewayUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="glass-card rounded-2xl overflow-hidden">
            {/* Card Header — NO emoji icon, clean text */}
            <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="text-base font-semibold text-white truncate">{api.name}</h3>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className={`badge ${methodColors[api.method] || 'badge-blue'}`}>
                                {api.method}
                            </span>
                            <span className="badge badge-violet">
                                {api.category}
                            </span>
                            {api.apiType === 'local' ? (
                                <span className="badge badge-cyan flex items-center gap-1">
                                    <Cpu className="w-3 h-3" /> Local
                                </span>
                            ) : (
                                <span className="badge badge-blue flex items-center gap-1">
                                    <Server className="w-3 h-3" /> Proxy
                                </span>
                            )}
                            {api.requiresKey ? (
                                <span className="badge badge-yellow flex items-center gap-1">
                                    <Lock className="w-3 h-3" /> API Key
                                </span>
                            ) : (
                                <span className="badge badge-green flex items-center gap-1">
                                    <Unlock className="w-3 h-3" /> Free
                                </span>
                            )}
                        </div>
                    </div>

                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-2 ${api.isActive ? 'bg-green-400 shadow-lg shadow-green-400/30' : 'bg-red-400 shadow-lg shadow-red-400/30'}`}
                        title={api.isActive ? 'Active' : 'Disabled'} />
                </div>

                <p className="text-sm text-dark-300 mt-3 leading-relaxed line-clamp-2">
                    {api.description}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 mt-4">
                    <button
                        onClick={() => setShowTryIt(!showTryIt)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-neon-blue to-neon-violet text-white hover:shadow-lg hover:shadow-neon-blue/20 transition-all duration-300"
                    >
                        <Play className="w-3.5 h-3.5" />
                        Try it out
                    </button>
                    <button
                        onClick={copyEndpoint}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-dark-200 hover:bg-white/10 hover:text-white transition-all duration-300"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied!' : 'Copy URL'}
                    </button>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center justify-center px-2 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-dark-300 hover:bg-white/10 hover:text-white transition-all duration-300"
                    >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="px-5 pb-5 border-t border-white/5 pt-4 animate-slide-down">
                    <div className="space-y-4">
                        {/* Endpoint */}
                        <div>
                            <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Gateway Endpoint</label>
                            <div className="code-block mt-1 flex items-center gap-2">
                                <span className={`badge ${methodColors[api.method]}`}>{api.method}</span>
                                <code className="text-neon-cyan text-xs break-all">/api/gateway/{api.id}</code>
                            </div>
                        </div>

                        {/* Parameters Table */}
                        {api.parameters && api.parameters.length > 0 && (
                            <div>
                                <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Parameters</label>
                                <div className="mt-2 glass rounded-xl overflow-hidden">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="border-b border-white/5">
                                                <th className="px-3 py-2 text-left text-dark-400 font-semibold">Name</th>
                                                <th className="px-3 py-2 text-left text-dark-400 font-semibold">Type</th>
                                                <th className="px-3 py-2 text-left text-dark-400 font-semibold">Status</th>
                                                <th className="px-3 py-2 text-left text-dark-400 font-semibold hidden sm:table-cell">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {api.parameters.map((param, i) => (
                                                <tr key={i} className="border-b border-white/[0.03]">
                                                    <td className="px-3 py-2">
                                                        <code className="text-neon-blue font-semibold">{param.name}</code>
                                                    </td>
                                                    <td className="px-3 py-2 text-dark-300">{param.type}</td>
                                                    <td className="px-3 py-2">
                                                        {(param.status === 'required' || param.required) ? (
                                                            <span className="badge badge-red text-[10px]">required</span>
                                                        ) : (
                                                            <span className="badge badge-green text-[10px]">optional</span>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2 text-dark-400 hidden sm:table-cell">{param.description}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Status Codes Table — Neon Glow Glassmorphism */}
                        {api.statusCodes && api.statusCodes.length > 0 && (
                            <div>
                                <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider">HTTP Status Codes</label>
                                <div className="mt-2 sc-table-glow rounded-xl overflow-hidden">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="border-b border-white/10 bg-white/[0.02]">
                                                <th className="px-3 py-2.5 text-left text-dark-300 font-semibold">Code</th>
                                                <th className="px-3 py-2.5 text-left text-dark-300 font-semibold">Status</th>
                                                <th className="px-3 py-2.5 text-left text-dark-300 font-semibold hidden sm:table-cell">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {api.statusCodes.map((sc, i) => {
                                                const style = getStatusCodeStyle(sc.code);
                                                return (
                                                    <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                                        <td className="px-3 py-2.5">
                                                            <span className={`sc-badge ${style.badge}`}>
                                                                <span className="sc-icon">{style.icon}</span>
                                                                {sc.code}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-2.5 text-dark-200 font-medium">{sc.message}</td>
                                                        <td className="px-3 py-2.5 text-dark-400 hidden sm:table-cell">{sc.description}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Try It Out Panel */}
            {showTryIt && (
                <div className="border-t border-white/5 animate-slide-down">
                    <TryItOut api={api} />
                </div>
            )}
        </div>
    );
}
