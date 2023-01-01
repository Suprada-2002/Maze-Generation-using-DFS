const maze = document.querySelector(".maze");
const ctx = maze.getContext("2d");
let generationComplete = false;

let current; //refres to current visited grid;

class Maze {
  constructor(size, rows, columns) {
    this.size = size;
    this.rows = rows;
    this.columns = columns;
    this.grid = [];
    this.stack = [];
  }

  setup() {
    for (let r = 0; r < this.rows; r++) {
      let row = [];
      for (let c = 0; c < this.columns; c++) {
        let cell = new Cell(r, c, this.grid, this.size);
        row.push(cell);
      }
      this.grid.push(row);
    }
    current = this.grid[0][0];
  }

  draw() {
    maze.width = this.size;
    maze.height = this.size;
    maze.style.background = "black";
    current.visited = true;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        this.grid[r][c].show(this.size, this.rows, this.columns);
      }
    }

    const next = current.checkNeighbours();
    //if neighbour exist:
    if (next) {
      next.visited = true;
      this.stack.push(current);
      current.highlight(this.columns);
      current.removeWalls(current, next);
      current = next;
      //else if no neighbour exist:
    } else if (this.stack.length > 0) {
      let cell = this.stack.pop();
      current = cell;
      current.highlight(this.columns);
    }
    if (this.stack.length === 0) {
      generationComplete = true;
      return;
    }
    requestAnimationFrame(() => this.draw());
    //end of draw
  }
  //end of maze
}

class Cell {
  constructor(rowNum, colNum, parentGrid, parentSize) {
    this.rowNum = rowNum;
    this.colNum = colNum;
    this.parentGrid = parentGrid;
    this.parentSize = parentSize;
    this.visited = false;
    this.walls = {
      topWall: true,
      leftWall: true,
      rightWall: true,
      bottumWall: true,
    };
  }

  checkNeighbours() {
    const grid = this.parentGrid;
    const row = this.rowNum;
    const col = this.colNum;
    const neighbours = [];

    const top = row !== 0 ? grid[row - 1][col] : null;
    const right = col !== grid.length - 1 ? grid[row][col + 1] : null;
    const bottom = row !== grid.length - 1 ? grid[row + 1][col] : null;
    const left = col !== 0 ? grid[row][col - 1] : null;

    // if the following are not 'null' then push them to the neighbours array
    if (top && !top.visited) neighbours.push(top);
    if (right && !right.visited) neighbours.push(right);
    if (bottom && !bottom.visited) neighbours.push(bottom);
    if (left && !left.visited) neighbours.push(left);

    // Choose a random neighbour from the neighbours array
    if (neighbours.length !== 0)
      return neighbours[Math.floor(Math.random() * neighbours.length)];
    else return null;
  }

  // walls
  drawTopWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size / columns, y);
    ctx.stroke();
  }

  drawRightWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x + size / columns, y);
    ctx.lineTo(x + size / columns, y + size / rows);
    ctx.stroke();
  }

  drawBottomWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y + size / rows);
    ctx.lineTo(x + size / columns, y + size / rows);
    ctx.stroke();
  }

  drawLeftWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + size / rows);
    ctx.stroke();
  }

  //to highlight the current cell on grid
  highlight(columns) {
    // Additions and subtractions added so the highlighted cell does cover the walls
    const x = (this.colNum * this.parentSize) / columns + 1;
    const y = (this.rowNum * this.parentSize) / columns + 1;
    ctx.fillStyle = "purple";
    ctx.fillRect(
      x,
      y,
      this.parentSize / columns - 3,
      this.parentSize / columns - 3
    );
  }

  removeWalls(cell1, cell2) {
    // compares to two cells on x axis
    const x = cell1.colNum - cell2.colNum;
    // Removes the relevant walls if there is a different on x axis
    if (x === 1) {
      cell1.walls.leftWall = false;
      cell2.walls.rightWall = false;
    } else if (x === -1) {
      cell1.walls.rightWall = false;
      cell2.walls.leftWall = false;
    }
    // compares to two cells on x axis
    const y = cell1.rowNum - cell2.rowNum;
    // Removes the relevant walls if there is a different on x axis
    if (y === 1) {
      cell1.walls.topWall = false;
      cell2.walls.bottomWall = false;
    } else if (y === -1) {
      cell1.walls.bottomWall = false;
      cell2.walls.topWall = false;
    }
  }

  show(size, rows, columns) {
    const x = (this.colNum * size) / columns;
    const y = (this.rowNum * size) / rows;

    ctx.strokeStyle = "white";
    ctx.fillStyle = "black";
    ctx.lineWidth = 2;

    if (this.walls.topWall) this.drawTopWall(x, y, size, columns, rows);
    if (this.walls.rightWall) this.drawRightWall(x, y, size, columns, rows);
    if (this.walls.bottomWall) this.drawBottomWall(x, y, size, columns, rows);
    if (this.walls.leftWall) this.drawLeftWall(x, y, size, columns, rows);
    if (this.visited) {
      ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
    }
  }
}

const newMaze = new Maze(500, 10, 10);
newMaze.setup();
newMaze.draw();
