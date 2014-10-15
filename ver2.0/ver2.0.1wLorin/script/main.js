var myScope;
var myHttp;

var myTTTapp = angular.module('myTTTapp', [])

// PLAY WITH BUILDING NEW DIRECTIVE
// http://www.befundoo.com/university/tutorials/angularjs-directives-tutorial/
// restrict can be combined 'AECM'
.directive('ourRating', function () {
  return {
    template: '<p class="rating" x-ng-repeat="star in stars" class="filled" ng-click="toogle()">' +
                      '\u2605'+'</p>',
    restrict: 'A',
    scope: {
      ratingValue: "=" //Teo esy fsts binfinh
    },
    link: function (scope, elem, attrs) {
      console.log("Directive", scope, elem, attrs);

      scope.$watch("ratingValue", function(newThing, oldThing){
        scope.stars = [];
        for(var x = 0; x < parseInt(newThing); x++)
        {
          scope.stars.push({});
        }
      });
      scope.toogle = function (){
        scope.ratingValue = index +1;
      };
    },
  };
})
// TICTACTOE CONTROLLER
.controller('TTTCtrl', ["$scope", "$http", function ($scope, $http) {
// hack with AJAX
// myHttp = $http;
// var promise = myHttp.get("https://api.github.com/repos/lorint/AndrewIG/issues");
// promise.success(function(data){
// $scope.issues = data;
// });

  myScope = $scope;
  $scope.someVar = 5;
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
var userBoard = [["0","0","0","0","0","0","0","0","0"],
                 ["0","0","0","0","0","0","0","0","0"]];
// Standard set of winning possibilis - only 8
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
  if (thisTile.status=='H'){
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
    // update move counter
  $scope.count++;

  // Let's find out the winner
  if (judgeGame(userBoard[1])) {
    announcer("X");
    tie = false;
  }
  if (judgeGame(userBoard[0])) {
    announcer("O");
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
    // this.status = 'L'

    alert("TIE GAME!" + tie);
  };
  if (result == "X") {
    // this.status = 'L'
    updateBoard();
  };
  if (result == "O") {
    updateBoard();
  };
};

// RENDER BOARD WITH WINNING COMBINATION
var updateBoard = function () {
  var winMove = winningMoves[$scope.winScene].split("");
  for (var i = 0; i < winMove.length; i++) {
    if (winMove[i] == "0") {
      $scope.gameBoard[i].name = "lossClass";
    };
  };
};

//  MOUSE OVER to Change Color
$scope.mouseEnterTile = function (thisTile){
  if (thisTile.status == "0") {
    thisTile.status = "H";
  };
};

// RETURN origin tile when mouse leave
$scope.mouseLeaveTile = function (thisTile){
  if (thisTile.status == "H") {
    thisTile.status = "0";
  };
};
}]);





