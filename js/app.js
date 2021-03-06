/* Memory card game by Jina Chan for Udacity front-end nanodegree, May 2018
 *
 * Credits: my approach was informed by Mike Wales' webinar, https://www.youtube.com/watch?v=_rUH-sEs68Y
 *          and by Pascal Meers' project planning tutorial, https://docs.google.com/document/d/1xI7Hk1uQtitVuU2lfgWGS4Ic4CWsGEr0L1P1Vt7IYMs/
 * 
 * Rubric: https://review.udacity.com/#!/rubrics/591/view
 * /

/*
 * Create a list that holds all of your cards
 */
let cards = ['fa-diamond', 'fa-diamond',
            'fa-paper-plane-o', 'fa-paper-plane-o',
            'fa-anchor', 'fa-anchor',
            'fa-bolt', 'fa-bolt',
            'fa-cube', 'fa-cube',
            'fa-leaf', 'fa-leaf',
            'fa-bicycle', 'fa-bicycle',
            'fa-bomb', 'fa-bomb'];

let allCards = [];

const maxStars = 3;

/*
 * Other variables 
 */
let faceUp = [];
let numMoves = 0;
let numMatches = 0;
let numStars = maxStars;
let timer;
let timerMinutes = 0;
let timerSeconds = 0;
let clickCount = 0;

/* 
 * DOM elements
 */
const deck = document.querySelector('.deck');
const moveCounter = document.querySelector('.moves');
const stars = document.querySelector('.stars');
const modal = document.querySelector('.modal');
const congratsMessage = document.querySelector('.congrats');
const closeButton = document.querySelector('.close-button');
const playAgainButton = document.querySelector('.play-again-button');
const restartButton = document.querySelector('.restart');
const timeCounter = document.querySelector('.timer-output');

/* For debugging: */
const mainHeader = document.querySelector('.container h1');

/*
 * Timer functions
 * Credit: Chris N, https://gwgnanodegrees.slack.com/files/UA8PXHUR3/FB0Q3CSMB/Getting_the_Memory_Game_timer_to_work
 */

function startTimer() {
    timer = setInterval(insertTime, 1000);
}

function stopTimer() {
    clearInterval(timer);
    timerSeconds = 0;
    timerMinutes = 0;
}

 function insertTime() {
    timerSeconds++;
    
    if (timerSeconds < 10) {
        timerSeconds = `0${timerSeconds}`;
    }
    
    if (timerSeconds >= 60) {
        timerMinutes++;
        timerSeconds = "00";
    }

    // display time
    timeCounter.innerHTML = timerMinutes + ":" + timerSeconds;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/* Helper functions */
function flipCard(card) {
    // Toggle the classes so the card flips
    card.classList.toggle('open');
    card.classList.toggle('show');
}

function addShowingCard(card) {
    // Add card to faceUp array
    faceUp.push(card);

    // mainHeader.textContent = 'Cards showing: ' + faceUp.length;  // Debugging
}

function removeShowingCard(card) {
    // Remove card from faceUp array
    faceUp.pop(card);

    // mainHeader.textContent = 'Cards showing: ' + faceUp.length;  // Debugging
}

function lockMatchingCards(cards) {
    cards.forEach(function (c) {
        c.classList.add('match');
        c.classList.remove('open', 'show');
    });

    // mainHeader.textContent = 'Matched!';  // Debugging
}

function matchFail(cards) {
    // No match: turn them both back over, with a delay
    setTimeout(function() {
        cards.forEach(function (c) {
            flipCard(c);
        });
    }, 500);
}

function generateStar() {
    return '<li><i class="fa fa-star"></i></li>';
}

function adjustScoreBoard() {
    // Update move counter
    moveCounter.textContent = numMoves;
    // mainHeader.textContent = 'Stars: ' + stars.outerHTML; // Debugging

    if (numMoves === 0) {
        // Initialize the stars
        // Create the HTML for 3 stars
        let starHTML = '';
        for (let i=0; i<maxStars; i++) {
            starHTML += generateStar();
            // mainHeader.textContent = 'starHTML: ' + starHTML; // Debugging
        }
        stars.innerHTML =  starHTML;
    } else if ( (numMoves === 20) || (numMoves === 30) ) {
        // Decrease stars <li>s as numMoves increases
        // Decrease stars by one -- remove the first star in the list
        // mainHeader.textContent = 'Removing a star: ' + stars.firstElementChild.outerHTML; // Debugging
        stars.firstElementChild.remove();
        numStars--;
    }
}

/*
 * Modal dialog box event handling
 * Credit: https://sabe.io/tutorials/how-to-create-modal-popup-box
 */
function toggleModal() {
    modal.classList.toggle('show-modal');
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal;
    }
}

