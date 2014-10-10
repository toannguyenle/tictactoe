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

  //GlobalArray to store User's moves on board, each user board is an array in a global array of 2 elements
  $scope.userBoard = [["0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0"]];
  // Standard set of winning possibilities - only 8
  $scope.winningMoves = ["111000000","000111000","000000111","100100100","010010010","001001001","100010001","001010100"];
  // Counter to make sure alternate between noughts and crosses
  $scope.count = 0;
  // Tie in case
  $scope.tie = false;

  // THE JUDGE
  // $scope.judgeGame = function (obj){
  //   var result = false;
  //   for (var i = 0; i < winningMoves.length; i++) {
  //     var winPoint = 0;
  //     // break into array
  //     var winMove = winningMoves[i].split("");
  //     for (var j = 0; j < winMove.length; j++) {
  //       if (winMove[j]*obj[j] == 1) {
  //         winPoint = winPoint + 1;
  //       };
  //       if (winPoint == 3) {
  //         // to break from both loop if we found a winning move
  //         result = true;
  //         i = winningMoves.length;
  //         break;
  //       };
  //     };
  //       //Tie
  //       if (i==(winningMoves.length-1)){
  //         tie=true;
  //       };
  //   };
  //   return result;
  // };

  //chooseTile
  $scope.chooseTile = function(thisTile){

    // to alternate between noughts and crosses
    if (($scope.count % 2) == 0) {
      thisTile.status = 'X';}
    else {
      thisTile.status = 'O';
    }
    $scope.count++;
    // person judging
    // if ($scope.judgeGame($scope.userBoard[0])) {
    //   alert("Player O wins!");
    //   tie = false;
    // }
    // if ($scope.judgeGame($scope.userBoard[1])) {
    //   alert("Player X wins!");
    // };
    // if (($scope.count==9)&($scope.tie)) {
    //   alert("TIE!");
    //   $scope.tied = false;
    // };
  };


  // CLICK to Change AND Retain Value
  $scope.clickTile = function (){
  for (var cellId = 0; cellId < 9; cellId++) {
    // var currentCell = document.getElementById("c"+cellId);
    // currentCell.addEventListener("click", chooseTile());
    // };
  };

  //  MOUSE OVER to Change Color AND returns Color when MOUSE OUT
  // $scope.hoverTile = function (){
  // var count = 0;
  // for (var cellId = 0; cellId < 9; cellId++) {
  //   var currentCell = document.getElementById("c"+cellId);
  //   // MOUSE OVER TO SEE WHATS THE SELECTION IS
  //   currentCell.addEventListener("mouseover", function()
  //   {
  //     this.style.backgroundColor = "pink";
  //   });
  //   // MOUSE OUT TO RETURN ORIGINAL COLOR
  //   currentCell.addEventListener("mouseout", function()
  //   {
  //     this.style.backgroundColor = "red";
  //   });
  //   };
  // };

}});
