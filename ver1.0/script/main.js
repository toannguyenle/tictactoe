// Wait after the page is fully loaded to run the Game
window.onload = function(){
  initializeGame();
};

// THE GAME TIC TAC TOE
function initializeGame(){
  //GlobalArray to store User's moves on board, each user board is an array in a global array of 2 elements
  var userBoard = [["0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0"]];
  // Standard set of winning possibilities - only 8
  var winningMoves = ["111000000","000111000","000000111","100100100","010010010","001001001","100010001","001010100"];
  // Counter to make sure alternate between noughts and crosses
  var count = 0;
  // Tie in case
  var tie = false;
  // THE JUDGE
  function judgeGame(obj){
    var result = false;
    for (var i = 0; i < winningMoves.length; i++) {
      var winPoint = 0;
      // break into array
      var winMove = winningMoves[i].split("");
      for (var j = 0; j < winMove.length; j++) {
        if (winMove[j]*obj[j] == 1) {
          winPoint = winPoint + 1;
        };
        if (winPoint == 3) {
          // to break from both loop if we found a winning move
          result = true;
          i = winningMoves.length;
          break;
        };
      };
        //Tie
        if (i==(winningMoves.length-1)){
          tie=true;
        };
    };
    return result;
  };

  // CLOSURE chooseTile
  var chooseTile = function(){
  
    return function(){
      // to alternate between noughts and crosses
      this.innerHTML = ((count%2)==0) ? "X":"O";
      count++;
      // Make the tile not clickeable after a move is done
      this.style.pointerEvents = "none";
      //Update user's board with their move by reading the tile ID and the text value inside the tile
      userBoard[count%2][this.id.substr(this.id.length - 1)]=1;
      // person judging
      if (judgeGame(userBoard[0])) {
        alert("Player O wins!");
        tie = false;
      }
      if (judgeGame(userBoard[1])) {
        alert("Player X wins!");
      };
      if ((count==9)&(tie)) {
        alert("TIE!");
        tied = false;
      };
    };
  };


  // CLICK to Change AND Retain Value
  function clickTile(){
  for (var cellId = 0; cellId < 9; cellId++) {
    var currentCell = document.getElementById("c"+cellId);
    currentCell.addEventListener("click", chooseTile());
    };
  };

  //  MOUSE OVER to Change Color AND returns Color when MOUSE OUT
  function hoverTile(){
  var count = 0;
  for (var cellId = 0; cellId < 9; cellId++) {
    var currentCell = document.getElementById("c"+cellId);
    // MOUSE OVER TO SEE WHATS THE SELECTION IS
    currentCell.addEventListener("mouseover", function()
    {
      this.style.backgroundColor = "pink";
    });
    // MOUSE OUT TO RETURN ORIGINAL COLOR
    currentCell.addEventListener("mouseout", function()
    {
      this.style.backgroundColor = "red";
    });
    };
  };
  // SAMPLE FUNCTION CALL}
  clickTile();
  hoverTile();
};
