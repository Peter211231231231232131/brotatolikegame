export const CONFIG = {
    WORLD_SIZE: 3000,
    TILE_SIZE: 128,
    COLORS: { bg: '#1a1a1a', grid: '#2a2a2a', player: '#e0c080', enemy: '#ff4444', gem: '#00ff00' },
    PLAYER: { baseHp: 20, baseSpeed: 5, friction: 0.9, basePickupRange: 100 }, // Added pickup range
    
    WEAPONS: {
        pistol: { name: 'Pistol', damage: 10, range: 400, cd: 40, speed: 12, type: 'single', color: 'yellow' },
        shotgun: { name: 'Shotgun', damage: 6, range: 250, cd: 60, speed: 10, type: 'shotgun', color: 'orange' },
        smg:    { name: 'SMG',     damage: 4,  range: 350, cd: 6,  speed: 15, type: 'single', color: '#00ffff' },
        rocket: { name: 'Bazooka', damage: 30, range: 500, cd: 90, speed: 8,  type: 'explosive', color: '#ff0000' },
        laser:  { name: 'Laser',   damage: 8,  range: 600, cd: 50, speed: 25, type: 'piercing', color: '#0000ff' } // NEW
    },

    SHOP_ITEMS: [
        { name: "Medkit", type: "heal", val: 10, cost: 20, desc: "Heal 10 HP" },
        { name: "Steroids", type: "damage", val: 2, cost: 40, desc: "+2 Damage" },
        { name: "Magnet", type: "magnet", val: 50, cost: 25, desc: "+50 Pickup Range" }, // NEW
        { name: "SMG", type: "weapon", id: "smg", cost: 100, desc: "New Weapon: SMG" },
        { name: "Bazooka", type: "weapon", id: "rocket", cost: 150, desc: "New Weapon: Bazooka" },
        { name: "Laser Gun", type: "weapon", id: "laser", cost: 120, desc: "Pierces Enemies" } // NEW
    ],

    LEVEL_UPGRADES: [
        { name: "Max HP UP", type: "maxHp", val: 5, desc: "+5 Max HP", color: "#ff4444" },
        { name: "Damage UP", type: "damage", val: 1, desc: "+1 Damage", color: "#ffaa00" },
        { name: "Magnet UP", type: "magnet", val: 30, desc: "+30 Pickup Range", color: "#00ff00" }, // NEW
        { name: "Speed UP", type: "speed", val: 0.4, desc: "+0.4 Move Speed", color: "#ffffff" }
    ]
};