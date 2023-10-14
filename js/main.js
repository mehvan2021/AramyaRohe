let player_1 = document.querySelector("#player-1");
let player_2 = document.querySelector("#player-2");
let lucky_btn = document.querySelector("#lucky-btn");
let close_btn = document.querySelector("#btn-close");
let save_btn = document.querySelector("#btn-save");
let out_btn = document.querySelector("#btn-out");
let show_results_btn = document.querySelector("#show-results");
let get_lucky_again_btn = document.querySelector("#get-lucky-again");
let main_container = document.querySelector(".main-container");
let animation_container = document.querySelector(".animation-container");
let carousel_container = document.querySelector(".carousel-container");
let carousel_inner = document.querySelector(".carousel-inner");
let carousel_indicators = document.querySelector(".carousel-indicators");
let results_container = document.querySelector(".results-container");
let player_result = document.querySelector(".player_result");
let player_1_title = document.querySelector("#player_1_title");
let player_1_imgs = document.querySelector("#player_1_imgs");
let player_2_title = document.querySelector("#player_2_title");
let player_2_imgs = document.querySelector("#player_2_imgs");
let players_title = document.querySelector("#players_title");
let players_response = document.querySelector("#players_response");
let results = document.querySelector(".results");

const clearVariables = () => {
  carousel_inner.innerHTML = "";
  carousel_indicators.innerHTML = "";
  player_1_title.innerHTML = "";
  player_1_imgs.innerHTML = "";
  player_2_title.innerHTML = "";
  player_2_imgs.innerHTML = "";
  players_title.innerHTML = "";
  players_response.innerHTML = "";
};

const getMultipleRandom = (arr, num) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

const setRandomCards = (arr, number, cards) => {
  const player_cards = getMultipleRandom(arr, 3);
  player_cards.map((card) => {
    card["player"] = number;
    cards.push(card);
  });
  return player_cards;
};

const getRandomCards = async (game) => {
  let cards = [];
  const response = await fetch("./data.json");
  const arr = await response.json();
  const cards_player_1 = setRandomCards(arr, 1, cards);
  const cards_player_2 = setRandomCards(arr, 2, cards);
  let result = 0;
  cards_player_1.map((item) => (result += item.value_int));
  cards_player_2.map((item) => (result += item.value_int));
  game["player_1"]["cards"] = cards_player_1;
  game["player_2"]["cards"] = cards_player_2;
  game["result"] = result;
  cards.sort((c) => c.player);
  cards.map((card, index) => {
    carousel_indicators.innerHTML += `
    <button 
    type="button" 
    data-bs-target="#cardsCarousel" 
    data-bs-slide-to=${index} 
    aria-label="Slide ${index + 1}"
    ${index == 0 ? "class='active'" : null} 
    ${index == 0 ? "aria-current='true'" : null} 
    ></button>
    `;
    carousel_inner.innerHTML += `
    <div class="carousel-item ${index == 0 ? "active" : ""}">
    <h5>CARTA ${index + 1}/6 de ${
      card.player == 1 ? `${player_1.value}` : `${player_2.value}`
    }</h5 >
      <img src="${card.img}" alt="${card.name}" class="carousel-img">
        <h3>${card.name}</h3>
        <p>${card.desc}</p>
      </div>
    `;
  });
  return game;
};

const openModal = () => {
  close_btn.addEventListener("click", () => {
    // eslint-disable-next-line no-undef
    var myModal = new bootstrap.Modal(document.getElementById("modal"));
    myModal.show();
  });
};
const closeModal = () => {
  close_btn.addEventListener("click", () => {
    // eslint-disable-next-line no-undef
    var myModal = new bootstrap.Modal(document.getElementById("modal"));
    myModal.hide();
  });
};

const saveResults = (game) => {
  main_container.classList.remove("d-none");
  results_container.classList.add("d-none");
  let gamesLocalStorage = JSON.parse(localStorage.getItem("games"));
  if (gamesLocalStorage === null) {
    let games = [game];
    localStorage.setItem("games", JSON.stringify(games));
  } else {
    gamesLocalStorage.push(game);
    localStorage.setItem("games", JSON.stringify(gamesLocalStorage));
  }
  gamesLocalStorage = JSON.parse(localStorage.getItem("games"));
  const player_1_ls = game["player_1"]["name"];
  const player_2_ls = game["player_2"]["name"];
  const result_ls = game["result"];
  const result = document.createElement("div");
  result.classList.add("d-flex");
  result.classList.add("justify-content-between");
  result.innerHTML = `
        <h5>
          ${player_1_ls} & ${player_2_ls}
        </h5>
        <h5>${result_ls}</h5>
      `;
  results.appendChild(result);
};

const showResults = (game) => {
  closeModal();
  carousel_container.classList.add("d-none");
  results_container.classList.remove("d-none");
  player_1_title.innerHTML = game["player_1"]["name"];
  player_1_imgs.innerHTML = "";
  game["player_1"]["cards"].map((card) => {
    let img_container = document.createElement("div");
    img_container.innerHTML += `
        <img src=${card.img} class="rounded-circle" alt=${card.name}>
        <p>${card.name}</p>
        `;
    player_1_imgs.appendChild(img_container);
  });
  player_2_title.innerHTML = game["player_2"]["name"];
  player_2_imgs.innerHTML = "";
  game["player_2"]["cards"].map((card) => {
    let img_container = document.createElement("div");
    img_container.innerHTML += `
        <img src=${card.img} class="rounded-circle" alt=${card.name}>
        <p>${card.name}</p>
        `;
    player_2_imgs.appendChild(img_container);
  });
  players_title.innerHTML = "¿Es match?";
  players_response.innerHTML = game["result"] > 0 ? "SI" : "NO";
  save_btn.addEventListener("click", () => {
    saveResults(game);
    clearVariables();
    closeModal();
  });
};

const getFormData = () => {
  let game = {};
  gamesLocalStorage = JSON.parse(localStorage.getItem("games"));
  if (gamesLocalStorage !== null) {
    results.classList.remove("d-none");
    gamesLocalStorage.map((item) => {
      const player_1_ls = item["player_1"]["name"];
      const player_2_ls = item["player_2"]["name"];
      const result_ls = item["result"];
      const result = document.createElement("div");
      result.classList.add("d-flex");
      result.classList.add("justify-content-between");
      result.innerHTML = `
          <h5>
            ${player_1_ls} & ${player_2_ls}
          </h5>
          <h5>${result_ls}</h5>
        `;
      results.appendChild(result);
    });
  }
  lucky_btn.addEventListener("click", () => {
    game["player_1"] = { id: 1, name: player_1.value, cards: [] };
    game["player_2"] = { id: 2, name: player_2.value, cards: [] };
    main_container.classList.add("d-none");
    animation_container.classList.remove("d-none");
    setTimeout(function () {
      animation_container.classList.add("d-none");
      carousel_container.classList.remove("d-none");
    }, 3000);
    getRandomCards(game).then((game) => {
      openModal();
      show_results_btn.addEventListener("click", () => {
        showResults(game);
      });
    });
    console.log("getRandomCards", game)
  });
};

get_lucky_again_btn.addEventListener("click", () => {
  carousel_container.classList.add("d-none");
  main_container.classList.remove("d-none");
  clearVariables();
  closeModal();
});

out_btn.addEventListener("click", () => {
  results_container.classList.add("d-none");
  main_container.classList.remove("d-none");
  clearVariables();
  closeModal();
});

getFormData();
