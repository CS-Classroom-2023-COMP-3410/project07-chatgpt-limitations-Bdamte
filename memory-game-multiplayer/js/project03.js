    // DOM Elements
    const gameGrid = document.getElementById("gameGrid");
    const moveCounter = document.getElementById("moveCounter");
    const timer = document.getElementById("timer");
    const restartBtn = document.getElementById("restartBtn");
    const startGameBtn = document.getElementById("startGameBtn");
    const gridRowsInput = document.getElementById("gridRows");
    const gridColsInput = document.getElementById("gridCols");
    const welcomeContainer = document.querySelector(".welcome-container");
    const gameContainer = document.querySelector(".game-container");
    const playerTurnEl = document.getElementById("playerTurn");
    const player1ScoreEl = document.getElementById("player1Score");
    const player2ScoreEl = document.getElementById("player2Score");

    // Game State Variables
    let cards = [];
    let flippedCards = [];
    let moves = 0;
    let timerInterval = null;
    let timeElapsed = 0;
    let gridRows = 4;
    let gridCols = 4;

    // Player data for head-to-head functionality
    let players = [
      { name: "Player 1", score: 0 },
      { name: "Player 2", score: 0 }
    ];
    let currentPlayerIndex = 0; // 0 for Player 1, 1 for Player 2

    // List of animal image filenames
    const animalImages = [
      "cat.png", "dog.png", "elephant.png", "fox.png", "lion.png",
      "monkey.png", "panda.png", "rabbit.png", "tiger.png", "zebra.png"
    ];

    // Start Game Button Handler
    startGameBtn.addEventListener("click", () => {
      gridRows = parseInt(gridRowsInput.value);
      gridCols = parseInt(gridColsInput.value);
      const totalCards = gridRows * gridCols;

      if (
        gridRows >= 2 && gridRows <= 10 &&
        gridCols >= 2 && gridCols <= 10 &&
        totalCards % 2 === 0
      ) {
        welcomeContainer.classList.add("hidden");
        gameContainer.classList.remove("hidden");
        initializeGame();
      } else {
        alert("Invalid grid size! Ensure the total number of cards is even and values are between 2 and 10.");
      }
    });

    // Initialize or Restart the Game
    function initializeGame() {
      // Reset head-to-head player info
      players = [
        { name: "Player 1", score: 0 },
        { name: "Player 2", score: 0 }
      ];
      currentPlayerIndex = 0;
      updateTurnDisplay();
      updateScoreDisplay();

      const totalCards = gridRows * gridCols;
      const uniquePairs = totalCards / 2;

      // Select images (cycling through the list if necessary)
      const selectedImages = [];
      for (let i = 0; i < uniquePairs; i++) {
        selectedImages.push(animalImages[i % animalImages.length]);
      }

      const cardPairs = [...selectedImages, ...selectedImages];
      cards = shuffleArray(cardPairs);
      createGrid();
      resetGameInfo();
      startTimer(); // Start the timer as the game begins
    }

    // Shuffle helper function
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    // Create the card grid dynamically
    function createGrid() {
      gameGrid.innerHTML = "";
      gameGrid.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;

      cards.forEach((image) => {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.symbol = image; // Use image filename for matching
        card.innerHTML = `
          <div class="card-inner">
            <div class="card-front"></div>
            <div class="card-back"><img src="images/${image}" alt="Animal"></div>
          </div>
        `;
        card.addEventListener("click", handleCardClick);
        gameGrid.appendChild(card);
      });
    }

    // Handle card clicks
    function handleCardClick(e) {
      const clickedCard = e.currentTarget;

      if (
        clickedCard.classList.contains("flipped") ||
        clickedCard.classList.contains("matched") ||
        flippedCards.length === 2
      ) {
        return;
      }

      flippedCards.push(clickedCard);
      clickedCard.classList.add("flipped");

      if (flippedCards.length === 2) {
        moves++;
        moveCounter.textContent = moves;
        checkForMatch();
      }
    }

    // Check whether the two flipped cards match
    function checkForMatch() {
      const [card1, card2] = flippedCards;

      if (card1.dataset.symbol === card2.dataset.symbol) {
        // If they match, mark as matched and update current player's score
        card1.classList.add("matched");
        card2.classList.add("matched");
        players[currentPlayerIndex].score++;
        updateScoreDisplay();
        flippedCards = [];

        // Check if all cards have been matched
        if (document.querySelectorAll(".card.matched").length === cards.length) {
          clearInterval(timerInterval);
          let winner;
          if (players[0].score > players[1].score) {
            winner = players[0].name;
          } else if (players[1].score > players[0].score) {
            winner = players[1].name;
          } else {
            winner = "No one, it's a tie";
          }
          alert(`Game completed in ${moves} moves and ${formatTime(timeElapsed)}! Winner: ${winner}`);
        }
        // Optional: Uncomment the next line if you want to switch turns even when a match is made.
        // switchTurn();
      } else {
        // If not a match, flip the cards back over and switch turns
        setTimeout(() => {
          card1.classList.remove("flipped");
          card2.classList.remove("flipped");
          flippedCards = [];
          switchTurn();
        }, 1000);
      }
    }

    // Switch the turn to the next player
    function switchTurn() {
      currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
      updateTurnDisplay();
    }

    // Update the UI element that shows whose turn it is
    function updateTurnDisplay() {
      playerTurnEl.textContent = `Current Turn: ${players[currentPlayerIndex].name}`;
    }

    // Update the UI elements for both players' scores
    function updateScoreDisplay() {
      player1ScoreEl.textContent = `${players[0].name} Score: ${players[0].score}`;
      player2ScoreEl.textContent = `${players[1].name} Score: ${players[1].score}`;
    }

    // Timer functions
    function startTimer() {
      timeElapsed = 0;
      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        timeElapsed++;
        timer.textContent = formatTime(timeElapsed);
      }, 1000);
    }

    function formatTime(seconds) {
      return new Date(seconds * 1000).toISOString().substr(14, 5);
    }

    // Reset moves and timer
    function resetGameInfo() {
      moves = 0;
      moveCounter.textContent = moves;
      clearInterval(timerInterval);
      timer.textContent = "00:00";
    }

    // Restart Button Handler
    restartBtn.addEventListener("click", () => {
      gameContainer.classList.add("hidden");
      welcomeContainer.classList.remove("hidden");
      clearInterval(timerInterval);
      resetGameInfo();
    });