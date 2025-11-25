// W3Schools provided most of this code. Check it out at https://www.w3schools.com/graphics/game_intro.asp
var myGamePiece;
var myObstacles = [];
var myScore;
var scoreNumber = 0;
var pause = false;
var speed = 10;

window.addEventListener("load", startGame);

function startGame() {
    let start = new startButton("Click to start");

    myGamePiece = new component(30, 30, "red", 10, 120);
    myGamePiece.gravity = 0.05;
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myGameArea.start();
    start.create(() => pause=false);
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        updateGameArea() //This gives us the screen before we start
        this.interval = setInterval(updateGameArea, 20);
        pause = true;
        window.addEventListener("keydown", keydown);
        window.addEventListener("touchend", keydown);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

class startButton  {
    constructor(text){
        this.text = text;
        this.button = document.createElement("button");
        this.button.className = "button";
    }

    create(startCallback) {
        this.button.width=200;
        this.button.height=50;
        this.button.innerHTML = this.text;
        this.button.addEventListener("click", () => {
            this.delete(this.button);
            startCallback();
        });
        document.body.insertBefore(this.button, document.body.childNodes[1]); //Puts it after game-container div
    }

    delete = (button) => button.remove();
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 0; 
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        if(this.gravitySpeed > 5){
            this.gravitySpeed = 5;
        } else {
            this.gravitySpeed += 0.2;
        }
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
        this.hitTop();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }

        this.hitTop = function() {
                if (this.y < 0) {
                this.y = 0;
                this.gravitySpeed = Math.abs(this.gravitySpeed + 1);
            }
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function keydown(e){
    let key = e.key
    let touchList = e.touchList;
    document.getElementById("log").innerHTML = touchList;
        if ((key !== " " || e.repeat) && touchList === undefined) return;
        flyUp();
}

function updateGameArea() {
    if(pause) return;
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            let restart = new startButton("Tap to Restart");
            pause = true;
            if (!document.querySelector("button")){
                restart.create(() => location.reload());
            }   
            return;
        } 
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(75)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(10, height, "green", x, 0));
        myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
    }

    myObstacles = updateObstacles(myObstacles);

    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -2;
        myObstacles[i].update();
    }
    myScore.text="SCORE: " + scoreNumber;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}

function updateObstacles(myObstacles){
    obstacle = myObstacles[0]; //We only need to check the first one because we only need to remove the ones at the front
    if (obstacle.x + obstacle.width < 0){
        myObstacles.splice(0, 2);
        scoreNumber++;
    }
    return myObstacles;
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function flyUp() {
    if(myGamePiece.gravitySpeed < -10){
        myGamePiece.gravitySpeed = -10;
    }else {
        myGamePiece.gravitySpeed -= 5;
    }
}