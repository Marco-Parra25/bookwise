import React, { useMemo, useState, useEffect, useRef } from 'react';

const BIOMES = [
    {
        name: "Bosque Ancestral",
        start: 1, end: 5,
        bg: "https://images.unsplash.com/photo-1448375240586-dfd8f3793300?auto=format&fit=crop&w=1920&q=80",
        color: "#2ecc71", accent: "#27ae60", icon: "🌲",
        weather: "fireflies",
        ambient: "fairies"
    },
    {
        name: "Ruinas Olvidadas",
        start: 6, end: 10,
        bg: "https://images.unsplash.com/photo-1599593257608-8e6bf7656910?auto=format&fit=crop&w=1920&q=80",
        color: "#d35400", accent: "#e67e22", icon: "🔥",
        weather: "embers",
        ambient: "dragon"
    },
    {
        name: "Tundra de Cristal",
        start: 11, end: 15,
        bg: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1920&q=80",
        color: "#6c5ce7", accent: "#a29bfe", icon: "💎",
        weather: "snow",
        ambient: "aurora"
    },
    {
        name: "Reino de los Cielos",
        start: 16, end: 99,
        bg: "https://images.unsplash.com/photo-1506259091721-347f793bb76d?auto=format&fit=crop&w=1920&q=80",
        color: "#0984e3", accent: "#74b9ff", icon: "🏰",
        weather: "clouds",
        ambient: "airships"
    },
];

const EMPTY_ARRAY = [];

