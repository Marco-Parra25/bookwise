import React, { useMemo, useState, useEffect } from 'react';

const BIOMES = [
    {
        name: "Bosque Ancestral",
        start: 1, end: 5,
        bg: "https://images.unsplash.com/photo-1448375240586-dfd8f3793300",
        color: "#2ecc71", accent: "#27ae60", icon: "🌲",
        weather: "fireflies"
    },
    {
        name: "Ruinas Olvidadas",
        start: 6, end: 10,
        bg: "https://images.unsplash.com/photo-1599593257608-8e6bf7656910",
        color: "#e67e22", accent: "#d35400", icon: "🔥",
        weather: "embers"
    },
    {
        name: "Tundra de Cristal",
        start: 11, end: 15,
        bg: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325",
        color: "#a29bfe", accent: "#6c5ce7", icon: "❄️",
        weather: "snow"
    },
    {
        name: "Reino de los Cielos",
        start: 16, end: 99,
        bg: "https://images.unsplash.com/photo-1506259091721-347f793bb76d",
        color: "#74b9ff", accent: "#0984e3", icon: "🏰",
        weather: "clouds"
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
    // --- v4.0 GOD TIER UPGRADE: 3D PERSPECTIVE, WEATHER SYSTEMS, FLOATING ISLANDS ---

    const progressionLevel = (booksRead || 0) + 1;
    const currentBiome = BIOMES.find(b => progressionLevel >= b.start && progressionLevel <= b.end) || BIOMES[BIOMES.length - 1];
    const LEVELS_PER_SCREEN = 5;
    const currentScreenIndex = Math.floor((progressionLevel - 1) / LEVELS_PER_SCREEN);
    const startLevelView = (currentScreenIndex * LEVELS_PER_SCREEN) + 1;

    // Generate Nodes with "Height" for 3D effect
    const nodes = useMemo(() => {
        const list = [];
        for (let i = startLevelView; i < startLevelView + LEVELS_PER_SCREEN; i++) {
            const relativeIndex = i - startLevelView;
            const isEven = i % 2 === 0;
            const isBoss = i % 5 === 0;
            const bookData = history[i - 1];

            list.push({
                level: i,
                // Sinuosity for 3D path perception
                x: isEven ? 70 : 30,
                y: 85 - (relativeIndex * 15),
                z: relativeIndex * 10, // Simulated depth
                locked: i > progressionLevel,
                current: i === progressionLevel,
                completed: i < progressionLevel,
                isBoss,
                book: bookData ? bookData.title : null
            });
        }
        return list;
    }, [progressionLevel, startLevelView, history]);

    // Advanced Particle System
    const [particles, setParticles] = useState([]);
    useEffect(() => {
        const count = 30; // More particles!
        const p = Array.from({ length: count }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * (currentBiome.weather === 'snow' ? 4 : 6) + 2,
            duration: Math.random() * 5 + 5,
            delay: Math.random() * -5,
            opacity: Math.random() * 0.7 + 0.3
        }));
        setParticles(p);
    }, [currentBiome]);

    // CSS for particles based on weather
    const weatherAnimation = useMemo(() => {
        if (currentBiome.weather === 'snow') return 'animate-fall';
        if (currentBiome.weather === 'embers') return 'animate-rise';
        if (currentBiome.weather === 'clouds') return 'animate-float';
        return 'animate-pulse'; // fireflies
    }, [currentBiome]);

    return (
        <div className="group relative w-full h-[600px] perspective-[1000px] overflow-visible mb-12 select-none">

            {/* 3D BOARD CONTAINER */}
            <div className="relative w-full h-full rounded-3xl transition-transform duration-700 transform-style-3d rotate-x-10 shadow-2xl border-[6px] bg-gray-900 overflow-hidden"
                style={{
                    borderColor: currentBiome.color,
                    transform: 'rotateX(20deg) scale(0.95)',
                    boxShadow: `0 25px 50px -12px ${currentBiome.color}40`
                }}>

                {/* --- LAYER 1: 3D BACKGROUND PARALLAX --- */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-110"
                    style={{ backgroundImage: `url(${currentBiome.bg})` }}
                >
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
                    {/* Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60"></div>
                </div>

                {/* --- LAYER 2: WEATHER SYSTEM --- */}
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                    {particles.map(p => (
                        <div
                            key={p.id}
                            className={`absolute rounded-full transition-colors duration-1000 ${weatherAnimation}`}
                            style={{
                                left: `${p.x}%`,
                                top: `${p.y}%`,
                                width: `${p.size}px`,
                                height: `${p.size}px`,
                                backgroundColor: currentBiome.weather === 'embers' ? '#e74c3c' : '#ffffff',
                                opacity: p.opacity,
                                boxShadow: currentBiome.weather === 'fireflies' ? '0 0 10px #f1c40f' : 'none',
                                animationDuration: `${p.duration}s`,
                                animationDelay: `${p.delay}s`
                            }}
                        />
                    ))}
                </div>

                {/* --- LAYER 3: PATH (DRAWN ON FLOOR) --- */}
                <div className="absolute inset-0 z-0 mt-8">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.5))' }}>
                        {nodes.map((node, index) => {
                            if (index === nodes.length - 1) return null;
                            const next = nodes[index + 1];
                            return (
                                <path
                                    key={`path-${node.level}`}
                                    d={`M ${node.x} ${node.y} C ${node.x} ${node.y - 10}, ${next.x} ${next.y + 10}, ${next.x} ${next.y}`}
                                    stroke={node.locked ? "#374151" : currentBiome.color} // dark gray if locked
                                    strokeWidth={node.locked ? "2" : "6"}
                                    strokeDasharray={node.locked ? "5,5" : "none"}
                                    fill="none"
                                    strokeLinecap="round"
                                    className="transition-all duration-1000"
                                    style={{ opacity: 0.8 }}
                                />
                            );
                        })}
                    </svg>
                </div>

                {/* --- LAYER 4: FLOATING ISLAND NODES --- */}
                <div className="absolute inset-0 z-10">
                    {nodes.map((node) => (
                        <div
                            key={node.level}
                            className={`absolute flex items-center justify-center transition-all duration-500
                ${node.current ? 'z-50' : 'z-20'}
              `}
                            style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        >
                            {/* 3D FLOATING BASE (SHADOW) */}
                            <div className="absolute top-8 w-12 h-4 bg-black/50 blur-md rounded-[100%]"></div>

                            {/* ISLAND CONTAINER (BOBBING ANIMATION) */}
                            <div className={`
                  relative flex flex-col items-center
                  transition-transform duration-1000 ease-in-out
                  ${node.current ? 'animate-float-fast' : 'animate-float-slow'}
               `}
                                style={{ animationDelay: `${node.level * -0.5}s` }}
                            >

                                {/* NODE ISLAND */}
                                <div className={`
                      relative flex items-center justify-center 
                      ${node.isBoss ? 'w-20 h-20' : 'w-16 h-16'}
                      rounded-2xl transform rotate-45 border-b-8
                      transition-all duration-300 group-hover:rotate-0 group-hover:rounded-full
                      ${node.locked
                                        ? 'bg-gray-800 border-gray-900 grayscale opacity-80'
                                        : 'shadow-lg cursor-pointer hover:scale-110'}
                   `}
                                    style={{
                                        backgroundColor: !node.locked ? (node.current ? '#ffffff' : currentBiome.accent) : undefined,
                                        borderColor: !node.locked ? currentBiome.color : undefined,
                                        boxShadow: node.current ? `0 0 40px ${currentBiome.color}` : undefined
                                    }}
                                >
                                    <div className={`transform -rotate-45 group-hover:rotate-0 transition-transform ${node.locked ? 'opacity-50' : 'text-white'}`}>
                                        {node.isBoss ? <span className="text-3xl">🏰</span> : <span className="text-xl font-bold font-mono">{node.level}</span>}
                                    </div>

                                    {/* CHECKMARK BADGE */}
                                    {node.completed && !node.isBoss && (
                                        <div className="absolute -top-2 -right-2 bg-green-500 border-2 border-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold z-20">
                                            ✓
                                        </div>
                                    )}
                                </div>

                                {/* TOOLTIP (ON HOVER) */}
                                {node.book && (
                                    <div className="absolute bottom-full mb-4 opacity-0 hover:opacity-100 transition-opacity duration-300 w-48 z-50 pointer-events-none">
                                        <div className="bg-gray-900/95 text-white p-3 rounded-xl border border-gray-700 shadow-2xl text-center transform scale-90 hover:scale-100 transition-transform">
                                            <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Historia</div>
                                            <div className="font-bold text-sm text-yellow-400 leading-tight">{node.book}</div>
                                        </div>
                                    </div>
                                )}

                                {/* AVATAR (ON CURRENT NODE) */}
                                {node.current && (
                                    <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 z-50 filter drop-shadow-2xl">
                                        <div className="relative">
                                            <div className="text-6xl animate-bounce" style={{ animationDuration: '2s' }}>
                                                {avatar?.startsWith('http') ? (
                                                    <div className="w-20 h-20 rounded-2xl overflow-hidden glass border-2 border-yellow-400 shadow-2xl scale-75">
                                                        <img src={avatar} alt="Character" className="w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <span>{avatar || "🧙‍♂️"}</span>
                                                )}
                                            </div>
                                            {/* Aura Ring */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-yellow-400 rounded-full animate-ping opacity-20"></div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    ))}
                </div>

                {/* --- LAYER 5: HUD OVERLAY --- */}
                <div className="absolute top-0 left-0 p-6 z-50 w-full flex justify-between items-start pointer-events-none">
                    <div className="flex flex-col text-left">
                        <h1 className="text-4xl font-extrabold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,1)] flex items-center gap-3">
                            <span className="text-5xl filter drop-shadow-lg">{currentBiome.icon}</span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                                {currentBiome.name}
                            </span>
                        </h1>
                        <div className="mt-2 flex items-center gap-3">
                            <div className="h-4 w-64 bg-gray-800/80 backdrop-blur rounded-full border border-gray-600 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-300 transition-all duration-1000"
                                    style={{ width: `${(xp / xpToNextLevel) * 100}%` }}>
                                </div>
                                {/* Gloss */}
                                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
                            </div>
                            <span className="text-yellow-400 font-bold font-mono text-lg drop-shadow-md">
                                {xp}/{xpToNextLevel} XP
                            </span>
                        </div>
                    </div>

                    {/* Level Badge */}
                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-4 rounded-2xl border-2 border-yellow-500/50 shadow-2xl flex flex-col items-center">
                        <span className="text-xs text-gray-400 uppercase tracking-widest">Nivel</span>
                        <span className="text-5xl font-black text-white leading-none">{level}</span>
                    </div>
                </div>

            </div>

            {/* --- LAYER 6: BOTTOM REFLECTION (Fake Polish) --- */}
            <div className="absolute -bottom-8 left-10 right-10 h-8 bg-black/20 blur-xl rounded-[100%]"></div>

            <style>{`
        @keyframes fall {
          0% { transform: translateY(-10%) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(120%) rotate(360deg); opacity: 0; }
        }
        @keyframes rise {
          0% { transform: translateY(120%) scale(1); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-20%) scale(0); opacity: 0; }
        }
        @keyframes float {
          0% { transform: translateX(-10%); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateX(110%); opacity: 0; }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-fall { animation: fall linear infinite; }
        .animate-rise { animation: rise linear infinite; }
        .animate-float { animation: float linear infinite; }
        .animate-float-fast { animation: float-fast 3s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 5s ease-in-out infinite; }
        .transform-style-3d { transform-style: preserve-3d; }
      `}</style>
        </div>
    );
}
