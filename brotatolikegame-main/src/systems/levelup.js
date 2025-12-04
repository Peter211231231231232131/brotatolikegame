import { CONFIG } from '../constants.js';

export class LevelUpSystem {
    constructor(game) {
        this.game = game;
        this.container = document.getElementById('levelup');
        this.cardContainer = document.getElementById('levelup-cards');
    }

    show() {
        this.container.style.display = 'flex';
        this.cardContainer.innerHTML = '';

        // Pick 3 Random Upgrades
        for (let i = 0; i < 3; i++) {
            const upg = CONFIG.LEVEL_UPGRADES[Math.floor(Math.random() * CONFIG.LEVEL_UPGRADES.length)];
            this.createCard(upg);
        }
    }

    createCard(item) {
        const card = document.createElement('div');
        card.style.cssText = `
            background: #222; border: 2px solid ${item.color}; padding: 20px; 
            width: 140px; text-align: center; cursor: pointer; color: white; border-radius: 8px;
        `;
        card.innerHTML = `
            <h3 style="color:${item.color}">${item.name}</h3>
            <p>${item.desc}</p>
            <div style="margin-top:10px; font-size:12px; color:#aaa">CLICK TO SELECT</div>
        `;
        
        card.onclick = () => {
            this.game.player.applyItem(item); // Apply stat
            this.game.resumeFromLevelUp();    // Resume game
        };

        this.cardContainer.appendChild(card);
    }

    hide() {
        this.container.style.display = 'none';
    }
}