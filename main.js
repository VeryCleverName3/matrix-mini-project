var matrix = [[], [], []];

write("<h2>Here's a randomly generated 3x3 matrix. (reload the page to re-randomize everything)</h2><br>");

for(var i = 0; i < 9; i++){
    var elem = Math.floor((Math.random() * 19) - 9);
    while(elem == 0){
        elem = Math.floor((Math.random() * 19) - 9);
    }
    matrix[Math.floor(i / 3)][i % 3] = elem;
}

drawMatrix(matrix);

write("The determinant is: " + calcDetBig(matrix) + "<br>");

write("<h2>Here's how to solve A' with Gauss-Jordan Row Elimination</h2>");

var gaubedMatrix = gaubJordanInverse(matrix);


var identity = [[],[],[]];
for(var i = 0; i < 9; i++){
    identity[Math.floor(i / 3)][(i % 3)] = (Math.floor(i / 3) == (i % 3))?1:0;
}

for(var i = 0; i < 3; i++){
    for(var j = 0; j < 3; j++){
        if(gaubedMatrix[i][j] != identity[i][j]){
            window.location.reload();
        }
    }
}

var inverseA = slice2D(gaubedMatrix, 0, 2, 3, 5);

for(i of inverseA){
    for(j of i){
        if(j == NaN){
            window.location.reload();
        }
    }
}

write("<h2>Here's how to solve a system of equations with Gauss-Jordan Row Elimination. B is also randomly generated.</h2>");

var matrixB = [Math.floor((Math.random() * 19) - 9), Math.floor((Math.random() * 19) - 9), Math.floor((Math.random() * 19) - 9)];

gaubJordanSystem(matrix, matrixB);

write("<h2>Here's the result of multiplying the inverse of A and matrix B:</h2>");

drawMatrix(multiplyMatrices(inverseA, matrixB));

write("Here's a randomly generated vertex-edge graph. A blue connection means the smaller number is going to the larger number. A red connection means the larger number is going to the smaller number. Purple means a two-way connection. (This technically counts as <a href='javascript:window.open(`https://www.google.com/search?q=pop+culture+definition&oq=pop+culture+defi&aqs=chrome.0.0j69i57j0l4.4569j1j7&sourceid=chrome&ie=UTF-8`)'>pop culture</a> because it's on the internet, and therefore counts as being \"transmitted via the mass media\")");

var c = document.createElement("canvas");

document.body.append(c);

var ctx = c.getContext("2d");

c.width = 400;
c.height = 400;

//generate connections as matrix
var graphMatrix = [[], [], [], [], []]

for(var i = 0; i < 5; i++){
    for(var j = 0; j < 5; j++){
        graphMatrix[i][j] = (i==j)?0:Math.floor(Math.random() + 0.5);
    }
}

//draw nodes
var points = [[200, 360], [350, 250], [325, 90], [75, 90], [50, 250]];

ctx.fillStyle = "white";

ctx.fillRect(0, 0, 400, 400);

for(var i = 0; i < graphMatrix.length; i++){
    for(var j = 0; j < graphMatrix[i].length; j++){
        if(graphMatrix[i][j] == 1){
            ctx.strokeStyle = (i < j)?"blue":"red";
            ctx.beginPath();
            ctx.moveTo(points[i][0], points[i][1]);
            ctx.lineTo(points[j][0], points[j][1]);
            ctx.stroke();
            ctx.closePath();
        }
    }
}

ctx.strokeStyle = "black";

