
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { purchaseItem, equipItem, loadCharacter } from "../utils/storage";
import MotionCard from "./MotionCard";
import AvatarDisplay from "./AvatarDisplay";

const ITEMS_DB = [
    // --- HATS ---
    { id: "hat_wizard", name: "Sombrero Arcano", price: 500, category: "hat", icon: "🎩", rarity: "rare", desc: "Tejido con hilos de magia pura." },
    { id: "hat_cap", name: "Gorra Urbana", price: 150, category: "hat", icon: "🧢", rarity: "common", desc: "Ideal para leer en el metro." },
    { id: "hat_crown", name: "Corona Real", price: 5000, category: "hat", icon: "👑", rarity: "legendary", desc: "Solo para los verdaderos reyes de la lectura." },
    { id: "hat_cowboy", name: "Sombrero Vaquero", price: 300, category: "hat", icon: "🤠", rarity: "common", desc: "Yee-haw, libro vaquero." },

    // --- GLASSES ---
    { id: "glasses_sun", name: "Gafas de Sol", price: 200, category: "glasses", icon: "🕶️", rarity: "common", desc: "Protege tu vista del brillo de la sabiduría." },
    { id: "glasses_nerd", name: "Gafas Intelectuales", price: 100, category: "glasses", icon: "👓", rarity: "common", desc: "+10 de Inteligencia percibida." },
    { id: "glasses_vr", name: "Visor Futuro", price: 1200, category: "glasses", icon: "🥽", rarity: "rare", desc: "Lee en el metaverso." },

    // --- BEARDS / MASKS ---
    { id: "mask_fox", name: "Máscara Kitsune", price: 800, category: "beard", icon: "🦊", rarity: "rare", desc: "Astuta como un zorro." },
    { id: "beard_santa", name: "Barba Sabia", price: 400, category: "beard", icon: "🎅", rarity: "common", desc: "Canas ganadas con experiencia." },

    // --- CONSUMABLES (MAGIC) ---
    { id: "potion_xp", name: "Poción Sapiencia", price: 300, category: "magic", icon: "🧪", rarity: "epic", desc: "+500 XP Instantáneos. Sabe a tinta.", type: "consumable", effect: "xp_boost", value: 500 },
    { id: "scroll_levelup", name: "Pergamino Ascensión", price: 2000, category: "magic", icon: "📜", rarity: "legendary", desc: "Sube 1 Nivel completos. Magia prohibida.", type: "consumable", effect: "level_up" },
];

