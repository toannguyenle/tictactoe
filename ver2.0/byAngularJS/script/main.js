  var myTTTapp = angular.module('myTTTapp', []);

  // TICTACTOE CONTROLLER
  myTTTapp.controller('TTTCtrl', function ($scope) {

  // Decide who goes first - Default settings
  var firstPlayer=0;
  var secondPlayer=1;
  // TIMER to keep track of each player total play time, to be used as a tie breaker
  $scope.gameClock=0;
  // Player Info (name, score, time on a currentgame, current tile choice, current's turn)
  $scope.player = [
  {name:"",score:0,waitTime:0, tilechoice:"X", board:["0","0","0","0","0","0","0","0","0"]},
  {name:"",score:0,waitTime:0, tilechoice:"O", board:["0","0","0","0","0","0","0","0","0"]}
  ];
  // Global Array to store gameBoard ID for each cell
  $scope.gameBoard = [
  {name:"c0",status:"lossClass"},
  {name:"c1",status:"lossClass"},
  {name:"c2",status:"lossClass"},
  {name:"c3",status:"lossClass"},
  {name:"c4",status:"lossClass"},
  {name:"c5",status:"lossClass"},
  {name:"c6",status:"lossClass"},
  {name:"c7",status:"lossClass"},
  {name:"c8",status:"lossClass"}
  ];
  // Standard set of winning possibilities - only 8
  var winningMoves = ["111000000",
                      "000111000",
                      "000000111",
                      "100100100",
                      "010010010",
                      "001001001",
                      "100010001",
                      "001010100"];
  // Counter to make sure alternate between noughts and crosses
  $scope.count = 0;
  // CurrentWinner to do announcement - First one by default
  $scope.gameWinnerID=0;
  // See if this is the firs Player turn
  $scope.isFirstPlayerTurn=true;
  // Game Status for rendering graphic and announcement
  $scope.isGameOver = false;
  // Tie in case
  var tie = false;
  // Winning Scenario Based on winningMoves index
  $scope.winScene = "";
  // Update Player Info once that is click and hide the input form
  $scope.updatePlayer = function(){
    // Start Recording play time for each player
    $scope.gameClock = Date.now();

    // Assign first tile's choice for each user
    if ($scope.player[0].tilechoice=="X"){
      $scope.player[1].tilechoice = "O";
    }
    else
    {
      $scope.player[1].tilechoice = "X";
    }
  };

  // THE JUDGE
  var judgeGame = function (obj){
    var result = false;
    for (var i = 0; i < winningMoves.length; i++) {
      var winPoint = 0;
      // break into array
      var winMove = winningMoves[i].split("");
      for (var j = 0; j < winMove.length; j++) {
        if (winMove[j]*obj[j] == 1) {
          winPoint++;
        }
        if (winPoint == 3) {
          // to break from both loop if we found a winning move
          result = true;
          // Assign winning scenario for winning rendering
          $scope.winScene=i;
          // To get out of the first loop
          i = winningMoves.length;
          break;
        }
        if (!result && $scope.count==8){
          tie=true;
        };
      };
    };
    return result;
  };

  //chooseTile
  $scope.chooseTile = function(thisTile){
    // Time Between plays
    var deltaTime = Date.now()-$scope.gameClock;
    var winnerID = "";
    $scope.gameClock = Date.now();
    if (thisTile.status=='H'){
      // to alternate between noughts and crosses
      // FIRST MOVE
      if (($scope.count % 2) == 0) {
        thisTile.status = $scope.player[firstPlayer].tilechoice;
        // Update first player board
        $scope.player[firstPlayer].board[this.$index] = 1;
        // Update time
        $scope.player[firstPlayer].waitTime=deltaTime + $scope.player[firstPlayer].waitTime;
      }
      // SECOND MOVE
      else 
        {
        thisTile.status = $scope.player[secondPlayer].tilechoice;
        // Update 2nd player board
        $scope.player[secondPlayer].board[this.$index] = 1;
        // Update time
        $scope.player[secondPlayer].waitTime=deltaTime + $scope.player[secondPlayer].waitTime;
      }

      // Let's find out the winner after every tile click
      if (judgeGame($scope.player[firstPlayer].board)) {
        announcer(firstPlayer);
      }
      else if (judgeGame($scope.player[secondPlayer].board)) {
        announcer(secondPlayer);
      }
      else if (tie) {
        alert();
        $scope.player[secondPlayer].waitTime <= $scope.player[secondPlayer].waitTime ?
        announcer(secondPlayer) : announcer(firstPlayer); 
      };
      // Change to who is the next player
      $scope.isFirstPlayerTurn=!$scope.isFirstPlayerTurn;
      // updatemove counter
      $scope.count++;
    }
  };

  // WINNING RENDERING AND ANNOUCEMENT
  var announcer = function(winnerID){
    updateBoard();
    $scope.gameWinnerID = winnerID;
    $scope.player[winnerID].score++;
    $scope.isGameOver = true;
    // Making sure the winner of the last game pick and play first
    // In an event of a tie, than the order is reverse
    if (winnerID==0){
      firstPlayer=1;
      secondPlayer=0;
      $scope.isFirstPlayerTurn=false;
    }
    else {
      firstPlayer=0;
      secondPlayer=1;
      $scope.isFirstPlayerTurn=true;
    };
  };

  // RENDER BOARD WITH WINNING COMBINATION
  // Assign a CSS Class lossClass to tile that is loss so it's dimmed and not clickeable
  var updateBoard = function () {
    if (!tie){
      var winMove = winningMoves[$scope.winScene].split('');
      for (var i = 0; i < winMove.length; i++) {
        if (winMove[i] == "0") {
          $scope.gameBoard[i].name = "lossClass";
        }
      };
    }
  };


  // RELOAD THE GAME
  $scope.reloadGame = function(){
    // Resetting all values back to default
    $scope.player[0].board = ["0","0","0","0","0","0","0","0","0"];
    $scope.player[1].board = ["0","0","0","0","0","0","0","0","0"];
    $scope.player[0].waitTime =0;
    $scope.player[1].waitTime =0;
    $scope.gameBoard = [
    {name:"c0",status:"0"},
    {name:"c1",status:"0"},
    {name:"c2",status:"0"},
    {name:"c3",status:"0"},
    {name:"c4",status:"0"},
    {name:"c5",status:"0"},
    {name:"c6",status:"0"},
    {name:"c7",status:"0"},
    {name:"c8",status:"0"}
    ];
    $scope.count = 0;
    tie = false;
    $scope.winScene = "";
    $scope.isGameOver = false;
  };

  // Game TOTAL RESET
  $scope.resetGame = function(){
    $scope.reloadGame();
    $scope.player[0].score = 0;
    $scope.player[1].score = 0;
  };
  //  MOUSE OVER to Change Color, only perform if mouse is still playable
  $scope.mouseEnterTile = function (thisTile){
    if (thisTile.status == "0" && thisTile.name != "lossClass") {
      thisTile.status = "H";
    };
  };

  // RETURN origin tile when mouse leave
  $scope.mouseLeaveTile = function (thisTile){
    if (thisTile.status == "H") {
      thisTile.status = "0";
    };
  };
});