export default function WorldMap({
    level,
    xp,
    xpToNextLevel,
    booksRead = 0,
    history = EMPTY_ARRAY,
    avatar = "🧙‍♂️"
}) {
    // --- v5.0 GOD TIER: HYPER-IMMERSIVE 3D ENGINE ---

    // Progression Logic
    const progressionLevel = (booksRead || 0) + 1;
    const currentBiome = BIOMES.find(b => progressionLevel >= b.start && progressionLevel <= b.end) || BIOMES[BIOMES.length - 1];
    const LEVELS_PER_SCREEN = 5;
    const currentScreenIndex = Math.floor((progressionLevel - 1) / LEVELS_PER_SCREEN);
    const startLevelView = (currentScreenIndex * LEVELS_PER_SCREEN) + 1;

    // 3D Tilt State
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        // Calculate tilt: -10deg to 10deg range
        const tiltX = (0.5 - y) * 20;
        const tiltY = (x - 0.5) * 20;
        setTilt({ x: tiltX, y: tiltY });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 5, y: 0 }); // Reset to a cinematic slight angle
    };

    // Generate Volumetric Nodes
    const nodes = useMemo(() => {
        // DEBUG: Check history
        console.log("WM: History Length:", history.length);
        if (history.length > 0) console.log("WM: First History Item:", history[0]);

        const list = [];
        for (let i = startLevelView; i < startLevelView + LEVELS_PER_SCREEN; i++) {
            const relativeIndex = i - startLevelView;
            const isBoss = i % 5 === 0;
            const bookData = history[i - 1]; // Level 1 is index 0

            // DEBUG: Check mapping
            if (i <= progressionLevel && !bookData && i < history.length + 1) {
                console.warn(`WM: Missing book data for Level ${i} (Index ${i - 1})`);
            }

            // S-Curve Generation for path
            const xBase = 50;
            const xOffset = Math.sin(relativeIndex * 1.5) * 35;

            list.push({
                level: i,
                x: xBase + xOffset,
                y: 85 - (relativeIndex * 18), // Spread out vertically
                locked: i > progressionLevel,
                current: i === progressionLevel,
                completed: i < progressionLevel,
                isBoss,
                book: bookData ? bookData.title : null
            });
        }
        return list;
    }, [progressionLevel, startLevelView, history]);

    // Particle System (Optimized)
    const [particles, setParticles] = useState([]);
    useEffect(() => {
        const count = currentBiome.weather === 'snow' ? 50 : 25;
        const newParticles = Array.from({ length: count }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            size: Math.random() * 3 + 1,
            speed: Math.random() * 5 + 5,
            delay: Math.random() * -10
        }));
        setParticles(newParticles);
    }, [currentBiome]);

    return (
        <div
            ref={containerRef}
            className="group relative w-full h-[650px] perspective-[1200px] overflow-visible mb-16 select-none cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* 3D BOARD CONTAINER */}
            <div className="relative w-full h-full rounded-3xl transition-transform duration-700 transform-style-3d rotate-x-10 shadow-2xl border-[6px] bg-white dark:bg-gray-900 overflow-hidden"
                style={{
                    borderColor: currentBiome.color,
                    transform: 'rotateX(20deg) scale(0.95)',
                    boxShadow: `0 25px 50px -12px ${currentBiome.color}40`
                }}>

                {/* --- LAYER 1: 3D BACKGROUND PARALLAX --- */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-110"
                    style={{
                        backgroundImage: `url(${currentBiome.bg})`,
                        backgroundColor: currentBiome.color // Fallback color if image fails
                    }}
                >
                    {/* Light Overlay for blending */}
                    <div className="absolute inset-0 bg-current opacity-10 mix-blend-overlay"></div>

                    {/* Vignette - Reduced opacity for better visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/60 dark:from-black/80 via-transparent to-white/20 dark:to-black/40"></div>
                </div>

                {/* 2. AMBIENT CREATURES LAYER */}
                <div className="absolute inset-0 overflow-hidden transform-style-3d pointer-events-none z-0">
                    {currentBiome.ambient === 'dragon' && (
                        <div className="absolute top-10 -right-20 w-32 h-32 animate-float-slow opacity-60 mix-blend-screen"
                            style={{ transform: 'translateZ(50px)' }}>
                            🐉
                        </div>
                    )}
                    {currentBiome.ambient === 'airships' && (
                        <div className="absolute top-20 left-10 text-6xl animate-float opacity-80"
                            style={{ transform: 'translateZ(80px)' }}>
                            🛸
                        </div>
                    )}
                </div>

                {/* 3. TERRAIN & PATH LAYER */}
                <div className="absolute inset-0 z-10 transform-style-3d" style={{ transform: 'translateZ(30px)' }}>
                    <svg className="w-full h-full overflow-visible" style={{ filter: 'drop-shadow(0 10px 5px rgba(0,0,0,0.5))' }}>
                        <defs>
                            <linearGradient id="pathGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                                <stop offset="0%" stopColor={currentBiome.color} stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#fff" stopOpacity="1" />
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        {nodes.map((node, index) => {
                            if (index === nodes.length - 1) return null;
                            const next = nodes[index + 1];
                            const isActive = !node.locked && !next.locked;
                            return (
                                <g key={`path-${index}`}>
                                    {/* Shadow Path */}
                                    <path
                                        d={`M ${node.x} ${node.y} C ${node.x} ${node.y - 15}, ${next.x} ${next.y + 15}, ${next.x} ${next.y}`}
                                        stroke="black"
                                        strokeWidth="8"
                                        fill="none"
                                        opacity="0.5"
                                        transform="translate(0, 5)"
                                    />
                                    {/* Main Path */}
                                    <path
                                        d={`M ${node.x} ${node.y} C ${node.x} ${node.y - 15}, ${next.x} ${next.y + 15}, ${next.x} ${next.y}`}
                                        stroke={isActive ? "url(#pathGradient)" : "#4b5563"}
                                        strokeWidth={isActive ? "6" : "3"}
                                        strokeDasharray={isActive ? "none" : "8,4"}
                                        fill="none"
                                        strokeLinecap="round"
                                        className={isActive ? "animate-pulse-slow" : ""}
                                        filter={isActive ? "url(#glow)" : ""}
                                    />
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* 4. VOLUMETRIC NODES LAYER */}
                <div className="absolute inset-0 z-20 transform-style-3d">
                    {nodes.map((node) => (
                        <div
                            key={node.level}
                            className="absolute transform-style-3d group/node"
                            style={{
                                left: `${node.x}%`,
                                top: `${node.y}%`,
                                transform: `translate(-50%, -50%) translateZ(${node.current ? 80 : 40}px)`,
                                zIndex: node.level
                            }}
                        >
                            {/* VOLUMETRIC STACK (Pseudo-3D) */}
                            <div className="relative transform-style-3d transition-transform duration-500 hover:scale-110 cursor-pointer">

                                {/* Base Shadow */}
                                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-16 h-8 bg-black/60 blur-md rounded-[100%]"></div>

                                {/* Layer 1: Base Pillar */}
                                <div className={`w-16 h-16 rounded-xl border-b-[6px] transform rotate-45 transition-colors duration-300
                                    ${node.locked ? 'bg-gray-800 border-gray-900' : 'bg-gray-700 border-gray-900'}
                                `}></div>

                                {/* Layer 2: Platform Top */}
                                <div className={`absolute -top-2 left-0 w-16 h-16 rounded-xl transform rotate-45 border-4 transition-all duration-300 flex items-center justify-center
                                    ${node.locked
                                        ? 'bg-gray-800 border-gray-600 grayscale opacity-80'
                                        : node.current
                                            ? 'bg-white border-yellow-400 shadow-[0_0_30px_rgba(255,255,255,0.6)] animate-bounce-subtle'
                                            : `bg-[${currentBiome.accent}] border-[${currentBiome.color}]`
                                    }
                                `}
                                    style={{ backgroundColor: !node.locked && !node.current ? currentBiome.accent : undefined }}
                                >
                                    {/* Icon / Number */}
                                    <div className={`transform -rotate-45 font-black text-xl 
                                        ${node.locked ? 'text-gray-500' : node.current ? 'text-black' : 'text-white'}
                                    `}>
                                        {node.isBoss ? '🏰' : node.level}
                                    </div>
                                </div>

                                {/* Floating Rewards / Status */}
                                {node.completed && !node.isBoss && (
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-green-500 text-white text-[9px] font-bold rounded-full shadow-lg transform translate-Z(20px) animate-float">
                                        LEÍDO
                                    </div>
                                )}
                            </div>

                            {/* AVATAR (If Current) */}
                            {node.current && (
                                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-24 h-24 transform-style-3d animate-float-fast pointer-events-none"
                                    style={{ transform: 'translateZ(60px) translateX(-50%)' }}>
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <div className="text-6xl filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                                            {avatar?.startsWith('http') ? (
                                                <img src={avatar} className="w-16 h-16 rounded-2xl border-2 border-white shadow-xl" />
                                            ) : avatar}
                                        </div>
                                        {/* Avatar Aura */}
                                        <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            )}

                            {/* PERMANENT LABEL (Book Title) */}
                            {node.book && (
                                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-40 opacity-100 transition-all duration-300 transform"
                                    style={{ transform: 'translateZ(100px) translateX(-50%)' }}>
                                    <div className="bg-black/60 text-white px-3 py-2 rounded-xl border border-white/10 shadow-xl backdrop-blur-[2px] text-center hover:scale-110 hover:bg-black/80 transition-all cursor-help">
                                        <div className="text-[7px] text-yellow-500 uppercase font-bold tracking-widest mb-0.5">Nivel {node.level}</div>
                                        <div className="text-[9px] font-bold leading-tight line-clamp-2 text-gray-200">{node.book}</div>
                                    </div>
                                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-black/60 mx-auto"></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* 5. WEATHER & PARTICLES LAYER (Foreground) */}
                <div className="absolute inset-0 pointer-events-none z-30 transform-style-3d overflow-hidden rounded-[2.5rem]" style={{ transform: 'translateZ(60px)' }}>
                    {particles.map(p => (
                        <div
                            key={p.id}
                            className={`absolute rounded-full opacity-60 ${currentBiome.weather === 'snow' ? 'bg-white animate-fall' : 'bg-yellow-200 animate-pulse'}`}
                            style={{
                                left: `${p.left}%`,
                                top: `${p.top}%`,
                                width: `${p.size}px`,
                                height: `${p.size}px`,
                                animationDuration: `${p.speed}s`,
                                animationDelay: `${p.delay}s`,
                                boxShadow: currentBiome.weather === 'fireflies' ? '0 0 5px #f1c40f' : 'none'
                            }}
                        />
                    ))}
                    {/* Vignette Overlay */}
                    <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/40 mix-blend-multiply"></div>
                </div>

                {/* 6. STATIC HUD LAYER (Over everything) */}
                <div className="absolute top-0 left-0 w-full p-8 z-40 flex justify-between items-start pointer-events-none" style={{ transform: 'translateZ(80px)' }}>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-4xl filter drop-shadow-xl">{currentBiome.icon}</span>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter drop-shadow-md">{currentBiome.name}</h2>
                        </div>
                        <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
                            <div className="w-32 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-yellow-500 to-amber-300 transition-all duration-1000"
                                    style={{ width: `${(xp / xpToNextLevel) * 100}%` }}></div>
                            </div>
                            <span className="text-[10px] font-bold text-yellow-400 font-mono">{xp}/{xpToNextLevel}</span>
                        </div>
                    </div>
                    <div className="bg-gradient-to-b from-gray-800 to-black p-3 rounded-2xl border border-white/10 shadow-2xl text-center">
                        <div className="text-[8px] text-gray-400 uppercase tracking-widest mb-0.5">NIVEL</div>
                        <div className="text-3xl font-black text-white leading-none">{level}</div>
                    </div>
                </div>

            </div>

            {/* CSS ANIMATIONS */}
            <style>{`
                .transform-style-3d { transform-style: preserve-3d; }
                .animate-float-slow { animation: float 6s ease-in-out infinite; }
                .animate-float-fast { animation: float 3s ease-in-out infinite; }
                .animate-bounce-subtle { animation: bounceSubtle 2s infinite; }
                @keyframes float {
                    0%, 100% { transform: translateY(0px) translateZ(0); }
                    50% { transform: translateY(-10px) translateZ(0); }
                }
                @keyframes bounceSubtle {
                    0%, 100% { transform: translateY(0) rotate(45deg); }
                    50% { transform: translateY(-3px) rotate(45deg); }
                }
                @keyframes fall {
                    0% { transform: translateY(-10%) rotate(0deg); opacity: 0; }
                    10% { opacity: 1; }
                    100% { transform: translateY(120vh) rotate(360deg); opacity: 0; }
                }
                .bg-radial-gradient { background: radial-gradient(circle, transparent 60%, rgba(0,0,0,0.8) 100%); }
            `}</style>
        </div>
    );
}
