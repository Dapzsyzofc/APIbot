import { Search, Filter, ChevronRight } from 'lucide-react';

/**
 * Supports nested categories like "ai/text", "ai/image".
 * Shows parent-level pills + sub-pills when a parent is selected.
 */
export default function CategoryFilter({ categories, activeCategory, onCategoryChange, searchQuery, onSearchChange }) {
    // Build hierarchy from flat category list
    const hierarchy = {};
    categories.forEach(cat => {
        const parts = cat.split('/');
        const parent = parts[0];
        if (!hierarchy[parent]) hierarchy[parent] = [];
        if (parts.length > 1) {
            hierarchy[parent].push(cat); // full path
        }
    });

    const parentCategories = Object.keys(hierarchy);
    const activeParent = activeCategory === 'All' ? null : activeCategory.split('/')[0];

    // Get sub-categories for the active parent
    const subCategories = activeParent ? (hierarchy[activeParent] || []) : [];

    return (
        <div className="space-y-3">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search APIs..."
                    className="input-dark pl-11"
                />
            </div>

            {/* Parent Category Pills */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => onCategoryChange('All')}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300
                    ${activeCategory === 'All'
                            ? 'bg-gradient-to-r from-neon-blue to-neon-violet text-white shadow-lg shadow-neon-blue/20'
                            : 'bg-white/5 text-dark-300 hover:bg-white/10 hover:text-white border border-white/5'}`}
                >
                    <span className="flex items-center gap-1.5">
                        <Filter className="w-3 h-3" />
                        All
                    </span>
                </button>
                {parentCategories.map(parent => {
                    const isActive = activeCategory === parent || activeCategory.startsWith(parent + '/');
                    const hasChildren = hierarchy[parent].length > 0;
                    return (
                        <button
                            key={parent}
                            onClick={() => onCategoryChange(parent)}
                            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-1
                            ${isActive
                                    ? 'bg-gradient-to-r from-neon-blue to-neon-violet text-white shadow-lg shadow-neon-blue/20'
                                    : 'bg-white/5 text-dark-300 hover:bg-white/10 hover:text-white border border-white/5'}`}
                        >
                            {parent}
                            {hasChildren && <ChevronRight className="w-3 h-3 opacity-50" />}
                        </button>
                    );
                })}
            </div>

            {/* Sub-category Pills (when parent has children) */}
            {subCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 pl-2">
                    <span className="text-[10px] text-dark-500 self-center mr-1">└</span>
                    {subCategories.map(sub => {
                        const label = sub.split('/').slice(1).join('/');
                        const isActive = activeCategory === sub;
                        return (
                            <button
                                key={sub}
                                onClick={() => onCategoryChange(sub)}
                                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-300
                                ${isActive
                                        ? 'bg-neon-violet/20 text-neon-violet border border-neon-violet/30'
                                        : 'bg-white/[0.03] text-dark-400 hover:bg-white/5 hover:text-dark-200 border border-white/5'}`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
