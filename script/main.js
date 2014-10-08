// Wait after the page is fully loaded to run the Game
window.onload = function(){
  initializeGame();
};

// THE GAME TIC TAC TOE
function initializeGame(){
  // NOW FOR CLOSURE CLICK WHATEVR
  // var play = function

  // CLICK to Change AND Retain Value
  function clickTile(){
    var count = 0;
  for (var cellId = 0; cellId < 9; cellId++) {
      var currentCell = document.getElementById("c"+cellId);
      currentCell.addEventListener("click", function()
      {
          this.innerHTML = ((count%2)==0) ? "X":"O";
          count++;
      });
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

  //SAMPLE FUNCTION CALL}
  clickTile();
  hoverTile();
};
