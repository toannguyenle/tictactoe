  var myTTTapp = angular.module('myTTTapp', []);

  // TICTACTOE CONTROLLER
  myTTTapp.controller('TTTCtrl', function ($scope) {

  // Tile Choice for the first and second move
  var firstTile="X";
  var secondTile="O";

  // TIMER to keep track of each player total play time, to be used as a tie breaker
  $scope.gameClock=0;

  // Player Info (name, score, time on a currentgame, current tile choice, current's turn)
  $scope.player = [
  {name:"",score:0,time:0, tilechoice:"X", board:["0","0","0","0","0","0","0","0","0"], playTurn:true},
  {name:"",score:0,time:0, tilechoice:"O", board:["0","0","0","0","0","0","0","0","0"], playTurn:false}
  ];

  // Update Player Info once that is click and hide the input form
  $scope.updatePlayer = function(){
    firstTile=$scope.player[0].tilechoice;
    // Start Recording play time for each player
    $scope.gameClock = Date.now();

    if (firstTile=="X"){
      secondTile = "O";
    }
    else
    {
      secondTile = "X";
    }
  };

  // Global Array to store gameBoard ID for each cell
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
  // Tie in case
  var tie = false;

  // Winning Scenario Based on winningMoves index
  $scope.winScene = "";

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
      };
        //Tie
        if (i==(winningMoves.length-1) && (winPoint==3)){
          tie=true;
        };
    };
    return result;
  };

  //chooseTile
  $scope.chooseTile = function(thisTile){
    // Time Between plays
    var deltaTime = Date.now()-$scope.gameClock;
    $scope.gameClock = Date.now();
    if (thisTile.status=='H'){
    // to alternate between noughts and crosses
    // FIRST MOVE
    if (($scope.count % 2) == 0) {
      thisTile.status = firstTile;
      // Update user1 board
      $scope.player[0].board[this.$index] = 1;
      // Update time
      $scope.player[0].time=deltaTime + $scope.player[0].time;
    }
    // SECOND MOVE
    else 
      {
      thisTile.status = secondTile;
      // Update user2 board
      $scope.player[1].board[this.$index] = 1;
      // Update time
      $scope.player[1].time=deltaTime + $scope.player[1].time;
    }
    
    // update move counter
    $scope.count++;

    // Let's find out the winner
    if (judgeGame($scope.player[0].board)) {
      announcer(firstTile); //Announce the winner
      $scope.player[0].score++; //Update score
      tie = false;
    }
    if (judgeGame($scope.player[1].board)) {
      announcer(secondTile);
      $scope.player[1].score++;
      tie = false;
    };
    if (($scope.count==9)&&(tie)) {
      announcer("TIE");
    };
    }
  };

  // WINNING RENDERING AND ANNOUCEMENT
  var announcer = function(result){
    if (result=="TIE") {
      alert("TIE GAME!" + tie);
    };
    if (result == "X") {
      updateBoard();
    };
    if (result == "O") {
      updateBoard();
    };
  };

  // RENDER BOARD WITH WINNING COMBINATION
  // Assign a CSS Class lossClass to tile that is loss so it's dimmed and not clickeable
  var updateBoard = function () {
    var winMove = winningMoves[$scope.winScene].split("");
    for (var i = 0; i < winMove.length; i++) {
      if (winMove[i] == "0") {
        $scope.gameBoard[i].name = "lossClass";
      };
    };
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

  // RELOAD THE GAME
  $scope.reloadGame = function(){
    // Resetting all values back to default
    $scope.player[0].board = ["0","0","0","0","0","0","0","0","0"];
    $scope.player[1].board = ["0","0","0","0","0","0","0","0","0"];
    $scope.player[0].time =0;
    $scope.player[1].time =0;
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

  // Making sure the winner of the last game pick and play first
    
  };
});





