
export default function AvatarDisplay({ avatar, equipped = {}, size = "md", className = "" }) {
    // Helper to get accessory emoji/icon based on ID (Shared logic)
    const getAccessoryIcon = (id) => {
        switch (id) {
            case "hat_wizard": return "🎩";
            case "hat_cap": return "🧢";
            case "hat_crown": return "👑";
            case "hat_cowboy": return "🤠";
            case "glasses_sun": return "🕶️";
            case "glasses_nerd": return "👓";
            case "glasses_vr": return "🥽";
            case "mask_fox": return "🦊";
            case "beard_santa": return "🎅";
            default: return null;
        }
    };

    const sizeClasses = {
        sm: "w-12 h-12 text-2xl",
        md: "w-24 h-24 text-5xl",
        lg: "w-64 h-64 text-9xl", // Store size
        xl: "w-96 h-96 text-[10rem]"
    };

    return (
        <div className={`relative ${sizeClasses[size]} ${className}`}>
            <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center transform transition-transform z-0">
                {avatar?.startsWith('http') ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <span className="filter drop-shadow-xl">{avatar}</span>
                )}
            </div>

            {/* AVATAR LAYERING (ACCESSORIES) */}
            {equipped?.hat && (
                <div className="absolute -top-[15%] -right-[5%] text-[0.6em] filter drop-shadow-lg z-10 animate-bounce-subtle pointer-events-none">
                    {getAccessoryIcon(equipped.hat)}
                </div>
            )}
            {equipped?.glasses && (
                <div className="absolute top-[35%] left-1/2 -translate-x-1/2 text-[0.5em] z-20 pointer-events-none opacity-90">
                    {getAccessoryIcon(equipped.glasses)}
                </div>
            )}
            {equipped?.beard && (
                <div className="absolute bottom-[0%] left-1/2 -translate-x-1/2 text-[0.6em] z-20 pointer-events-none">
                    {getAccessoryIcon(equipped.beard)}
                </div>
            )}
        </div>
    );
}