for(var i = 0; i < points.length; i++){
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(points[i][0], points[i][1], 30, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.fillText(i, points[i][0], points[i][1]);
}

write("<h2><br>Here's the matrix representation of the above vertex-edge graph.</h2>");

drawMatrix(graphMatrix);

write("<h2>Here's the matrix raised to the second, third, fourth, and fifth powers.</h2>");
write("(In respective order)");
var gm1 = graphMatrix;
var gm2 = multiplyBigMatrices(graphMatrix, graphMatrix);
var gm3 = multiplyBigMatrices(graphMatrix, gm2);
var gm4 = multiplyBigMatrices(graphMatrix, gm3);
var gm5 = multiplyBigMatrices(graphMatrix, gm4);
drawMatrix(gm2);
drawMatrix(gm3);
drawMatrix(gm4);
drawMatrix(gm5);

write("<h2>Here's some randomly generated questions: </h2>");
write("(Important parts of these matrices are colored cyan)");

for(var i = 0 ; i < 4; i++){
    var firstNode = Math.floor(Math.random() * 5);
    var secondNode = firstNode;
    while(secondNode == firstNode){
        secondNode = Math.floor(Math.random() * 5);
    }
    write("What's the minimum number of steps it takes to get from node " + firstNode + " to node " + secondNode + "?");
    var min = "Not Possible";
    for(var j = 0; j < 5; j++){
        eval("gm" + (j + 1) + "[firstNode][secondNode] = '<b>' + gm" + (j + 1) + "[firstNode][secondNode] + '</b>'");
        drawMatrix(eval("gm" + (j + 1)));
        eval("gm" + (j + 1) + "[firstNode][secondNode] = (gm" + (j + 1) + "[firstNode][secondNode]).substring(3,(gm" + (j + 1) + "[firstNode][secondNode]).length - 4)");
        if(eval("gm" + (j + 1) + "[firstNode][secondNode]") > 0){
            min = j + 1;
            j = 5;
        }
    }
    write("Answer: " + min + "<br><br><br><br>");
}



//Functions
function write(s){
    var newElem = document.createElement("div");
    newElem.innerHTML = s;
    document.body.append(newElem);
};

function calcDetBig(m){
    var det = 0;
    det += (m[0][0] * (calcDetSmall(slice2D(m, 1, 2, 1, 2))));
    det += (m[0][2] * (calcDetSmall(slice2D(m, 1, 2, 0, 1))));
    det -= (m[0][1] * ((m[1][0] * m[2][2]) - (m[1][2] * m[2][0])));
    return det;
}

function calcDetSmall(m){
    return (m[0][0] * m[1][1]) - (m[0][1] * m[1][0]);
}

function slice2D(m, a, b, c, d){
    b++;
    d++;
    var mat = m.slice(a, b);

    for(var i = 0; i < mat.length; i++){
        mat[i] = mat[i].slice(c, d);
    }  

    return mat;
}

function clone(m){
    var mat = [[], [], []];

    for(var i = 0; i < 9; i++){
        mat[Math.floor(i / 3)][i % 3] = m[Math.floor(i / 3)][i % 3];
    }

    return mat;
}

function gaubJordanInverse(m){
    var mat = clone(m);

    for(var i = 0; i < mat.length * 3; i++){
        mat[Math.floor(i / 3)][(i % 3) + 3] = (Math.floor(i / 3) == (i % 3))?1:0;
    }

    write("<br>");

    drawMatrix(mat);

    mat[1] = multiply(mat[1], (mat[0][0] - 1)/mat[1][0]);
    mat[0] = add(mat[0], multiply(mat[1], -1));

    write("<br>");

    drawMatrix(mat);

    console.log(multiply(mat[0], mat[1][0]));

    mat[1] = add(mat[1], multiply(mat[0], -mat[1][0]));

    write("<br>");

    drawMatrix(mat);

    mat[2] = add(mat[2], multiply(mat[0], -mat[2][0]));

    write("<br>");

    drawMatrix(mat);

    mat[1] = multiply(mat[1], (1 / mat[1][1]));

    write("<br>");

    drawMatrix(mat);

    mat[2] = add(mat[2], multiply(mat[1], -mat[2][1]));

    write("<br>");

    drawMatrix(mat);

    mat[2] = multiply(mat[2], 1 / mat[2][2]);

    write("<br>");

    drawMatrix(mat);

    mat[1] = add(mat[1], multiply(mat[2], -mat[1][2]));

    write("<br>");

    drawMatrix(mat);

    mat[0] = add(mat[0], multiply(mat[1], -mat[0][1]));

    write("<br>");

    drawMatrix(mat);

    mat[0] = add(mat[0], multiply(mat[2], -mat[0][2]));

    write("<br>");

    drawMatrix(mat);

    return mat;
}

function gaubJordanSystem(m, elems){
    var mat = clone(m);

    for(var i = 0; i < mat.length; i++){
        mat[i][3] = elems[i];
    }

    write("<br>");

    drawMatrix(mat);

    mat[1] = multiply(mat[1], (mat[0][0] - 1)/mat[1][0]);
    mat[0] = add(mat[0], multiply(mat[1], -1));

    write("<br>");

    drawMatrix(mat);

    console.log(multiply(mat[0], mat[1][0]));

    mat[1] = add(mat[1], multiply(mat[0], -mat[1][0]));

    write("<br>");

    drawMatrix(mat);

    mat[2] = add(mat[2], multiply(mat[0], -mat[2][0]));

    write("<br>");

    drawMatrix(mat);

    mat[1] = multiply(mat[1], (1 / mat[1][1]));

    write("<br>");

    drawMatrix(mat);

    mat[2] = add(mat[2], multiply(mat[1], -mat[2][1]));

    write("<br>");

    drawMatrix(mat);

    mat[2] = multiply(mat[2], 1 / mat[2][2]);

    write("<br>");

    drawMatrix(mat);

    mat[1] = add(mat[1], multiply(mat[2], -mat[1][2]));

    write("<br>");

    drawMatrix(mat);

    mat[0] = add(mat[0], multiply(mat[1], -mat[0][1]));

    write("<br>");

    drawMatrix(mat);

    mat[0] = add(mat[0], multiply(mat[2], -mat[0][2]));

    write("<br>");

    drawMatrix(mat);

    return mat;
}

function multiply(m, a){

    var newM = [];

    for(var i = 0; i < m.length; i++){
        newM[i] = m[i] * a;
    }

    return newM;
}

function add(m1, m2){
    var newM = [];
    for(var i = 0; i < m1.length; i++){
        newM[i] = m1[i] + m2[i];
    }

    return newM;
}

function drawMatrix(m){
    console.log(m);

    var s = "<table>";
    for(var i = 0; i < m.length; i++){
        console.log()
        for(var j = 0; j < m[i].length; j++){
            s += "<td>";
            s += ("" + m[i][j]).substring(0, 4);
            s += "</td>";
        }
        s += "</tr>";
    }
    s += "</table>";
    write(s);
}

//takes a 3x3 and 3x1

function multiplyMatrices(m1, m2){
    var result = [];
    for(var i = 0; i < m1.length; i++){
        var sum = 0;
        result[i] = [];
        for(var j = 0; j < m1[i].length; j++){
            sum += m1[i][j] * m2[j];
        }
        result[i][0] = sum;
    }

    return result;
}

function multiplyBigMatrices(m1, m2){
    var result = [];
    for(var i = 0; i < m1.length; i++){
        result[i] = [];
        for(var j = 0; j < m1.length; j++){
            result[i][j] = 0;
            for(var k = 0; k < m1.length; k++){
                result[i][j] += m1[i][k] * m2[k][j];
            }
        }
    }
    return result;
}