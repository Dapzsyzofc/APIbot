import { useState } from 'react';
import { Send, Loader2, CheckCircle2, XCircle, Clock, Upload } from 'lucide-react';
import api from '../lib/api';

export default function TryItOut({ api: apiData }) {
    const [params, setParams] = useState(
        (apiData.parameters || []).filter(p => p.type !== 'file').reduce((acc, p) => ({ ...acc, [p.name]: '' }), {})
    );
    const [apiKey, setApiKey] = useState('');
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [responseTime, setResponseTime] = useState(null);

    const hasFileParam = (apiData.parameters || []).some(p => p.type === 'file');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResponse(null);
        setResponseTime(null);

        const startTime = Date.now();

        try {
            let res;

            if (file) {
                // Use FormData for file upload
                const formData = new FormData();
                formData.append('file', file);
                Object.entries(params).forEach(([key, val]) => {
                    if (val) formData.append(key, val);
                });

                const queryStr = apiData.requiresKey && apiKey ? `?apikey=${apiKey}` : '';
                res = await api.post(`/gateway/${apiData.id}${queryStr}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                // Standard query params request
                const queryParams = { ...params };
                Object.keys(queryParams).forEach(key => {
                    if (!queryParams[key]) delete queryParams[key];
                });
                if (apiData.requiresKey && apiKey) {
                    queryParams.apikey = apiKey;
                }
                res = await api.get(`/gateway/${apiData.id}`, { params: queryParams });
            }

            setResponseTime(Date.now() - startTime);
            setResponse(res.data);
        } catch (err) {
            setResponseTime(Date.now() - startTime);
            setError(err.response?.data || { error: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-5 bg-dark-950/50">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
                <h4 className="text-sm font-semibold text-dark-100">API Playground</h4>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                {/* Parameters */}
                {(apiData.parameters || []).filter(p => p.type !== 'file').map((param, i) => (
                    <div key={i}>
                        <label className="flex items-center gap-2 text-xs text-dark-300 mb-1">
                            <code className="text-neon-blue font-semibold">{param.name}</code>
                            <span className="text-dark-500">{param.type}</span>
                            {(param.status === 'required' || param.required) && <span className="text-red-400">*</span>}
                        </label>
                        <input
                            type="text"
                            value={params[param.name] || ''}
                            onChange={(e) => setParams({ ...params, [param.name]: e.target.value })}
                            placeholder={param.description}
                            className="input-dark text-xs"
                            required={param.status === 'required' || param.required}
                        />
                    </div>
                ))}

                {/* File Upload Input */}
                {hasFileParam && (
                    <div>
                        <label className="flex items-center gap-2 text-xs text-dark-300 mb-1">
                            <code className="text-neon-violet font-semibold">file</code>
                            <span className="text-dark-500">file</span>
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="hidden"
                                id={`file-${apiData.id}`}
                            />
                            <label
                                htmlFor={`file-${apiData.id}`}
                                className="input-dark text-xs cursor-pointer flex items-center gap-2 hover:border-neon-violet/30 transition-colors"
                            >
                                <Upload className="w-4 h-4 text-dark-400" />
                                <span className="text-dark-400">
                                    {file ? file.name : 'Choose image file...'}
                                </span>
                            </label>
                        </div>
                    </div>
                )}

                {/* API Key Input */}
                {apiData.requiresKey && (
                    <div>
                        <label className="flex items-center gap-2 text-xs text-dark-300 mb-1">
                            <code className="text-yellow-400 font-semibold">apikey</code>
                            <span className="text-dark-500">string</span>
                            <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your API key"
                            className="input-dark text-xs"
                            required
                        />
                    </div>
                )}

                {/* Send Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-neon-blue to-neon-violet text-white hover:shadow-lg hover:shadow-neon-blue/20 transition-all duration-300 disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Send className="w-4 h-4" />
                    )}
                    {loading ? 'Sending...' : file ? 'Upload & Process' : 'Send Request'}
                </button>
            </form>

            {/* Response */}
            {(response || error) && (
                <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {error ? (
                                <XCircle className="w-4 h-4 text-red-400" />
                            ) : (
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                            )}
                            <span className={`text-xs font-semibold ${error ? 'text-red-400' : 'text-green-400'}`}>
                                {error ? 'Error' : 'Success'}
                            </span>
                        </div>
                        {responseTime && (
                            <div className="flex items-center gap-1 text-xs text-dark-400">
                                <Clock className="w-3 h-3" />
                                {responseTime}ms
                            </div>
                        )}
                    </div>
                    <pre className="code-block text-xs overflow-x-auto max-h-64 overflow-y-auto">
                        <code className={error ? 'text-red-300' : 'text-green-300'}>
                            {JSON.stringify(error || response, null, 2)}
                        </code>
                    </pre>
                </div>
            )}
        </div>
    );
}
