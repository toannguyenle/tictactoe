  var myTTTapp = angular.module('myTTTapp', []);

  myTTTapp.controller('TTTCtrl', function ($scope) {
    
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

  //Array to store User's moves on board, each user board is an array in a global array of 2 elements
  var userBoard = [["0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0"]];
  // Standard set of winning possibilities - only 8
  var winningMoves = ["111000000","000111000","000000111","100100100","010010010","001001001","100010001","001010100"];
  // Counter to make sure alternate between noughts and crosses
  $scope.count = 0;
  // Tie in case
  var tie = false;

  // Tile Style
  $scope.tileStyle = "";

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
        console.log(winPoint);
        if (winPoint == 3) {
          // to break from both loop if we found a winning move
          result = true;
          i = winningMoves.length;
          break;
        }
      };
        //Tie
        if (i==(winningMoves.length-1)){
          tie=true;
        };
    };
    return result;
  };

  //chooseTile
  $scope.chooseTile = function(thisTile){
    // to alternate between noughts and crosses
    if (($scope.count % 2) == 0) {
      thisTile.status = 'X';
      // Update user1 board
      userBoard[1][this.$index] = 1;}
    else 
      {
      thisTile.status = 'O';
      // Update user2 board
      userBoard[0][this.$index] = 1;}
    $scope.count++;

    // Let's find out the winner
    if (judgeGame(userBoard[1])) {
      alert("Player X wins!");
      tie = false;
    }
    if (judgeGame(userBoard[0])) {
      alert("Player O wins!");
      tie = false;
    };
    if (($scope.count==9)&(tie)) {
      alert("TIE!");
    };
  };


  //  MOUSE OVER to Change Color AND returns Color when MOUSE OUT
  $scope.hoverTile = function (){

    // MOUSE OVER TO SEE WHATS THE SELECTION IS
      // $scope.tileStyle = {"background-color" : "pink"};

    // MOUSE OUT TO RETURN ORIGINAL COLOR
      // $scope.tileStyle = {"background-color" : "red"};
  };
});
