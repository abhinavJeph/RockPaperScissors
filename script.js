// Canvas
var canvas = document.getElementById('canvas')
var tool = canvas.getContext('2d')
var startBtn = document.querySelector('.box .start')
var restartBtn = document.querySelector('.box .restart')
var box = document.querySelector('.box')
var boxTxt = document.getElementById('boxTxt')

//Controls
var speed = 2;
var width = 30;
var height = 30;
var randomizeController = [10, 55];
var initialShapeCount = 20;

var battleAudio = new Audio('battleAudio.mp3');
battleAudio.load();

var gameAudio = new Audio('gameAudio.mp3');
gameAudio.load();
gameAudio.loop = true;

//Image
var ScissorsImg = new Image()
ScissorsImg.src = "ScissorsImg.png"

var rockImg = new Image()
rockImg.src = "rockImg.png"

var paperImg = new Image()
paperImg.src = "paperImg.png"

var Constants = {
    Rock : {
        array: [],
        image: rockImg,
        id : 'Rock',
        enemy: 'Paper'
    },
    Scissors : {
        array : [],
        image: ScissorsImg,
        id: 'Scissors',
        enemy: 'Rock',
    },
    Paper : {
        array : [],
        image: paperImg,
        id: 'Paper',
        enemy: 'Scissors',
    }
}

function getRandomAngle() {
    return Math.random()*Math.PI*2;
}

function boundaryCollide(shape) {
    let l = shape.x
    let r = l + shape.width
    let t = shape.y
    let b = t + shape.height

    if(t <= 0 || b >= canvas.height) {
        shape.velocity.y *= -1;
    }

    if(l <= 0 || r >= canvas.width) {
        shape.velocity.x *= -1; 
    }

    shape.angle = Math.atan2(shape.velocity.y, shape.velocity.x);
}

function animation() {
    tool.clearRect(0,0,canvas.width,canvas.height)
    
    Object.values(Constants).forEach(shapeObject => {
        for(let index = shapeObject.array.length-1; index >= 0; index--) {
            let destroyed = false;
            let shape1 = shapeObject.array[index];
            var enemyShape =  Constants[shapeObject.enemy];

            var length = enemyShape.array.length;
            for(let i = 0; i < length; i++) {
                let winningShape = enemyShape.array[i];
                if(winningShape.collide(shape1)) {
                    shapeObject.array.splice(index, 1);
                    enemyShape.array.push(new Shape(shape1.x, shape1.y, getRandomAngle(), enemyShape.image, enemyShape.id));
                    destroyed = true;
                    break;
                }
            }
            
            if(shapeObject.array.length >= 3*initialShapeCount){
                setTimeout(()=>{
                    cancelAnimationFrame(animationID)
                    winner(shapeObject.id);
               },0)
            }

            if(!destroyed) shape1.update()
        }
    })

    animationID = requestAnimationFrame(animation)
}

// Game Start
startBtn.addEventListener('click',(e)=>{
    e.stopImmediatePropagation()
    
    gameAudio.pause();
    battleAudio.play().then(() => {
        box.style.display = 'none'
        canvas.style.display = 'flex';
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        var boundaries = canvas.getBoundingClientRect();
    
        //add Shapes
        Object.values(Constants).forEach(shapeObject => {
            // Object.values(shapeObject).forEach(s => console.log(s));
            for (var i = 0; i < initialShapeCount; i++) {
                let x = boundaries.width*Math.random(); //300
                let y = boundaries.height*Math.random(); //150
                let angle = Math.random()*Math.PI*2;
                let image = shapeObject.image;
                let id = shapeObject.id;
                shapeObject.array.push(new Shape(x, y, angle, image, id));
            }
        })
    
        // Animation
        animation()
    })
})

function winner(winnerName) {
    battleAudio.pause();
    gameAudio.play();
    box.style.display = 'flex'
    text.innerText = winnerName + " won ";

    switch(winnerName) {
        case Constants.Rock.id:
            text.innerText += "🪨"; break;
        case Constants.Paper.id:
            text.innerText += "📄"; break;
        case Constants.Scissors.id:
            text.innerText += "✂️"; break;
    }

    canvas.height = 0
    startBtn.style.display = 'none'
    restartBtn.style.display = 'inline-block'
}

// If clicked on Restart
restartBtn.addEventListener('click',()=>{
    window.location.reload()
})