closeButton.addEventListener('click', toggleModal);
window.addEventListener('click', windowOnClick);

function winGame() {
    congratsMessage.innerHTML = `<p>You won the game in ${timerMinutes}:${timerSeconds} in ${numMoves} moves, with ${numStars} stars`;
    stopTimer();
    toggleModal();
}

/*
* Define click event handler for each card
*/
function cardClickListener(event) {
    event.preventDefault();
    if (numMoves === 0) {
        startTimer();  // Start the timer with the first card-flip
    }

    if (this.classList.contains('match')) {
        // The card is already matched: do nothing
        // mainHeader.textContent = 'Already matched';  // Debugging
    } else {
        clickCount++;
        if ( (clickCount % 2) === 0) {
            // On every 2nd click, we increment the count of moves made.
            // If the player clicks a card twice (flips it over and back),
            // it counts as a move. Initially the move count only incremented
            // when two cards were face-up, but that meant the player could
            // cheat the game by flipping every card over and back, and none
            // of it was counted as a move.
            numMoves++;
            adjustScoreBoard();
        }
        if ( (this.classList.contains('open')) && this.classList.contains('show') ) {
            // The card is already showing so we'll hide it
            flipCard(this);
            removeShowingCard(this);
        } else {
            // Check how many cards are already showing
            if (faceUp.length === 2) {
                // Two cards are already showing: do nothing
                // mainHeader.textContent = 'Not turning a 3rd card';  // Debugging
            } else {
                // Show the card
               flipCard(this);
               addShowingCard(this);
            }
        }
    }

    if (faceUp.length === 2) {
        if (faceUp[0].children[0].classList.value === faceUp[1].children[0].classList.value) {
            // It's a match
            // mainHeader.textContent = 'Got a match';  // Debugging
            lockMatchingCards(faceUp);
            numMatches++;
        } else {
            // mainHeader.textContent = 'Sorry, not a match';  // Debugging
            matchFail(faceUp);
        }
        faceUp = [];  // Either way, we have no cards left face up
    }
 
    // If all cards matched, show Congratulations popup
    if (numMatches === ((cards.length)/2)) {
        winGame();
    }
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomindex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function generateCard(card) {
    return `<li class="card"><i class="fa ${card}"></i></li>`;
}

// Initialize game: shuffle array, create HTML card deck, initialize moves and matches
function initGame() {
    shuffle(cards);

    // Create the card elements
    let cardHTML = cards.map(function (card) {
        return generateCard(card);
    });

    deck.innerHTML =  cardHTML.join('');

    // Reset the click count, timer, and array of face-up cards
    clickCount = 0;
    if (timer) { stopTimer(); }
    faceUp = [];

    // Initialize the scoreboard
    numMoves = 0;
    numMatches = 0;
    numStars = maxStars;
    adjustScoreBoard();

    // Add event listener to each card
    allCards = document.querySelectorAll('.card');
    allCards.forEach (function (card) {
        card.addEventListener('click', cardClickListener );
    });
}

initGame();

// Event listener for restart icon, that shuffles array and resets scoreboard
restartButton.addEventListener('click', initGame);

// Event lsitener for play again button when game is won
playAgainButton.addEventListener('click', function() {
    toggleModal();
    initGame();
});