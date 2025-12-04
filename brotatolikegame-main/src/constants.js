export const CONFIG = {
    WORLD_SIZE: 3000,
    TILE_SIZE: 128,
    COLORS: {
        bg: '#1a1a1a', grid: '#2a2a2a', player: '#e0c080', enemy: '#ff4444', gem: '#00ff00'
    },
    PLAYER: {
        baseHp: 20, baseSpeed: 5, friction: 0.9
    },
    // SHOP (Gold)
    SHOP_ITEMS: [
        { name: "Medkit", type: "heal", val: 10, cost: 20, desc: "Heal 10 HP" },
        { name: "Steroids", type: "damage", val: 2, cost: 40, desc: "+2 Damage" },
        { name: "Espresso", type: "speed", val: 0.5, cost: 30, desc: "+0.5 Speed" }
    ],
    // LEVEL UP (XP - Free)
    LEVEL_UPGRADES: [
        { name: "Max HP UP", type: "maxHp", val: 5, desc: "+5 Max HP", color: "#ff4444" },
        { name: "Damage UP", type: "damage", val: 1, desc: "+1 Damage", color: "#ffaa00" },
        { name: "Atk Speed UP", type: "cooldown", val: 3, desc: "-3 Frames Cooldown", color: "#00bfff" },
        { name: "Speed UP", type: "speed", val: 0.4, desc: "+0.4 Move Speed", color: "#ffffff" }
    ]
};