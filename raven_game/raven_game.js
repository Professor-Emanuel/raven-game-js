const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//when to create a new raven, in milliseconds
let timeToNextRaven = 0;
//value in milliseconds until triggering next raven
let ravenInterval = 500;
//hold value of timestamp from previous loop
let lastTime = 0;

let ravens = [];

class Raven{
    constructor(){
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        this.sizeModifier = Math.random() * 0.6 + 0.4;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = './raven_game/sprites/raven.png';
        this.frame = 0;
        this.maxFrame = 4;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 50;
    }

    update(deltaTime){
        this.x -= this.directionX;
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
        }
    }

    draw(){
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

function animate(timestamp){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextRaven += deltaTime;
    if(timeToNextRaven > ravenInterval){
        ravens.push(new Raven());
        timeToNextRaven = 0;
    };

    //create an array literal
    // ... = spread operator
    //spread the ravens array into the array literal
    [...ravens].forEach(object => object.update(deltaTime));
    [...ravens].forEach(object => object.draw());
    ravens = ravens.filter(object => !object.markedForDeletion);
    //console.log(ravens);
    requestAnimationFrame(animate);
}

animate(0);