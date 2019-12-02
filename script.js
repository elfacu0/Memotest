let cardsContainer = document.querySelector("#cards-container");
let scoreContainer = document.querySelector("#score");
let quantityOfCardsContainer = document.querySelector("#cards");
let timeContainer = document.querySelector("#timer");
let failsContainer = document.querySelector("#fails");
quantityOfCardsContainer.addEventListener("change", function (e) {
    if (this.value % 2 == 0) {
        quantityOfCards = this.value;
    } else {
        quantityOfCards = (this.value % 2) + this.value;
    }
})
let cardsUsed = []; // to no use the same pokemon
let cards = []; //all cards in use
let quantityOfCards = quantityOfCardsContainer.value;
let appenededCards = []; // used cards
let lastCard = "";
let cardsDiscovered = 0; //when this is the same as the quantity of cards means end of game
let flippedCards = 0;  // flipped cards 0 when 2 and starts again
let flippedCardsArray = [];  // flippedcards divs
let playerTurn = true;
let score = 0;
let initialTime = 0;
let actualTime = 0;
let fails = 0;
let firstClick = false;
cardsContainer.addEventListener("click", function (e) {
    if (playerTurn) {
        if (firstClick == false) {
            setTime();
        }
        firstClick = true;
        if (e.path[2].classList[0] == "flip-card-inner") {
            let actualCard = e.path[3].id;
            e.path[2].classList.add("flipcard");
            flippedCardsArray.push(e.path[2]);
            flippedCards++;
            if (actualCard == lastCard && flippedCardsArray[0] != flippedCardsArray[1]) {
                removeCards(actualCard);
                score += 10;
                updateScore();
                flippedCards = 0;
                flippedCardsArray = [];
            }
            if (flippedCards >= 2) {
                playerTurn = false;
                fails++;
                failsContainer.innerText = `Fails: ${fails}`;
                setTimeout(function () {
                    flippedCardsArray[0].classList.remove("flipcard");
                    flippedCardsArray[1].classList.remove("flipcard");
                    flippedCards = 0;
                    flippedCardsArray = [];
                    actualCard = "";
                    lastCard = "";
                    playerTurn = true;
                }, 1200);
            }
            lastCard = actualCard;
        }
    }
});

// cardsContainer.addEventListener("transitionend",()=>playerTurn = true);

function populateCards() {
    var requestURL = `https://pokeapi.co/api/v2/pokemon/${Math.ceil(Math.random() * 600)}`;
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();

    request.onload = function () {
        cardsContainer = document.querySelector("#cards-container");
        var pokemon = request.response;
        if (cardsUsed.includes(pokemon.name) == false) {
            cardsUsed.push(pokemon.name);
            cards.push(pokemon);
            let pokemonAppened = { count: 0 };
            appenededCards.push(pokemonAppened);
            if ((quantityOfCards / 2) > cards.length) {
                populateCards();
            }
            if (cards.length == (quantityOfCards / 2)) {
                appendCards();
            }
        } else {
            populateCards();
        }
    }
}

function addCards(actualscore = 0) {
    cards = [];
    cardsUsed = [];
    appenededCards = [];
    lastCard = '';
    cardsDiscovered = 0;
    flippedCards = 0;
    flippedCardsArray = [];
    playerTurn = true;
    cardsContainer.innerHTML = "";
    cardsRemoved = 0;
    score = actualscore;
    if (actualscore = 0) {
        firstClick = false;
    }
    updateScore();
    populateCards();
}

function appendCards() {
    while (cardsContainer.children.length < quantityOfCards) {
        let definepokemon = Math.floor(Math.random() * cards.length);
        if (appenededCards[definepokemon].count < 2) {
            pokemon = cards[definepokemon];
            pokemon_src = pokemon.sprites.front_default;
            if (Math.random() <= 0.05) {
                pokemon_src = pokemon.sprites.front_shiny;
            }
            let ad = document.createElement("div");
            ad.id = pokemon.name;
            ad.innerHTML += `<div class="flip-card" id="${pokemon.name}">
            <div class="flip-card-inner">
              <div class="flip-card-front" style="width:200px;height:200px;">
                <img src="https://png2.cleanpng.com/sh/7fbfca594102e35be229f98185020a25/L0KzQYm3UsE1N514fZH0aYP2gLBuTf9zb5JzgexqdHnyfn7qiPltbF5qhuZucoD1ecTsTgJme5D6itVuLYDvcbB1if5oNZ5mReV6dXH1dX76iPFxbV5ohNt5YYL3g368gcg1QZc9StVvYkLnR3ACU8g4PGk3SKMAMUi5RIK3UsY5PWE8RuJ3Zx==/kisspng-organization-child-enterprise-resource-planning-ma-square-shape-cliparts-5a849f82cfb2d7.9387482015186410268507.png" alt="block" style="width:200px;height:200px;">
              </div>
              <div class="flip-card-back">
                <img src="${pokemon_src}" alt="pokemon.name" style="width:200px;height:200px;">
              </div>
            </div>
          </div>`;
            cardsContainer.appendChild(ad);

            appenededCards[definepokemon].count += 1;
        }
    }
}

let cardsRemoved = 0;
function removeCards(cardToRemove) {
    cardsRemoved += 2;
    setTimeout(function () {
        for (let i = 0; i < cardsContainer.children.length; i++) {
            if (cardsContainer.children[i].id == cardToRemove) {
                cardsContainer.children[i].style.visibility = "hidden";
            }
        }
        if (cardsRemoved == quantityOfCards) {
            console.log("OYU WIN");
            cards = [];
            cardsUsed = [];
            appenededCards = [];
            score += 100;
            updateScore();
            addCards(score);
        }
    }, 800);

}

function updateScore() {
    scoreContainer.textContent = `Score: ${score}`;
}

function setTime() {
    let d = new Date();
    initialTime = d.getTime();
    actualTime = 0;
    fails = 0;
    let timer = setInterval(myTimer, 1000);
}

function myTimer() {
    var d = new Date();
    var t = d.getTime();
    timeContainer.innerText = `Time: ${Math.floor((t - initialTime) / 1000)}`;
}

function stopTimer() {
    clearInterval(timer);
}