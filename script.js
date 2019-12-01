let cardsContainer = document.querySelector("#cards-container");
let scoreContainer = document.querySelector("#score");
let cardsUsed = [];
let cards = [];
let quantityOfCards = 4;
let appenededCards = [];
let lastCard = "";
let cardsDiscovered = 0;
let flippedCards = 0;  // flipped cards max 2
let flippedCardsArray = []; 
let playerTurn = true;
let score = 0;
cardsContainer.addEventListener("click", function (e) {
    if (playerTurn) {
        if (e.path[2].classList[0] == "flip-card-inner") {
            let actualCard = e.path[3].id;
            console.log(e.path[3].id);
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
        console.log(pokemon.name);
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
    updateScore();
    populateCards();
}

function appendCards() {
    while (cardsContainer.children.length < quantityOfCards) {
        let definepokemon = Math.floor(Math.random() * cards.length);
        if (appenededCards[definepokemon].count < 2) {
            pokemon = cards[definepokemon];
            pokemon_src = pokemon.sprites.front_default;
            // var img = document.createElement("img");
            // img.src = pokemon_src;
            // img.dataset.name = pokemon.name;
            // cardsContainer.appendChild(img);
            let ad = document.createElement("div");
            ad.id = pokemon.name;
            ad.innerHTML += `<div class="flip-card" id="${pokemon.name}">
            <div class="flip-card-inner">
              <div class="flip-card-front" style="width:300px;height:300px;">
                <img src="https://png2.cleanpng.com/sh/7fbfca594102e35be229f98185020a25/L0KzQYm3UsE1N514fZH0aYP2gLBuTf9zb5JzgexqdHnyfn7qiPltbF5qhuZucoD1ecTsTgJme5D6itVuLYDvcbB1if5oNZ5mReV6dXH1dX76iPFxbV5ohNt5YYL3g368gcg1QZc9StVvYkLnR3ACU8g4PGk3SKMAMUi5RIK3UsY5PWE8RuJ3Zx==/kisspng-organization-child-enterprise-resource-planning-ma-square-shape-cliparts-5a849f82cfb2d7.9387482015186410268507.png" alt="block" style="width:200px;height:200px;">
              </div>
              <div class="flip-card-back">
                <img src="${pokemon_src}" alt="pokemon.name" style="width:250px;height:250px;">
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