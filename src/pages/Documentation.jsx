import { useEffect, useState } from 'react';
import { BookOpen, WifiOff } from 'lucide-react';
import ApiCard from '../components/ApiCard';
import CategoryFilter from '../components/CategoryFilter';
import api from '../lib/api';

export default function Documentation() {
    const [apis, setApis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchApis();
    }, []);

    const fetchApis = async () => {
        try {
            const res = await api.get('/manage/apis');
            const activeApis = res.data.filter(a => a.isActive);
            setApis(activeApis);
            setCategories([...new Set(activeApis.map(a => a.category))]);
        } catch (err) {
            console.error('Failed to fetch APIs:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredApis = apis.filter(a => {
        // Nested category matching: "ai" matches "ai", "ai/text", "ai/image"
        let matchCategory = activeCategory === 'All';
        if (!matchCategory) {
            matchCategory = a.category === activeCategory || a.category.startsWith(activeCategory + '/');
        }
        const matchSearch = !searchQuery ||
            a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    return (
        <div className="pt-24 pb-16 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-4">
                        <BookOpen className="w-4 h-4 text-neon-blue" />
                        <span className="text-xs font-medium text-dark-200">API Documentation</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                        Explore Our <span className="gradient-text">APIs</span>
                    </h1>
                    <p className="text-dark-300 max-w-xl mx-auto">
                        Browse, test, and integrate APIs into your WhatsApp & Telegram bots.
                        Gunakan playground untuk mencoba API langsung di browser.
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8">
                    <CategoryFilter
                        categories={categories}
                        activeCategory={activeCategory}
                        onCategoryChange={setActiveCategory}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                    />
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-dark-400">
                        Showing <span className="text-white font-semibold">{filteredApis.length}</span> APIs
                        {activeCategory !== 'All' && (
                            <span> in <span className="text-neon-blue">{activeCategory}</span></span>
                        )}
                    </p>
                </div>

                {/* API Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="glass-card rounded-2xl p-6">
                                <div className="skeleton h-5 w-3/4 mb-3" />
                                <div className="skeleton h-4 w-1/2 mb-2" />
                                <div className="skeleton h-12 w-full" />
                            </div>
                        ))}
                    </div>
                ) : filteredApis.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredApis.map(a => (
                            <ApiCard key={a.id} api={a} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 glass-card rounded-2xl">
                        <WifiOff className="w-12 h-12 text-dark-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-dark-200 mb-1">No APIs found</h3>
                        <p className="text-sm text-dark-400">
                            {searchQuery ? 'Try adjusting your search query' : 'No APIs available in this category'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
