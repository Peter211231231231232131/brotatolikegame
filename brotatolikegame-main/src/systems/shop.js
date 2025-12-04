import { CONFIG } from '../constants.js';

export class Shop {
    constructor(game) {
        this.game = game;
        this.element = document.getElementById('shop');
        this.itemsContainer = document.getElementById('shop-items');
        this.nextBtn = document.getElementById('nextWaveBtn');
        
        this.nextBtn.addEventListener('click', () => {
            this.game.startWave();
        });
    }

    open() {
        this.element.style.display = 'flex';
        this.generateItems();
    }

    close() {
        this.element.style.display = 'none';
    }

    generateItems() {
        this.itemsContainer.innerHTML = '';
        // Pick 3 random items
        for (let i = 0; i < 3; i++) {
            const itemData = CONFIG.SHOP_ITEMS[Math.floor(Math.random() * CONFIG.SHOP_ITEMS.length)];
            this.createCard(itemData);
        }
    }

    createCard(item) {
        const card = document.createElement('div');
        card.style.cssText = `
            background: #333; color: white; padding: 20px; width: 150px; 
            border: 2px solid gold; border-radius: 10px; text-align: center; cursor: pointer;
        `;
        
        card.innerHTML = `
            <h3 style="margin:0 0 10px 0; color: gold">${item.name}</h3>
            <p>${item.desc}</p>
            <p style="font-weight:bold; color: #ffff00">Cost: ${item.cost}</p>
            <button style="background:white; color:black; border:none; padding:5px 10px;">BUY</button>
        `;

        card.onclick = () => this.buyItem(item, card);
        this.itemsContainer.appendChild(card);
    }

    buyItem(item, cardElement) {
        if (this.game.player.gold >= item.cost) {
            this.game.player.gold -= item.cost;
            this.game.player.applyItem(item); // We will add this method to Player
            
            // Visual feedback
            cardElement.style.background = '#1a441a';
            cardElement.innerHTML = "<h3>SOLD</h3>";
            cardElement.onclick = null;
        } else {
            cardElement.style.borderColor = 'red';
            setTimeout(() => cardElement.style.borderColor = 'gold', 200);
        }
    }
}