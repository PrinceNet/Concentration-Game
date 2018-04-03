// Cell object constructor
function Cell(i, j, size) {
    this.i = i;
    this.j = j;
    this.x = i * size;
    this.y = j * size;
    this.size = size;
    this.value = '';
    this.color = '';
    this.revealed = false;
    this.locked = false;
}

// used by the draw() function, describe how to show individual cell
Cell.prototype.show = function () {
    stroke(0);
    noFill();
    rect(this.x, this.y, this.size, this.size);
    if (this.revealed) {
        if (this.locked) {
            fill(230);
            rect(this.x, this.y, this.size, this.size);
        }
        textAlign(CENTER);
        textSize(25);
        fill(this.color);
        text(this.value, this.x + this.size * 0.5, this.y + this.size * 0.75);
    }
};

// check if we clicked on a cell
Cell.prototype.contains = function (x, y) {
    return (x > this.x && x < this.x + this.size && y > this.y && y < this.y + this.size);
};

// reveal cell
Cell.prototype.reveal = function () {
    this.revealed = true;
};

// hide cell
Cell.prototype.hide = function () {
    this.revealed = false;
};

// lock cell (not clickable)
Cell.prototype.lock = function () {
    this.locked = true;
};