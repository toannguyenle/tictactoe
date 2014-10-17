  var myTTTapp = angular.module('myTTTapp', ["firebase"]);

  // TICTACTOE CONTROLLER
  myTTTapp.controller('TTTCtrl', function ($scope,$firebase) {
  // Connect to Firebase database for game
  $scope.remoteGameContainer = $firebase(new Firebase("https://awesomeapp.firebaseio.com/TTTgame"));
  // Another database for CHAT
  var chatRef = new Firebase("https://wdi2014.firebaseio.com/chatDatabase") ;
  $scope.allcomments = $firebase(chatRef.limit(10));

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
  {name:0,status:"lossClass"},
  {name:1,status:"lossClass"},
  {name:2,status:"lossClass"},
  {name:3,status:"lossClass"},
  {name:4,status:"lossClass"},
  {name:5,status:"lossClass"},
  {name:6,status:"lossClass"},
  {name:7,status:"lossClass"},
  {name:8,status:"lossClass"}
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
  // Game Manager to take care of time sync, number of players and spectators and chats
  $scope.gameManager = {
    currentPlayer:0,
    numberOfPlayer: 0,
    numberOfSpectator: 0,
    pollBoard:["0","0","0","0","0","0","0","0","0"]
  };
// This container object is what gets synced:
  $scope.gameContainer = {
    FBgameBoard: $scope.gameBoard,
    FBcount: $scope.count,
    FBplayer: $scope.player,
    FBisGameOver: $scope.isGameOver,
    FBgameManager: $scope.gameManager,
    FBspectatorManager: $scope.spectatorManager
  } ;
  // Everywhere else in your program, use $scope.gameContainer.cellListArray instead of cellList.
  // Everywhere else in your program, use $scope.gameContainer.clickCounter instead of clickCount.
  // Make that change in your ng-repeat as well and anywhere in your index.html as needed.

  // remoteGameContainer: that is the name you gave the Firebase node (looks like a folder in Firebase).
  // The bind statement creates a connection between anything in your app and the Firebase connection we just created.
   
  $scope.remoteGameContainer.$bind($scope, "gameContainer") ;
  // The bind statement will automatically update your model, in this case cellList, whenever it 
  // changes on Firebase.  But this will not trigger an Angular update of the interface (index.html)
  // - we've been relying on the ng-click to wake up Angular and get the gameContainer.FBgameContainer.FBgameBoard refreshed.
  // So we put a watch on cellList - this tells Angular to refresh the interface elements, ie ng-class,
  // whenever the model, in this case celList, changes.
  $scope.$watch('gameContainer', function() {
  }) ;
// END OF RICHARD SECTION

  $scope.updatePlayer = function(){
    // Start Recording play time for each player
    $scope.gameClock = Date.now();

    // Assign first tile's choice for each user
    if ($scope.gameContainer.FBplayer[0].tilechoice=="X"){
      $scope.gameContainer.FBplayer[1].tilechoice = "O";
    }
    else
    {
      $scope.gameContainer.FBplayer[1].tilechoice = "X";
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
        if (!result && $scope.gameContainer.FBcount==8){
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
      if (($scope.gameContainer.FBcount % 2) == 0) {
        thisTile.status = $scope.gameContainer.FBplayer[firstPlayer].tilechoice;
        // Update first player board
        $scope.gameContainer.FBplayer[firstPlayer].board[this.$index] = 1;
        // Update time
        $scope.gameContainer.FBplayer[firstPlayer].waitTime=deltaTime + $scope.gameContainer.FBplayer[firstPlayer].waitTime;
      }
      // SECOND MOVE
      else 
        {
        thisTile.status = $scope.gameContainer.FBplayer[secondPlayer].tilechoice;
        // Update 2nd player board
        $scope.gameContainer.FBplayer[secondPlayer].board[this.$index] = 1;
        // Update time
        $scope.gameContainer.FBplayer[secondPlayer].waitTime=deltaTime + $scope.gameContainer.FBplayer[secondPlayer].waitTime;
      }

      // Let's find out the winner after every tile click
      if (judgeGame($scope.gameContainer.FBplayer[firstPlayer].board)) {
        announcer(firstPlayer);
      }
      else if (judgeGame($scope.gameContainer.FBplayer[secondPlayer].board)) {
        announcer(secondPlayer);
      }
      else if (tie) {
        $scope.gameContainer.FBplayer[secondPlayer].waitTime <= $scope.gameContainer.FBplayer[secondPlayer].waitTime ?
        announcer(secondPlayer) : announcer(firstPlayer); 
      };
      // Change to who is the next player
      $scope.isFirstPlayerTurn=!$scope.isFirstPlayerTurn;
      // updatemove counter
      $scope.gameContainer.FBcount++;
    }
  };

  // WINNING RENDERING AND ANNOUCEMENT
  var announcer = function(winnerID){
    updateBoard();
    $scope.gameWinnerID = winnerID;
    $scope.gameContainer.FBplayer[winnerID].score++;
    $scope.gameContainer.FBisGameOver = true;
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
          $scope.gameContainer.FBgameBoard[i].name = "lossClass";
        }
      };
    }
  };


  // RELOAD THE GAME
  $scope.reloadGame = function(){
    // Resetting all values back to default
    $scope.gameContainer.FBplayer[0].board = ["0","0","0","0","0","0","0","0","0"];
    $scope.gameContainer.FBplayer[1].board = ["0","0","0","0","0","0","0","0","0"];
    $scope.gameContainer.FBplayer[0].waitTime =0;
    $scope.gameContainer.FBplayer[1].waitTime =0;
    $scope.gameContainer.FBgameBoard = [
    {name:0,status:"0"},
    {name:1,status:"0"},
    {name:2,status:"0"},
    {name:3,status:"0"},
    {name:4,status:"0"},
    {name:5,status:"0"},
    {name:6,status:"0"},
    {name:7,status:"0"},
    {name:8,status:"0"}
    ];
    $scope.gameContainer.FBcount = 0;
    tie = false;
    $scope.winScene = "";
    $scope.gameContainer.FBisGameOver = false;
  };

  // Game TOTAL RESET
  $scope.resetGame = function(){
    $scope.reloadGame();
    $scope.gameContainer.FBplayer[0].score = 0;
    $scope.gameContainer.FBplayer[1].score = 0;
  };
  //  MOUSE OVER to Change Color, only perform if mouse is still playable
  $scope.mouseEnterTile = function (thisTile){
    if (thisTile.status == "0" && thisTile.name != "lossClass") {
      thisTile.status = "H";
      $scope.gameContainer.FBgameManager.pollBoard[thisTile.name]++;
    };
  };

  // RETURN origin tile when mouse leave
  $scope.mouseLeaveTile = function (thisTile){
    if (thisTile.status == "H") {
      thisTile.status = "0";
      $scope.gameContainer.FBgameManager.pollBoard[thisTile.name]--;
    };
  };

  // CHAT MANAGER
  $scope.addComment = function () {
    chatRef.push({userComment:$scope.userComment});
    $scope.userComment = "";
  };

});





