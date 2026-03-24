const ICON_SET = [
    // Shapes & Basic
    "fa-star", "fa-heart", "fa-circle", "fa-square",
    // Weather & Sky
    "fa-cloud", "fa-sun", "fa-moon", "fa-snowflake", "fa-bolt",
    // Nature
    "fa-tree", "fa-leaf", "fa-fire", "fa-droplet", "fa-gem",
    // Animals
    "fa-cat", "fa-dog", "fa-fish", "fa-frog", 
    "fa-dove", "fa-hippo", "fa-horse",
    // Music & Media
    "fa-music", "fa-camera", "fa-film", "fa-gamepad", "fa-headphones", "fa-microphone",
    // Transport
    "fa-car", "fa-plane", "fa-rocket", "fa-bicycle", "fa-train",
    // Objects & Tools
    "fa-gem", "fa-crown", "fa-ghost", "fa-bell", "fa-gift", "fa-key", 
    "fa-lock", "fa-shield", "fa-cog", "fa-book", "fa-pen", "fa-pencil",
    // UI & Actions
    "fa-circle-check", "fa-check", "fa-x", "fa-plus", "fa-minus",
    "fa-eye", "fa-thumbs-up", "fa-thumbs-down", "fa-smile", "fa-laugh",
    // Time & Location
    "fa-calendar", "fa-clock", "fa-compass", "fa-map",
    // Body Parts
    "fa-hand", "fa-handshake", "fa-brain", "fa-heart-pulse",
    // Utility
    "fa-lightbulb", "fa-cube", "fa-feather", "fa-user",
    "fa-briefcase", "fa-palette", "fa-scissors",
    // Extra variety
    "fa-ring", "fa-flask", "fa-apple", "fa-lemon",
    "fa-cookie", "fa-graduation-cap", "fa-star-half", "fa-unlock"
];

let iconMap = new Map();      // number -> icon class (without 'fas ')
let magicIcon = "fa-star";    // current shared icon for multiples of 9

function getRandomIcon() {
    return ICON_SET[Math.floor(Math.random() * ICON_SET.length)];
}

// generate mapping 0..99 : multiples of 9 get same magicIcon, others random
function generateNewMapping() {
    magicIcon = getRandomIcon();
    const newMap = new Map();
    for (let num = 0; num <= 99; num++) {
        if (num % 9 === 0) {
            newMap.set(num, magicIcon);
        } else {
            newMap.set(num, getRandomIcon());
        }
    }
    return newMap;
}

function renderGrid() {
    const gridContainer = document.getElementById('iconsGrid');
    if (!gridContainer) return;
    gridContainer.innerHTML = '';
    // display numbers 0 to 99, then add 5 placeholder cells to complete 7 full rows (15x7=105)
    for (let i = 0; i <= 99; i++) {
        const iconClass = iconMap.get(i);
        const finalIcon = iconClass ? iconClass : magicIcon;
        const card = document.createElement('div');
        card.className = 'grid-card';
        const numDisplay = i < 10 ? `0${i}` : `${i}`;
        card.innerHTML = `
            <div class="number">${numDisplay}</div>
            <div class="icon"><i class="fas ${finalIcon}"></i></div>
        `;
        gridContainer.appendChild(card);
    }
    // Add 5 placeholder cells (invisible but to maintain grid structure)
    for (let i = 0; i < 5; i++) {
        const emptyCard = document.createElement('div');
        emptyCard.className = 'grid-card empty-card';
        emptyCard.style.opacity = '0.4';
        emptyCard.style.background = '#f9efe5';
        emptyCard.innerHTML = `
            <div class="number">--</div>
            <div class="icon"><i class="fas fa-ellipsis-h"></i></div>
        `;
        gridContainer.appendChild(emptyCard);
    }
}

function refreshGame() {
    iconMap = generateNewMapping();
    renderGrid();
    // close modal if open
    const modal = document.getElementById('resultModal');
    if (modal) modal.classList.remove('active');
    // animation on refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.style.transform = "scale(0.96)";
        setTimeout(() => { if(refreshBtn) refreshBtn.style.transform = ""; }, 150);
    }
}

function revealMagicIcon() {
    const modal = document.getElementById('resultModal');
    const modalIconDiv = document.getElementById('modalIcon');
    if (!modal || !modalIconDiv) return;
    modalIconDiv.innerHTML = `<i class="fas ${magicIcon}"></i>`;
    modal.classList.add('active');
    highlightMultipleOfNine();
}

function highlightMultipleOfNine() {
    const multiples = [0,9,18,27,36,45,54,63,72,81,90,99];
    const randomIndex = Math.floor(Math.random() * multiples.length);
    const targetNum = multiples[randomIndex];
    const cards = document.querySelectorAll('.grid-card');
    for (let i = 0; i < cards.length; i++) {
        const numDiv = cards[i].querySelector('.number');
        if (numDiv && numDiv.innerText !== '--') {
            let numText = numDiv.innerText;
            let cardNum = parseInt(numText, 10);
            if (cardNum === targetNum) {
                cards[i].style.transition = "0.1s";
                cards[i].style.backgroundColor = "#ffe3c9";
                cards[i].style.transform = "scale(1.02)";
                setTimeout(() => {
                    cards[i].style.backgroundColor = "";
                    cards[i].style.transform = "";
                }, 500);
                cards[i].scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
                break;
            }
        }
    }
}

function closeModal() {
    const modal = document.getElementById('resultModal');
    if (modal) modal.classList.remove('active');
}

function init() {
    iconMap = generateNewMapping();
    renderGrid();

    const refreshBtn = document.getElementById('refreshBtn');
    const revealBtn = document.getElementById('revealMagicBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalOverlay = document.getElementById('resultModal');

    if (refreshBtn) refreshBtn.addEventListener('click', refreshGame);
    if (revealBtn) revealBtn.addEventListener('click', revealMagicIcon);
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => {
        location.reload(); // Refresh the page for a new game
    });
    if (modalOverlay) modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
}

document.addEventListener('DOMContentLoaded', init);