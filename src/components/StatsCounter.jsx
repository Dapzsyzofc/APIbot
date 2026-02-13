import { useEffect, useRef, useState } from 'react';

export default function StatsCounter({ end, duration = 2000, label, icon: Icon }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    let start = 0;
                    const increment = end / (duration / 16);
                    const timer = setInterval(() => {
                        start += increment;
                        if (start >= end) {
                            setCount(end);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(start));
                        }
                    }, 16);
                    return () => clearInterval(timer);
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, duration, hasAnimated]);

    return (
        <div ref={ref} className="glass-card rounded-2xl p-6 text-center group">
            {Icon && (
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-violet/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-neon-blue" />
                </div>
            )}
            <div className="text-3xl sm:text-4xl font-extrabold gradient-text mb-1">
                {count}+
            </div>
            <div className="text-xs sm:text-sm text-dark-300 font-medium uppercase tracking-wider">
                {label}
            </div>
        </div>
    );
}
