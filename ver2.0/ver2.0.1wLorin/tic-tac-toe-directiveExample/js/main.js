var firebaseURL = "https://tictacboo.firebaseio.com/";

var tictactoeApp = angular.module("tictactoeApp", ["firebase"]);

tictactoeApp.controller("tttController", ["$scope", "$firebase",
  function($scope, $firebase) {

    var syncObject = null;    // Firebase synced data
    var unbindDB = null;      // function that unbinds the DB

   
    // Initial variable values at start and reset of game
    var newGame = {
      squares: ["","","","","","","","",""],
  		currPlayer: 0,
  		gameInProgress: true,
  		numberOfPlayers: 0,
  	 };

    // Scope-wide variables
    $scope.dbConnected  = false;  // true when connected to FireBase
    $scope.dbConnecting = false;  // true when connecting to FireBase
    $scope.playerNumber = 0;      // locally, which player this is


    /**********************
     * FIREBASE FUNCTIONS
     **********************/

    /* Function to initialize Firebase */
    function doneConnecting(unbindFunction) {
        if (!$scope.db.gameInProgress) {
          $scope.db = newGame;
        }

        // Set the local player number then increment the total # of players
        $scope.playerNumber = $scope.db.numberOfPlayers;
        $scope.db.numberOfPlayers += 1;
        
        // Set player name by default to "Player <playerNumber>", if nothing entered
        $scope.db.players = $scope.db.players || (new Array());
        if ($scope.db.players.length < $scope.db.numberOfPlayers) {
          var finalPlayerName = $scope.playerName || ("Player " + $scope.playerNumber);

          $scope.db.players.push({'name': finalPlayerName});
        }
        
        // Established Firebase connection
        $scope.dbConnecting = false;
        $scope.dbConnected = true;

        unbindDB = unbindFunction;
    }


    /* Connects to Firebase and binds the Firebase data to $scope.db */
    $scope.connectDB = function() {
      $scope.dbConnecting = true; // indicate we are connecting to FB

      var ref = new Firebase(firebaseURL);

      // create an AngularFire reference to the data
      var sync = $firebase(ref);

      // download the data into a local object
      syncObject = sync.$asObject();

      // wait until object is loaded
      syncObject.$loaded().then(function() {

        // Synchronize the object with a three-way data binding
        // Now, $scope.db is bound to Firebase.
        // Calls doneConnecting(<unbind function>) once $scope.db is bound to the database!
        syncObject.$bindTo($scope, "db").then( doneConnecting );
      });
    };


    /* Unbinds from FireBase and sets dbConnected false */
    function disconnectDB(ref) {
        if (unbindDB) {
          unbindDB();
        }

        if (syncObject) {
          syncObject.$destroy();
        }

        $scope.dbConnected = false;    
    }

    /* Ensure the game updated to not in progress then disconnect from the DB */
    $scope.endGame = function() {
      $scope.db.gameInProgress = false;
      syncObject.$save().then( disconnectDB );
    };


//Tic Tac Boo Game Functions
	

	// declared a variable in order to switch from Player 1 to Player 2
	var currPlayer = 0; // playerOne = true
	//function to identify which squares the player (1 or 2) selected
	$scope.placeMarker = function(squaresindex) {
		if ($scope.db.squares[squaresindex] == "") {
			if (currPlayer == 0) {  // playerOne == true
				$scope.db.squares[squaresindex] = 1;
				winConditions();
        currPlayer++;
			} else {
				$scope.db.squares[squaresindex] = -1;
				winConditions();
        currPlayer--;
			}
		} else {
			alert("This square is already taken");
		}
	}



	function winConditions() {
		if (($scope.db.squares[0] == 1 && $scope.db.squares[1] == 1 && $scope.db.squares[2] == 1) || 
		($scope.db.squares[3] == 1 && $scope.db.squares[4] == 1 && $scope.db.squares[5] == 1) ||
		($scope.db.squares[6] == 1 && $scope.db.squares[7] == 1 && $scope.db.squares[8] == 1) ||
		($scope.db.squares[0] == 1 && $scope.db.squares[3] == 1 && $scope.db.squares[6] == 1) ||
		($scope.db.squares[1] == 1 && $scope.db.squares[4] == 1 && $scope.db.squares[7] == 1) ||
		($scope.db.squares[2] == 1 && $scope.db.squares[5] == 1 && $scope.db.squares[8] == 1) ||
		($scope.db.squares[0] == 1 && $scope.db.squares[4] == 1 && $scope.db.squares[8] == 1) ||
		($scope.db.squares[2] == 1 && $scope.db.squares[4] == 1 && $scope.db.squares[6] == 1)) {
			$scope.boowins=true;
		} else if (
			($scope.db.squares[0] == -1 && $scope.db.squares[1] == -1 && $scope.db.squares[2] == -1) || 
			($scope.db.squares[3] == -1 && $scope.db.squares[4] == -1 && $scope.db.squares[5] == -1) ||
			($scope.db.squares[6] == -1 && $scope.db.squares[7] == -1 && $scope.db.squares[8] == -1) ||
			($scope.db.squares[0] == -1 && $scope.db.squares[3] == -1 && $scope.db.squares[6] == -1) ||
			($scope.db.squares[1] == -1 && $scope.db.squares[4] == -1 && $scope.db.squares[7] == -1) ||
			($scope.db.squares[2] == -1 && $scope.db.squares[5] == -1 && $scope.db.squares[8] == -1) ||
			($scope.db.squares[0] == -1 && $scope.db.squares[4] == -1 && $scope.db.squares[8] == -1) ||
			($scope.db.squares[2] == -1 && $scope.db.squares[4] == -1 && $scope.db.squares[6] == -1)) {
				$scope.buddywins=true;
		// add reset game
		} else if (
			($scope.db.squares[0] == 1 || $scope.db.squares[0] == -1) && ($scope.db.squares[1] == 1 || $scope.db.squares[1] == -1) && 
		 	($scope.db.squares[2] == 1 || $scope.db.squares[2] == -1) && ($scope.db.squares[3] == 1 || $scope.db.squares[3] == -1) && 
		 	($scope.db.squares[4] == 1 || $scope.db.squares[4] == -1) && ($scope.db.squares[5] == 1 || $scope.db.squares[5] == -1) &&
		 	($scope.db.squares[6] == 1 || $scope.db.squares[6] == -1) && ($scope.db.squares[7] == 1 || $scope.db.squares[7] == -1) &&
		 	($scope.db.squares[8] == 1 || $scope.db.squares[8] == -1)) {
		 		$scope.itsatie=true;
		 }


			 // if (playerOne == true) {
			 // 	playerOne = false; 
			 // }
			 // else {
			 // 	playerOne = true;
			 // 	}

       
// Called when the Switch Player button is pressed via ng-click
    // This toggles currentPlayer between 0 and 1.
    // The modulus operator (%), for a % b, divides 'a' by 'b' and returns the remainder
     $scope.switchPlayer = function() {
       $scope.db.currentPlayer = ($scope.db.currentPlayer + 1) % 2;
     }



	}
}]);



