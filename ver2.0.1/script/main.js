  var myTTTapp = angular.module('myTTTapp', ["firebase"]);

  // TICTACTOE CONTROLLER
  myTTTapp.controller('TTTCtrl', function($scope,$firebase) {
  // Connect to Firebase database
  $scope.remoteGameContainer = $firebase(new Firebase("https://awesomeapp.firebaseio.com/myTTTapp"));
  // Global Array to store gameContainer.FBgameBoard ID for each cell
  // .name: store the tile name
  // .status: to keep track of current status and update tile according to gameController.FBplayer move
  // .poll: to display based on user and spectator
$scope.gameBoard = [
  {name:"c0",status:"lossClass",poll:0},
  {name:"c1",status:"lossClass",poll:0},
  {name:"c2",status:"lossClass",poll:0},
  {name:"c3",status:"lossClass",poll:0},
  {name:"c4",status:"lossClass",poll:0},
  {name:"c5",status:"lossClass",poll:0},
  {name:"c6",status:"lossClass",poll:0},
  {name:"c7",status:"lossClass",poll:0},
  {name:"c8",status:"lossClass",poll:0}
  ];
  // TIMER to keep track of each gameController.FBplayer total play time, to be used as a tie breaker
  $scope.gameClock=0;
  // Counter to make sure alternate between noughts and crosses
  $scope.count = 0;
  // CurrentWinner to do announcement - First one by default
  $scope.gameWinnerID=0;
  // See if this is the firs gameController.FBplayer turn
  $scope.isFirstPlayerTurn=true;
  // Game Status for rendering graphic and announcement
  $scope.isGameOver = false;
  // Tie in case
  var tie = false;
  // Winning Scenario Based on winningMoves index
  $scope.winScene = "";
  // gameController.FBplayer Info (name, score, time on a currentgame, current tile choice, current's turn)
  $scope.player = [
  {name:"",score:0,waitTime:0, tilechoice:"X", board:["0","0","0","0","0","0","0","0","0"]},
  {name:"",score:0,waitTime:0, tilechoice:"O", board:["0","0","0","0","0","0","0","0","0"]}
  ];
// START OF RICHARD SECTION
 // This container object is what gets synced:
  $scope.gameContainer = {
    FBgameContainer: $scope.gameBoard,
    FBcount: $scope.count,
    FBplayer: $scope.player
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
  console.log('gameCountainer changed!') ;
  }) ;
// END OF RICHARD SECTION


  // Decide who goes first - Default settings
  var firstplayer=0;
  var secondplayer=1;
  // Standard set of winning possibilities - only 8
  var winningMoves = ["111000000",
                      "000111000",
                      "000000111",
                      "100100100",
                      "010010010",
                      "001001001",
                      "100010001",
                      "001010100"];
  // Update gameController.FBplayer Info once that is click and hide the input form
  $scope.updategame = function(){
    // Start Recording play time for each gameController.FBplayer
    $scope.gameClock = Date.now();

    // Assign first tile's choice for each user
    if ($scope.gameController.FBplayer[0].tilechoice=="X"){
      $scope.gameController.FBplayer[1].tilechoice = "O";
    }
    else
    {
      $scope.gameController.FBplayer[1].tilechoice = "X";
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
        thisTile.status = $scope.gameController.FBplayer[firstgameController.FBplayer].tilechoice;
        // Update first gameController.FBplayer board
        $scope.gameController.FBplayer[firstgameController.FBplayer].board[this.$index] = 1;
        // Update time
        $scope.gameController.FBplayer[firstgameController.FBplayer].waitTime=deltaTime + $scope.gameController.FBplayer[firstgameController.FBplayer].waitTime;
      }
      // SECOND MOVE
      else 
        {
        thisTile.status = $scope.gameController.FBplayer[secondgameController.FBplayer].tilechoice;
        // Update 2nd gameController.FBplayer board
        $scope.gameController.FBplayer[secondgameController.FBplayer].board[this.$index] = 1;
        // Update time
        $scope.gameController.FBplayer[secondgameController.FBplayer].waitTime=deltaTime + $scope.gameController.FBplayer[secondgameController.FBplayer].waitTime;
      }

      // Let's find out the winner after every tile click
      if (judgeGame($scope.gameController.FBplayer[firstgameController.FBplayer].board)) {
        announcer(firstgameController.FBplayer);
      }
      else if (judgeGame($scope.gameController.FBplayer[secondgameController.FBplayer].board)) {
        announcer(secondgameController.FBplayer);
      }
      else if (tie) {
        $scope.gameController.FBplayer[secondgameController.FBplayer].waitTime <= $scope.gameController.FBplayer[secondgameController.FBplayer].waitTime ?
        announcer(secondgameController.FBplayer) : announcer(firstgameController.FBplayer); 
      };
      // Change to who is the next gameController.FBplayer
      $scope.isFirstPlayerTurn=!$scope.isFirstPlayerTurn;
      // updatemove counter
      $scope.gameContainer.FBcount++;
    }
  };

  // WINNING RENDERING AND ANNOUCEMENT
  var announcer = function(winnerID){
    updateBoard();
    $scope.gameWinnerID = winnerID;
    $scope.gameController.FBplayer[winnerID].score++;
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
          $scope.gameContainer.FBgameContainer.FBgameBoard[i].name = "lossClass";
        }
      };
    }
  };


  // RELOAD THE GAME
  $scope.reloadGame = function(){
    // Resetting all values back to default
    $scope.gameController.FBplayer[0].board = ["0","0","0","0","0","0","0","0","0"];
    $scope.gameController.FBplayer[1].board = ["0","0","0","0","0","0","0","0","0"];
    $scope.gameController.FBplayer[0].waitTime =0;
    $scope.gameController.FBplayer[1].waitTime =0;
    $scope.gameContainer.FBgameBoard = [
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
    $scope.gameContainer.FBcount = 0;
    tie = false;
    $scope.winScene = "";
    $scope.isGameOver = false;
  };

  // Game TOTAL RESET
  $scope.resetGame = function(){
    $scope.reloadGame();
    $scope.gameController.FBplayer[0].score = 0;
    $scope.gameController.FBplayer[1].score = 0;
  };
  //  MOUSE OVER to Change Color, only perform if mouse is still playable
  $scope.mouseEnterTile = function (thisTile){
    if (thisTile.status == "0" && thisTile.name != "lossClass") {
      thisTile.status = "H";
      thisTile.poll++;
    };
  };

  // RETURN origin tile when mouse leave
  $scope.mouseLeaveTile = function (thisTile){
    if (thisTile.status == "H") {
      thisTile.status = "0";
      thisTile.poll--;
    };
  };
});





