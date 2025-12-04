export const CONFIG = {
    WORLD_SIZE: 3000,
    TILE_SIZE: 128,
    COLORS: {
        bg: '#1a1a1a',
        grid: '#2a2a2a',
        player: '#e0c080',
        enemy: '#ff4444',
        gem: '#00ff00'
    },
    PLAYER: {
        baseHp: 20,
        baseSpeed: 5,
        friction: 0.9
    },
    // NEW: Shop Items
    SHOP_ITEMS: [
        { name: "Slightly Bigger Muscles", type: "damage", val: 2, cost: 20, desc: "+2 Damage" },
        { name: "Bandage", type: "heal", val: 10, cost: 15, desc: "Heal 10 HP" },
        { name: "Coffee", type: "speed", val: 0.5, cost: 30, desc: "+0.5 Move Speed" },
        { name: "Thick Skin", type: "maxHp", val: 10, cost: 40, desc: "+10 Max HP" },
        { name: "Magazine", type: "cooldown", val: 2, cost: 50, desc: "-2 Frames Cooldown" }
    ]
};