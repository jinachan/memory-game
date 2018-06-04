/* Memory card game by Jina Chan for Udacity front-end nanodegree, May 2018
 *
 * Credit: my approach was informed by Mike Wales' webinar, https://www.youtube.com/watch?v=_rUH-sEs68Y
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

/*
 * Other variables 
 */
let faceUp = [];
let numMoves = 0;
let numMatches = 0;

/* 
 * DOM elements
 */
const deck = document.querySelector('.deck');
const moveCounter = document.querySelector('.moves');
const stars = document.querySelector('.stars');
/* For debugging: */
const mainHeader = document.querySelector('h1');
const restart = document.querySelector('.restart');


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
function flipCard (card) {
    // Toggle the classes so the card flips
    card.classList.toggle('open');
    card.classList.toggle('show');
}

function addShowingCard (card) {
    // Add card to faceUp array
    faceUp.push(card);

    mainHeader.textContent = 'Cards showing: ' + faceUp.length;  // Debugging
}

function removeShowingCard (card) {
    // Remove card from faceUp array
    faceUp.pop(card);

    mainHeader.textContent = 'Cards showing: ' + faceUp.length;  // Debugging
}

function lockMatchingCards (cards) {
    cards.forEach(function (c) {
        c.classList.add('match');
        c.classList.remove('open', 'show');
    });

    mainHeader.textContent = 'Matched!';  // Debugging
}

function matchFail (cards) {
    // No match: turn them both back over, with a delay
    setTimeout(function() {
        cards.forEach(function (c) {
            flipCard(c);
        });
    }, 500);
}

/*
* Define click event handler for each card
*/
function cardClickListener(event) {
    event.preventDefault();
    if (this.classList.contains('match')) {
        // The card is already matched: do nothing
        mainHeader.textContent = 'Already matched';  // Debugging
    } else {
        if ( (this.classList.contains('open')) && this.classList.contains('show') ) {
            // The card is already showing so we'll hide it
            flipCard(this);
            removeShowingCard(this);
        } else {
            // Check how many cards are already showing
            if (faceUp.length === 2) {
                // Two cards are already showing: do nothing
                 mainHeader.textContent = 'Not turning a 3rd card';  // Debugging
            } else {
                // Show the card
               flipCard(this);
               addShowingCard(this);
            }
        }
        // Increment the count of moves made
        numMoves++;
    }

    // If we have 2 cards up now, check for a match
    if (faceUp.length === 2) {
        if (faceUp[0].children[0].classList.value === faceUp[1].children[0].classList.value) {
            // It's a match
            mainHeader.textContent = 'Got a match';  // Debugging
            lockMatchingCards(faceUp);
            numMatches++;
        } else {
            mainHeader.textContent = 'Match failed';  // Debugging
            matchFail(faceUp);
        }
        faceUp = [];  // Either way, we have no cards left face up
    }

    // Update move counter
    moveCounter.textContent = numMoves;
    // TO DO: decrease stars <li>s as numMoves increases
    // TO DO: If all cards matched, show Congratulations popup
    
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

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

    let cardHTML = cards.map(function (card) {
        return generateCard(card);
    });

    deck.innerHTML =  cardHTML.join('');

    numMoves = 0;
    numMatches = 0;
    // Set move counter
    moveCounter.textContent = numMoves;

    // Add event listener to each card
    allCards = document.querySelectorAll('.card');
    allCards.forEach (function (card) {
        card.addEventListener('click', cardClickListener );
    });
}

initGame();

// Event listener for restart icon, that shuffles array and resets scoreboard
restart.addEventListener('click', initGame() );

