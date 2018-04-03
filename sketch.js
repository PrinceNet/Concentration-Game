var grid; // holds our 2d array (aka matrix)
var cols; // number of columns
var rows; // number of rows
var cellSize = 40; // single cell size in pixels
var data = []; // holds the symbols and colors we'll match
var elements = 6; // number of cells per row/col
var canvasSize = cellSize * elements + 1; // the actual width/height of our canvas
var firstMatch; // will hold our first flipped cell
var secondMatch; // will hold our second flipped cell
var firstOn = false; // flag indicator for first flipped cell
var secondOn = false; // flag indicator for second flipped cell
var mutex = false; // prevents from user to flip more then 2 cells at a time

// create a 2 dimension array that well represent our grid
function make2DArray(cols, rows) {
    var arr = new Array(cols);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }

    return arr;
}

// gets the next corresponding character from a given one
function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

// gets random hex color
function randHexColor() {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
}

// check if we click on the same cell twice
function sameCell(firstMatch, grid, i, j) {
    return (firstMatch.x === grid[i][j].x && firstMatch.y === grid[i][j].y);
}

// used by p5.js library on setup of canvas
function setup() {
    reset();
}

// setup a game or create a new game (initializer)
function reset() {
    // create & move the canvas so it’s inside our <div id="sketch-holder">.
    createCanvas(canvasSize, canvasSize).parent('sketch-holder');
    cols = Math.floor(width / cellSize);
    rows = Math.floor(height / cellSize);
    grid = make2DArray(cols, rows);

    // initialize cell obj in every element in grid
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j] = new Cell(i, j, cellSize);
        }
    }

    var char = 'A'; // hold our first character for the data array
    // generate symbols and colors (aka data) to be matched
    for (var i = 0; i < elements * elements / 2; i++) {
        data.push([char, randHexColor()]);
        char = nextChar(char);
    }

    // generate array of all possible options (cells) to be picked
    var options = [];
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            options.push([i, j]);
        }
    }

    // assigned a color and symbol to a cell
    for (var n = 0; n < elements * elements / 2; n++) {
        // pick a symbol & color to assign
        var dataIndex = Math.floor(random(data.length));
        var picked = data[dataIndex];
        var symbol = picked[0];
        var color = picked[1];
        // delete the picked symbol & color from data array
        data.splice(dataIndex, 1);

        // assigned the picked symbol & color to 2 random cells
        for (var k = 0; k < 2; k++) {
            var index = Math.floor(random(options.length));
            var choice = options[index];
            var i = choice[0];
            var j = choice[1];
            // delete the picked choice from options array
            options.splice(index, 1);
            grid[i][j].value = symbol;
            grid[i][j].color = color;
        }
    }
}

// used by p5.js for event listener on a mousePressed event
function mousePressed() {
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            if (grid[i][j].contains(mouseX, mouseY) && !grid[i][j].locked && !mutex) {
                if (!firstOn) { // flip first cell
                    grid[i][j].reveal();
                    firstMatch = grid[i][j];
                    firstOn = true;
                }
                else if (!secondOn && !sameCell(firstMatch, grid, i, j)) { // flip second cell
                    grid[i][j].reveal();
                    secondMatch = grid[i][j];

                    if (firstMatch.value === secondMatch.value) { // match found
                        firstMatch.lock();
                        secondMatch.lock();
                    } else { // no match
                        mutex = true;
                        setTimeout(function () { // critical section
                            firstMatch.hide();
                            secondMatch.hide();
                            mutex = false;
                        }, 1000);
                    }
                    firstOn = false;
                    secondOn = false;
                }
            }
        }
    }
}

// used by p5.js called directly after setup(), the draw() function actually draw our canvas
function draw() {
    background(255);
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].show();
        }
    }
}