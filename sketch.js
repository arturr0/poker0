let cardImages = {};
let deck = [];
let hands = {};
let players = 4; // Number of players

function preload() {
  deck = generateDeck();
  
  // Load all card images
  deck.forEach(card => {
    let imgPath = card.filePath;
    cardImages[imgPath] = loadImage(imgPath, 
      () => console.log(`Successfully loaded ${imgPath}`), 
      () => console.error(`Failed to load ${imgPath}`)
    );
  });
}

function setup() {
  createCanvas(1000, 1000);
  noLoop(); // Stop draw loop since we only need to draw once
  
  shuffleDeck(deck);
  dealCards(players);

  // Check hands for each player
  for (let player in hands) {
    let hand = hands[player];
    console.log(`${player}'s hand:`);
    hand.forEach(card => console.log(`${card.name} of ${card.suit}`));
    let handType = detectHand(hand);
    console.log(`${player} has a ${handType}`);
  }
}

function draw() {
  background(220);

  // Display each player's hand
  let x = 10;
  let y = 10;
  let cardWidth = 100;
  let cardHeight = 140;
  let spacing = 10;

  Object.keys(hands).forEach((player, index) => {
    let hand = hands[player];
    fill(0);
    textSize(16);
    text(`${player}`, x, y - 10);
    hand.forEach((card, cardIndex) => {
      if (cardImages[card.filePath]) {
        image(cardImages[card.filePath], x, y, cardWidth, cardHeight);
        x += cardWidth + spacing;
        if (x + cardWidth > width) {
          x = 10;
          y += cardHeight + spacing;
        }
      } else {
        console.error(`Image not found: ${card.filePath}`);
      }
    });
    x = 10;
    y += cardHeight + spacing + 50; // Space between players' hands
  });
}

function generateDeck() {
  const deck = [];
  const values = [
    { value: 2, name: '2' },
    { value: 3, name: '3' },
    { value: 4, name: '4' },
    { value: 5, name: '5' },
    { value: 6, name: '6' },
    { value: 7, name: '7' },
    { value: 8, name: '8' },
    { value: 9, name: '9' },
    { value: 10, name: '10' },
    { value: 11, name: 'jack' },
    { value: 12, name: 'queen' },
    { value: 13, name: 'king' },
    { value: 14, name: 'ace' }
  ];
  const suits = ['spades', 'hearts', 'diamonds', 'clubs'];

  for (let suit of suits) {
    for (let { value, name } of values) {
      const filePath = `png/${name}_of_${suit}.png`;
      const card = {
        value: value,
        suit: suit,
        name: name,
        filePath: filePath
      };
      deck.push(card);
    }
  }

  return deck;
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function dealCards(numPlayers) {
  hands = {};
  const cardsPerPlayer = 5;
  
  for (let i = 0; i < numPlayers; i++) {
    hands[`Player ${i + 1}`] = [];
  }

  for (let i = 0; i < cardsPerPlayer * numPlayers; i++) {
    let playerIndex = i % numPlayers;
    hands[`Player ${playerIndex + 1}`].push(deck.pop());
  }
}

function detectHand(hand) {
  hand.sort((a, b) => a.value - b.value);
  let isFlush = hand.every(card => card.suit === hand[0].suit);
  let isStraight = hand.every((card, index) => 
    index === 0 || card.value === hand[index - 1].value + 1
  );

  let counts = hand.reduce((acc, card) => {
    acc[card.value] = (acc[card.value] || 0) + 1;
    return acc;
  }, {});

  let countValues = Object.values(counts);
  
  if (isFlush && isStraight && hand[0].value === 10) return 'Royal Flush';
  if (isFlush && isStraight) return 'Straight Flush';
  if (countValues.includes(4)) return 'Four of a Kind';
  if (countValues.includes(3) && countValues.includes(2)) return 'Full House';
  if (isFlush) return 'Flush';
  if (isStraight) return 'Straight';
  if (countValues.includes(3)) return 'Three of a Kind';
  if (countValues.filter(count => count === 2).length === 2) return 'Two Pair';
  if (countValues.includes(2)) return 'One Pair';
  return 'High Card';
}