export default function Store({ onUpdateProfile, currentCoins, inventory, equipped }) {
    const [activeCategory, setActiveCategory] = useState("all");
    const [msg, setMsg] = useState("");
    const [character, setCharacter] = useState(loadCharacter());

    // Preview Logic: Start with currently equipped items.
    const [previewValues, setPreviewValues] = useState(equipped || {});

    // Sync preview with actual equipped when it changes externally
    useEffect(() => {
        if (equipped) setPreviewValues(equipped);
    }, [equipped]);

    const filteredItems = activeCategory === "all"
        ? ITEMS_DB
        : ITEMS_DB.filter(i => i.category === activeCategory);

    const handlePurchase = (item) => {
        const res = purchaseItem(item);
        if (res.success) {
            setMsg(res.message);
            onUpdateProfile();
            // If it's gear, auto-equip in preview to show it's owned
            if (item.type !== 'consumable') {
                handleEquip(item, true); // True = Force equip
            }
        } else {
            setMsg(res.message);
        }
        setTimeout(() => setMsg(""), 3000);
    };

    const handleEquip = (item, force = false) => {
        const currentEquipped = previewValues[item.category];
        const isEquipped = currentEquipped === item.id;
        const newId = (isEquipped && !force) ? null : item.id;

        // Update persistent storage
        equipItem(item.category, newId);

        // Update Local Preview
        setPreviewValues(prev => ({
            ...prev,
            [item.category]: newId
        }));

        onUpdateProfile();
    };

    const handlePreviewClick = (item) => {
        // Just update visual preview without saving? 
        // For now, let's keep it direct: Click = Equip (if owned).
        // If not owned, we could preview it, but let's stick to "Buy" flow for simplicity first.
        if (inventory?.includes(item.id)) {
            handleEquip(item);
        }
    };

    return (
        <div className="glass rounded-[2.5rem] relative overflow-hidden min-h-[800px] flex flex-col lg:flex-row">

            {/* --- LEFT: AVATAR PEDESTAL (40%) --- */}
            <div className="w-full lg:w-[40%] bg-gradient-to-b from-gray-900 via-gray-800 to-black relative flex flex-col justify-center items-center p-8 border-r border-white/10 overflow-hidden group/studio">

                {/* Spotlight Effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[80%] bg-gradient-to-b from-white/10 via-transparent to-transparent blur-[50px] pointer-events-none"></div>
                <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[200px] h-[50px] bg-white/20 blur-[30px] rounded-full pointer-events-none"></div>

                {/* Avatar */}
                <div className="relative z-10 transform transition-transform duration-700 hover:scale-105">
                    <div className="relative animate-float-slow">
                        <AvatarDisplay
                            avatar={character?.avatar}
                            equipped={previewValues}
                            size="lg" // NEW LARGE SIZE
                            className="drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                        />
                        {/* Pedestal Base */}
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-12 bg-black rounded-[100%] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"></div>
                    </div>
                </div>

                {/* Character Name */}
                <div className="mt-12 text-center relative z-10">
                    <h2 className="text-4xl font-black text-white tracking-widest uppercase mb-1">{character?.name}</h2>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                        <span className="text-yellow-400">🪙</span>
                        <span className="text-yellow-400 font-bold font-mono text-lg">{currentCoins}</span>
                    </div>
                </div>

                {/* Ambient Particles */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-ping opacity-20"></div>
                    <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-10"></div>
                </div>
            </div>

            {/* --- RIGHT: SHOP INTERFACE (60%) --- */}
            <div className="w-full lg:w-[60%] p-8 flex flex-col bg-black/20 backdrop-blur-sm">

                {/* Header */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Avatar Studio</h2>
                        <p className="rpg-label text-cyan-500">Personaliza tu Leyenda</p>
                    </div>
                    {/* Filter Tabs */}
                    <div className="flex gap-2">
                        {[
                            { id: "all", icon: "🛍️" },
                            { id: "hat", icon: "🎩" },
                            { id: "glasses", icon: "👓" },
                            { id: "beard", icon: "🎭" },
                            { id: "magic", icon: "✨" },
                        ].map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeCategory === cat.id ? 'bg-cyan-500 text-black scale-110 shadow-cyan-500/50 shadow-lg' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
                            >
                                <span className="text-lg">{cat.icon}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Items Grid (Scrollable) */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto pr-2 custom-scrollbar flex-1 content-start max-h-[600px]">
                    {filteredItems.map((item) => {
                        const isOwned = inventory?.includes(item.id);
                        const isEquipped = previewValues?.[item.category] === item.id;
                        const canAfford = (currentCoins || 0) >= item.price;

                        return (
                            <MotionCard key={item.id} className="group relative">
                                <div
                                    onClick={() => handlePreviewClick(item)}
                                    className={`relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden
                                    ${isEquipped
                                            ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)]'
                                            : 'bg-white/5 border-white/5 hover:border-cyan-500/30 hover:bg-white/10'}
                                `}>
                                    {/* Action Button Overlay */}
                                    {!isOwned && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 backdrop-blur-[1px]">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handlePurchase(item);
                                                }}
                                                disabled={!canAfford}
                                                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transform scale-90 transition-transform hover:scale-100 ${canAfford ? 'bg-cyan-500 text-black' : 'bg-gray-700 text-gray-500'}`}
                                            >
                                                {canAfford ? 'Comprar' : 'Faltan Monedas'}
                                            </button>
                                        </div>
                                    )}

                                    {/* Rarity Dot */}
                                    <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${item.rarity === 'legendary' ? 'bg-yellow-500 animate-pulse' : item.rarity === 'rare' ? 'bg-cyan-400' : 'bg-gray-600'}`}></div>

                                    {/* Icon */}
                                    <div className="h-20 flex items-center justify-center text-5xl mb-2 filter drop-shadow-lg group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </div>

                                    {/* Info */}
                                    <div className="text-center">
                                        <h3 className="text-xs font-bold text-white uppercase truncate px-2">{item.name}</h3>
                                        <div className="mt-1 flex items-center justify-center gap-1.5">
                                            {isOwned ? (
                                                <span className="text-[10px] text-green-400 uppercase font-black tracking-widest">En posesión</span>
                                            ) : (
                                                <>
                                                    <span className="text-[10px] text-yellow-500">🪙</span>
                                                    <span className="text-xs font-mono font-bold text-gray-300">{item.price}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </MotionCard>
                        );
                    })}
                </div>
            </div>

            {/* Toast Message */}
            <AnimatePresence>
                {msg && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-6 py-3 rounded-xl border border-cyan-500 shadow-2xl font-bold flex items-center gap-3"
                    >
                        <span>🪄</span> {msg}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}


export default function Store({ onUpdateProfile, currentCoins, inventory, equipped }) {
    const [activeCategory, setActiveCategory] = useState("all");
    const [selectedItem, setSelectedItem] = useState(null);
    const [msg, setMsg] = useState("");

    const filteredItems = activeCategory === "all"
        ? ITEMS_DB
        : ITEMS_DB.filter(i => i.category === activeCategory);

    const handlePurchase = (item) => {
        const res = purchaseItem(item);
        if (res.success) {
            setMsg(res.message);  // Shows "Effect applied!" for consumables
            onUpdateProfile(); // Refresh app state
        } else {
            setMsg(res.message);
        }
        setTimeout(() => setMsg(""), 3000);
    };

    const handleEquip = (item) => {
        const isEquipped = equipped?.[item.category] === item.id;
        // Toggle equip
        equipItem(item.category, isEquipped ? null : item.id);
        onUpdateProfile();
    };

    return (
        <div className="glass p-8 rounded-[2.5rem] relative overflow-hidden min-h-[600px]">

            {/* Header & Balance */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">The Emporium</h2>
                    <p className="rpg-label text-cyan-500 dark:text-cyan-400">Mercado de Reliquias</p>
                </div>
                <div className="glass px-6 py-3 rounded-2xl border border-yellow-500/30 flex items-center gap-3 shadow-[0_0_20px_rgba(234,179,8,0.2)] bg-white/50 dark:bg-black/20">
                    <span className="text-3xl animate-pulse">🪙</span>
                    <div>
                        <div className="text-2xl font-black text-yellow-500 dark:text-yellow-400 leading-none">{currentCoins || 0}</div>
                        <div className="text-[10px] text-yellow-700 dark:text-yellow-600 font-bold uppercase tracking-widest">Lumina</div>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {[
                    { id: "all", label: "Todo", icon: "🛍️" },
                    { id: "hat", label: "Cabezas", icon: "🎩" },
                    { id: "glasses", label: "Ojos", icon: "👓" },
                    { id: "beard", label: "Rostros", icon: "🎭" },
                    { id: "magic", label: "Magia", icon: "✨" },
                ].map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2
              ${activeCategory === cat.id
                                ? "bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-lg scale-105"
                                : "glass text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"}`}
                    >
                        <span>{cat.icon}</span> {cat.label}
                    </button>
                ))}
            </div>

            {/* Message Toast */}
            <AnimatePresence>
                {msg && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-black/80 text-white px-6 py-2 rounded-full border border-cyan-500/50 backdrop-blur-md font-bold text-xs"
                    >
                        {msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Store Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredItems.map((item) => {
                    const isOwned = inventory?.includes(item.id);
                    const isEquipped = equipped?.[item.category] === item.id;
                    const canAfford = (currentCoins || 0) >= item.price;

                    return (
                        <MotionCard key={item.id} className="group relative">
                            <div className={`h-full p-1 rounded-3xl transition-all duration-300 ${isEquipped ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'glass border border-black/5 dark:border-white/5 hover:border-cyan-500/50'}`}>
                                <div className="bg-white dark:bg-gray-900 h-full rounded-[1.4rem] p-5 flex flex-col items-center text-center relative overflow-hidden shadow-inner">

                                    {/* Rarity & Status Badge */}
                                    <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                                        {item.rarity === 'legendary' && <span className="text-[8px] px-2 py-0.5 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/50 rounded uppercase font-black tracking-widest">Legendary</span>}
                                        {isOwned && <span className="text-[8px] px-2 py-0.5 bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/50 rounded uppercase font-black tracking-widest">Propio</span>}
                                    </div>

                                    {/* Icon */}
                                    <div className="text-6xl mb-4 mt-4 filter drop-shadow-xl group-hover:scale-110 transition-transform duration-300">{item.icon}</div>

                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight mb-1">{item.name}</h3>
                                    <p className="text-[10px] text-gray-500 mb-4 line-clamp-2 min-h-[2.5em]">{item.desc}</p>

                                    <div className="mt-auto w-full">
                                        {isOwned ? (
                                            <button
                                                onClick={() => handleEquip(item)}
                                                className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                          ${isEquipped
                                                        ? "bg-red-500/20 text-red-500 dark:text-red-400 border border-red-500/50 hover:bg-red-500 hover:text-white"
                                                        : "bg-green-500 text-black hover:brightness-110 shadow-lg"}`}
                                            >
                                                {isEquipped ? "Desequipar" : "Equipar"}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handlePurchase(item)}
                                                disabled={!canAfford}
                                                className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2
                          ${canAfford
                                                        ? "bg-cyan-600 text-white hover:bg-cyan-500 shadow-lg"
                                                        : "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"}`}
                                            >
                                                <span>{item.price} 🪙</span> Comprar
                                            </button>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </MotionCard>
                    );
                })}
            </div>
        </div>
    );
}
