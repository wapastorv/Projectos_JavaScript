
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');    // 2D rendering context

canvas.width = 480;
canvas.height = 400;

// Variables de la pelota

const ballRadius = 3;
//posicion de la pelota
let x = canvas.width / 2;
let y = canvas.height - 30;
//velocidad de la pelota
let dx = 2;
let dy = -2;

// Variables de la pala
const paddleHeight = 10;
const paddleWidth = 50;

let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight - 10;

let rightPressed = false;
let leftPressed = false;

function drawBall() {

    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();   
}
function drawPaddle() {
    ctx.fillStyle = 'red';
    ctx.fillRect(
        paddleX,
        paddleY,
        paddleWidth,
        paddleHeight
    )
}

function ballMovement() {
    //rebote en las paredes laterales
    if(
        x + dx > canvas.width - ballRadius ||
        x + dx < ballRadius
    ){
        dx = -dx;
    }
    
    //rebote en la pared superior
    if(y + dy < ballRadius){
        dy = -dy;
    }
    x +=dx;
    y +=dy;

    //rebote en la pala
    const isBallSameXAsPaddle = 
        x > paddleX && 
        x < paddleX + paddleWidth;
    const isBallTouchingPaddle =
        y + dy > paddleY;
    if(isBallSameXAsPaddle && isBallTouchingPaddle){
        dy = -dy;
    }else if(y + dy > canvas.height - ballRadius){     //la pelota toca la pared inferior del canvas (Game Over)
        console.log('Game Over');
        document.location.reload();
    }

}
function paddleMovement() {
    if(rightPressed && paddleX < canvas.width - paddleWidth){
        paddleX += 7;
    } else if(leftPressed && paddleX > 0){
        paddleX -= 7;
    }
}
function cleanCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function initEvents() {
    document.addEventListener('keydown', keyDownHandler)
    document.addEventListener('keyup', keyUpHandler)

    function keyDownHandler(event) {
        const { key } = event;
        if(key === 'Right' || key === 'ArrowRight'){
            rightPressed = true;
        } else if(key === 'Left' || key === 'ArrowLeft'){
            leftPressed = true;
        }
    }

    function keyUpHandler(event) {
        const { key } = event;
        if(key === 'Right' || key === 'ArrowRight'){
            rightPressed = false;
        } else if(key === 'Left' || key === 'ArrowLeft'){
            leftPressed = false;
        }
    }
} 

function draw() {
    // Limpiar el canvas
    cleanCanvas();
    
    // Primero dibujar los elementos
    drawBall();
    drawPaddle();
    //drawBricks();

    //colisiones y movimiento
    //collisionDetection();
    ballMovement();
    paddleMovement();

    
    window.requestAnimationFrame(draw);
}
draw();
initEvents();

