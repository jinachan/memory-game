/*
 * Create a list that holds all of your cards
 */
let allCards = document.querySelectorAll('.card');
let faceUp = [];

/* For debugging: */
const mainHeader = document.querySelector('h1');

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
// TO DO: All of the above

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

// TO DO: Add event listener to restart icon, to shuffle array and reset scoreboard

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
    // PROBLEM HERE: Only one card gets 'match' class set
    cards.forEach(function (c) {
        c.classList.add('match');
        c.classList.remove('open', 'show');
        //removeShowingCard(c);
    });

    mainHeader.textContent = 'Matched!';  // Debugging
}

function matchFail (cards) {
    // No match: turn them both back over, with a delay
    // PROBLEM HERE: Only one card flips over
    setTimeout(function() {
        cards.forEach(function (c) {
            flipCard(c);
            //removeShowingCard(c);
        });
    }, 500);
}

/*
* Add click event handler for each card
*/
allCards.forEach (function (card) {
    card.addEventListener('click', function (e) {
      if (card.classList.contains('match')) {
        // The card is already matched: do nothing
        mainHeader.textContent = 'Already matched';  // Debugging
      } else if ( (card.classList.contains('open')) && card.classList.contains('show') ) {
        // The card is already showing so we'll hide it
        flipCard(card);
        removeShowingCard(card);
      } else {
        // Check how many cards are already showing
        if (faceUp.length === 2) {
            // Two cards are already showing: do nothing
             mainHeader.textContent = 'Not turning a 3rd card';  // Debugging
        } else {
            // Show the card
            flipCard(card);
            addShowingCard(card);
        }
      }

      // If we have 2 cards up now, check for a match
      if (faceUp.length === 2) {
        if (faceUp[0].children[0].classList.value === faceUp[1].children[0].classList.value) {
            // It's a match
            mainHeader.textContent = 'Got a match';  // Debugging
            lockMatchingCards(faceUp);
        } else {
            mainHeader.textContent = 'Match failed';  // Debugging
            matchFail(faceUp);
        }
        faceUp = [];  // Either way, we have no cards left face up
      }
        // TO DO: Implement move counter
        // TO DO: If all cards matched, show final score
    });
  });