 let blackjackGame = {
     'you': { 'scoreSpan': '#your-result', 'div': '#your-box', 'score': 0 },
     'dealer': { 'scoreSpan': '#dealer-result', 'div': '#dealer-box', 'score': 0 },
     'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Q', 'J', 'K', 'A'],
     'cardsMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'Q': 10, 'J': 10, 'K': 10, 'A': [1, 11] },
     'win': 0,
     'loss': 0,
     'draw': 0,
     'isStand': false,
     'turnsOver': false,

 };

 const YOU = blackjackGame['you'];
 const DEALER = blackjackGame['dealer'];

 const hitSound = new Audio('sounds/swish.m4a');
 const winSound = new Audio('sounds/cash.mp3');
 const lossSound = new Audio('sounds/aww.mp3');

 document.querySelector('#hit').addEventListener('click', blackjackHitYou);
 document.querySelector('#stand').addEventListener('click', blackjackHitDealer);
 document.querySelector('#deal').addEventListener('click', blackjackDeal);

 function blackjackHitYou() {
     if (blackjackGame['isStand'] === false) {
         let card = randomCard();
         showCard(card, YOU);
         updateScore(card, YOU);

         console.log('you ' + YOU['score']);
         showScoreYou(); //human score
     }

 }

 function sleep(ms) {
     return new Promise(resolve => setTimeout(resolve, ms));
 }

 async function blackjackHitDealer() {

     blackjackGame['isStand'] = true; //stand button clicked
     while (DEALER['score'] < 15 && blackjackGame['isStand'] === true) {
         let card = randomCard();
         showCard(card, DEALER);
         updateScore(card, DEALER);
         await sleep(1000);
     }

     showScoreDealer(); //dealer score
     blackjackGame['turnsOver'] = true;
     let winner = getWinner();
     showResult(winner);


 }

 function showCard(card, activePlayer) {
     if (activePlayer['score'] <= 21) {
         //console.log('showCard ' + activePlayer['score']);
         //console.log('cardMap ' + blackjackGame['cardsMap'][card]);
         let cardImage = document.createElement('img');
         cardImage.src = `cardimg/${card}.jpg`;
         cardImage.style.width = '80px';
         cardImage.style.height = '100px';
         cardImage.style.padding = '10px';
         document.querySelector(activePlayer['div']).appendChild(cardImage);
         hitSound.play();
     }

 }

 function blackjackDeal() {
     if (blackjackGame['turnsOver'] === true) {

         blackjackGame['isStand'] = false;
         let winner = getWinner();
         showResult(winner);
         countResult(winner);
         let yourImages = document.querySelector('#your-box').querySelectorAll('img');
         for (let i = 0; i < yourImages.length; i++) {
             yourImages[i].remove();

         }

         let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
         for (let i = 0; i < dealerImages.length; i++) {
             dealerImages[i].remove();

         }

         YOU['score'] = 0;
         DEALER['score'] = 0;

         document.querySelector('#your-result').textContent = '0';
         document.querySelector('#dealer-result').textContent = '0';
         document.querySelector('#result').textContent = 'Let`s Play!';

         document.querySelector('#your-result').style.color = 'white';
         document.querySelector('#dealer-result').style.color = 'white';
         document.querySelector('#result').style.color = 'black';

         blackjackGame['turnsOver'] = true;
         blackjackGame['isDeal'] = true;
     }

 }



 function randomCard() {
     let randomNumber = Math.floor(Math.random() * 13);
     return blackjackGame['cards'][randomNumber];
 }

 function updateScore(card, activePlayer) {

     //if A=11 and sum is less than 21 then add 11 ,else add A=1
     if (card === 'A') {
         if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21) {
             activePlayer['score'] += blackjackGame['cardsMap'][card][1]; //card[1]=11
         } else {
             activePlayer['score'] += blackjackGame['cardsMap'][card][0]; //card[0]=1
         }
     } else {
         activePlayer['score'] += blackjackGame['cardsMap'][card];
     }



 }

 function showScoreYou() {
     if (YOU['score'] > 21) {
         document.querySelector('#your-result').textContent = 'BUST!';
         document.querySelector('#your-result').style.color = 'red';
     } else {

         let element = document.querySelector('#your-result');
         if (element) {
             element.textContent = YOU['score'];
         }
     }

 }

 function showScoreDealer() {
     if (DEALER['score'] > 21) {
         document.querySelector('#dealer-result').textContent = 'BUST!';
         document.querySelector('#dealer-result').style.color = 'red';
     } else {
         let element = document.querySelector('#dealer-result');
         if (element) {
             element.textContent = DEALER['score'];
         }
     }
 }

 function getWinner() {
     let winner;
     if (YOU['score'] <= 21) {
         if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) { //human score greater than dealer or dealer busts
             winner = YOU;
             console.log(winner);

         } else if (YOU['score'] < DEALER['score']) {
             winner = DEALER;
             console.log(winner);

         } else if (YOU['score'] === DEALER['score']) {
             //draw
             console.log('you' + YOU['score'] + 'dealer ' + DEALER['score'] + 'draw');

         }
     } //you bust dealer doesnot
     else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
         winner = DEALER;
         console.log(winner);

     } //you and dealer both bust
     else if (YOU['score'] > 21 && DEALER['score'] > 21) {
         console.log('draw');
         console.log('you' + YOU['score'] + 'dealer ' + DEALER['score'] + 'draw');
     }

     return winner;

 }

 function showResult(winner) {
     let message, messageColor;
     if (blackjackGame['turnsOver'] === true) {
         if (winner === YOU) {
             message = 'You Won!';
             messageColor = 'green';
             winSound.play();
         } else if (winner === DEALER) {
             message = 'You Lost!';
             messageColor = 'red';
             lossSound.play();
         } else {
             message = 'You Drew!';
             messageColor = 'yellow';

         }
         document.querySelector('#result').textContent = message;
         document.querySelector('#result').style.color = messageColor;
     }
 }



 function countResult(winner) {

     if (winner === YOU) {
         blackjackGame['win']++;
         document.querySelector('#win').textContent = blackjackGame['win'];
     } else if (winner === DEALER) {
         blackjackGame['loss']++;
         document.querySelector('#loss').textContent = blackjackGame['loss'];
     } else {
         blackjackGame['draw']++;
         document.querySelector('#draw').textContent = blackjackGame['draw'];
     }

 }