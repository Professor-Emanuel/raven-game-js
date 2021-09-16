const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById('collision-canvas');
const collisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

//when to create a new raven, in milliseconds
let timeToNextRaven = 0;
//value in milliseconds until triggering next raven
let ravenInterval = 500;
//hold value of timestamp from previous loop
let lastTime = 0;
let score = 0;
let gameOver = false;
ctx.font = '50px Impact';

let ravens = [];
class Raven{
    constructor(){
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        this.sizeModifier = Math.random() * 0.4 + 0.2;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.directionX = Math.random() * 3 + 1;
        this.directionY = Math.random() * 5 - 2.5;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = './raven_game/sprites/raven.png';
        this.frame = 0;
        this.maxFrame = 4;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 50;
        this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        // we will use this color attribute for click collision detection
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')';
        this.hasTrail = Math.random() > 0.5;
    }

    update(deltaTime){
        if(this.y > canvas.height - this.height || this.y < 0){
            this.directionY = this.directionY * (-1);
        }
        this.x -= this.directionX;
        this.y += this.directionY;
        if(this.x < 0 - this.width){
            this.markedForDeletion = true;
        }
        
        this.timeSinceFlap += deltaTime;

        if(this.timeSinceFlap > this.flapInterval){
            if(this.frame > this.maxFrame){
                this.frame = 0;
            } else {
                this.frame++;
            }
            this.timeSinceFlap = 0;
            if(this.hasTrail){
                for(let i = 0; i < 5; i++){
                    particles.push(new Particles(this.x, this.y, this.width, this.color));
                }
            }
        }

        if(this.x < 0 - this.width){
            gameOver = true;
        }
    }

    draw(){
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        //look at raven.png, the product this.frame * this.spriteWidth makes the bird animation
        //move from frame to frame
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

let explosions = [];
class Explosion{
    constructor(x, y, size){
        this.image = new Image();
        this.image.src = './raven_game/sprites/boom.png';
        this.spriteHeight = 220;
        this.spriteWidth = 200;
        this.size = size;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.sound = new Audio();
        this.sound.src = './raven_game/sounds/boom.wav';
        this.timeSinceLastFrame = 0;
        this.frameInterval = 200;
        this.markedForDeletion = false;
    }

    update(deltaTime){
        if(this.frame === 0){
            this.sound.play();
        }
        this.timeSinceLastFrame += deltaTime;
        if(this.timeSinceLastFrame > this.frameInterval){
            this.frame++;
            this.timeSinceLastFrame = 0;
            if(this.frame > 5){
                this.markedForDeletion = true;
            }
        }
    }

    draw(){
        //look at boom.png, the product this.frame * this.spriteWidth makes the bird explosion animation
        //move from frame to frame
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y - this.size/4, this.size, this.size);
    }
}

let particles = [];
class Particles{
    constructor(x, y, size, color){
        this.size = size;
        this.x = x + this.size/2 + Math.random() * 50 - 25;
        this.y = y + this.size/3 + Math.random() * 50 - 25;
        this.radius = Math.random() * this.size/10;
        this.maxRadius = Math.random() * 15 + 5;
        this.markedForDeletion = false;
        this.speedX = Math.random() * 1 + 0.5;
        this.color = color;
    }

    update(){
        this.x += this.speedX;
        this.radius += 0.2;
        if(this.radius > this.maxRadius - 5){
            this.markedForDeletion = true;
        }
    }

    draw(){
        //wrap everything between ctx.save(); & ctx.restore(); such that only the particles will be effected
        //otherwise all canvas element will be effected (the opacity will be effected for score, ravens);
        ctx.save();
        ctx.globalAlpha = 1 - this.radius / this.maxRadius;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        //full circle length
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function drawScore(){
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 50, 75);
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 53, 78);
}

function drawGameOver(){
    ctx.font = '100px Impact';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText("Game Over!", canvas.width/2, canvas.height/2);
    ctx.fillText("Your score is: " + score, canvas.width/2, canvas.height/2 + 85);
    ctx.fillStyle = 'white';
    ctx.fillText("Game Over!", canvas.width/2, canvas.height/2 + 5);
    ctx.fillText("Your score is: " + score, canvas.width/2, canvas.height/2 + 90);
}
//event listener used to detect mouse click that will kill a bird if one is clicked!
window.addEventListener('click', function(event){
    //console.log(event.x, event.y);
    // collision detection by color
    const detectPixelColor = collisionCtx.getImageData(event.x, event.y, 1, 1);
    const pc = detectPixelColor.data;
    ravens.forEach(object =>{
        if(object.randomColors[0] === pc[0] && object.randomColors[1] === pc[1] && object.randomColors[2] === pc[2]){
            //collision detected
            object.markedForDeletion = true;
            score++;
            explosions.push(new Explosion(object.x, object.y, object.width));
        }
    })
})

function animate(timestamp){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextRaven += deltaTime;
    if(timeToNextRaven > ravenInterval){
        ravens.push(new Raven());
        timeToNextRaven = 0;
        //sort array in ascending order based on the width of each element
        ravens.sort(function(a, b){
            return a.width - b.width;
        });
    };

    drawScore();
    //create an array literal
    // ... = spread operator
    //spread the ravens array into the array literal
    [...particles, ...ravens, ...explosions].forEach(object => object.update(deltaTime));
    [...particles, ...ravens, ...explosions,].forEach(object => object.draw());
    //push out the raven for which markedForDeletion is true
    ravens = ravens.filter(object => !object.markedForDeletion);
    //push out the raven for which markedForDeletion is true
    explosions = explosions.filter(object => !object.markedForDeletion);
     //push out the particles for which markedForDeletion is true
     particles = particles.filter(object => !object.markedForDeletion);
    //console.log(ravens);
    if(!gameOver){
        requestAnimationFrame(animate);
    } else{
        drawGameOver();
    }
}

animate(0);