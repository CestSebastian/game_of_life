var n = 40, m = 40, matrix = new Array();

function clearMatrix () {
  for (var i=0; i<n; i++) {
      matrix[i] = new Array();
      for (var j=0; j<m; j++) {
          matrix[i][j] = 0;
      }
  }
}

clearMatrix();

// ADD SOME EXAMPLES
matrix[25][25] = 1;
matrix[24][25] = 1;
matrix[26][25] = 1;
matrix[25][24] = 1;
matrix[25][26] = 1;

matrix[10][15] = 1;
matrix[11][16] = 1;
matrix[11][17] = 1;
matrix[10][17] = 1;
matrix[9][17] = 1;

//grid width and height
var bw = n * 20;
var bh = m * 20;
//padding around grid
var p = 0;
//size of canvas
var cw = bw + (p*2) + 1;
var ch = bh + (p*2) + 1;

var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

canvas.setAttribute('width', cw);
canvas.setAttribute('height', ch);

function drawBoard(){
    for (var x = 0; x <= bw; x += 20) {
        context.moveTo(0.5 + x + p, p);
        context.lineTo(0.5 + x + p, bh + p);
    }


    for (var x = 0; x <= bh; x += 20) {
        context.moveTo(p, 0.5 + x + p);
        context.lineTo(bw + p, 0.5 + x + p);
    }

    context.strokeStyle = "gray";
    context.stroke();
}

drawBoard();

canvas.addEventListener('click', function (event) {
    var x = event.offsetX;
    var y = event.offsetY;

    var color = context.getImageData(x, y, 1, 1).data;

    var matrixN = Math.floor(x / 20);
    var matrixM = Math.floor(y / 20)
    var rectX = matrixN * 20 + 1;
    var rectY = matrixM * 20 + 1;


    if (color[3] == 0) {
        context.fillRect(rectX, rectY, 19, 19);
        matrix[matrixN][matrixM] = 1;
    } else if (color[3] == 255) {
        context.clearRect(rectX, rectY, 19, 19);
        matrix[matrixN][matrixM] = 0;
    }
});

var intervalId = null;

document.getElementById('start').addEventListener('click', function (event) {
    var stopButton = document.createElement('button');
        stopButton.id = 'stop';
        stopButton.innerHTML = 'Stop';

    var startButton = this;
    stopButton.addEventListener('click', function() {
        clearInterval(intervalId);
        startButton.removeAttribute('disabled');
        this.parentNode.removeChild(this);
    });

    this.parentNode.appendChild(stopButton);

    this.setAttribute('disabled', 'disabled');
    intervalId = setInterval(function() {
        evolveOneStep();
    }, 300);
});

document.getElementById('clear').addEventListener('click', function () { clearMatrix(); redrawMatrix(); });

function redrawMatrix() {
    var rectX, rectY;
    for (var i=0; i<n; i++) {
        for (var j=0; j<m; j++) {
            rectX = i * 20 + 1;
            rectY = j * 20 + 1;

            if (matrix[i][j] == 1) {
                context.fillRect(rectX, rectY, 19, 19);
            } else {
                context.clearRect(rectX, rectY, 19, 19);
            }
        }
    }
}

redrawMatrix();

function evolveOneStep() {
    var neighbours;
    var newMatrix = new Array();

    for (var i=0; i<n; i++) {
        newMatrix[i] = new Array();
        for (var j=0; j<m; j++) {
            newMatrix[i][j] = matrix[i][j];
        }
    }

    for (var i=0; i<n; i++) {
        for (var j=0; j<m; j++) {
            neighbours = getLiveNeighbours(i, j);

            if (matrix[i][j] == 1) {
                if (neighbours < 2 || neighbours > 3) {
                    newMatrix[i][j] = 0;
                }
            } else if (neighbours == 3) {
                newMatrix[i][j] = 1;
            }
        }
    }

    matrix = newMatrix.slice(0);

    redrawMatrix();
}

function getLiveNeighbours(x, y) {
    var neighbours = 0;

    if (matrix[x-1] && matrix[x-1][y] == 1) {
        neighbours++;
    }

    if (matrix[x-1] && matrix[x-1][y-1] == 1) {
        neighbours++;
    }

    if (matrix[x][y-1] == 1) {
        neighbours++;
    }

    if (matrix[x+1] && matrix[x+1][y-1] == 1) {
        neighbours++;
    }

    if (matrix[x+1] && matrix[x+1][y] == 1) {
        neighbours++;
    }

    if (matrix[x+1] && matrix[x+1][y+1] == 1) {
        neighbours++;
    }

    if (matrix[x][y+1] == 1) {
        neighbours++;
    }

    if (matrix[x-1] && matrix[x-1][y+1] == 1) {
        neighbours++;
    }

    return neighbours;
}
