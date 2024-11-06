const app = document.getElementById('app');
const gameBoard = document.getElementById('game-board');
const restartButton = document.getElementById('restart');
const gridSizeSelect = document.getElementById('grid-size');
const turnDisplay = document.getElementById('turn');
const movesDisplay = document.getElementById('moves');
const scorePlayer1Display = document.getElementById('score-player1');
const scorePlayer2Display = document.getElementById('score-player2');

let board = [];
let flippedCards = [];
let player1Score = 0;
let player2Score = 0;
let currentPlayer = 1;
let moveCount = 0;
let gridSize = 4;

const images = [
    'images/img1.jpg',
    'images/img2.jpg',
    'images/img3.jpg',
    'images/img4.jpg',
    'images/img5.jpg',
    'images/img6.jpg',
    'images/img7.jpg',
    'images/img8.jpg',
    'images/img9.jpg',
    'images/img10.jpg',
    'images/img11.jpg',
    'images/img12.jpg',
    'images/img13.jpg',
    'images/img14.jpg',
    'images/img15.jpg',
    'images/img16.jpg',
    'images/img17.jpg',
    'images/img18.jpg',

]; 

function generateBoard() {
    board = [];
    
    const numPairs = (gridSize * gridSize) / 2;
 
    let selectedImages = images.slice(0, numPairs);
  
    while (selectedImages.length < numPairs) {
        selectedImages = selectedImages.concat(images.slice(0, numPairs - selectedImages.length));
    }

    const shuffledImages = shuffle([...selectedImages, ...selectedImages]);

    shuffledImages.forEach(image => {
        board.push({
            image,
            flipped: false,
            matched: false
        });
    });

    createBoardUI();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
    }
    return array;
}

function createBoardUI() {
    gameBoard.innerHTML = ''; 
    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`; 

    board.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.index = index;
        cardElement.addEventListener('click', () => flipCard(index));

        gameBoard.appendChild(cardElement);
    });
}

function flipCard(index) {
    const card = board[index];

    if (card.flipped || card.matched || flippedCards.length === 2) return;

    card.flipped = true;
    flippedCards.push(index);

    updateBoardUI();

    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    const [firstIndex, secondIndex] = flippedCards;
    const firstCard = board[firstIndex];
    const secondCard = board[secondIndex];

    if (firstCard.image === secondCard.image) {
        firstCard.matched = true;
        secondCard.matched = true;

        if (currentPlayer === 1) {
            player1Score++;
        } else {
            player2Score++;
        }
    } else {
        firstCard.flipped = false;
        secondCard.flipped = false;
        currentPlayer = currentPlayer === 1 ? 2 : 1;
    }

    flippedCards = [];
    moveCount++;

    updateBoardUI();
    updateGameInfo();

    if (board.every(card => card.matched)) {
        setTimeout(() => alert(`Hra skončila! Vítěz: Hráč ${player1Score > player2Score ? 1 : 2}`), 500);
    }
}


function updateBoardUI() {
    board.forEach((card, index) => {
        const cardElement = gameBoard.children[index];
        if (card.flipped || card.matched) {
            cardElement.classList.add('flipped');
            const img = document.createElement('img');
            img.src = card.image;  
            img.alt = "Card image"; 
            img.classList.add('card-image');
            cardElement.innerHTML = ''; 
            cardElement.appendChild(img);  
        } else {
            cardElement.classList.remove('flipped');
            cardElement.textContent = '';
        }

        if (card.matched) {
            cardElement.classList.add('matched');
        }
    });
}

gridSizeSelect.addEventListener('change', () => {
    gridSize = parseInt(gridSizeSelect.value);
    generateBoard();
    updateGameInfo();
});

generateBoard();
