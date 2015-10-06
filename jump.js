/*
 * This javascript code is written by Anthony Bao
 * To farthest possible extent of his abilities, Anthony hereby relinquishes any claim
 * that he has over this original code. Anthony wishes that others will steal it and improve it.
 */


//for Mozilla, tells browser that an animation will be performed
(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById("canvas"),
        ctx = canvas.getContext("2d"),
        width = 1000,
        height = 630,
        gameover = false,
        player = {
            x: width / 2,
            y: 0,
            width: 15,
            height: 15,
            speed: 3,
            velX: 0,
            velY: 0,
            jumping: false
        },
background = {
    y_soil: 60,
    y_grass: 80,
    y_pipe: height / 2,
    height_soil: 80,
    height_grass: 20,
    height_pipe: 40,
    width_pipe: 80

},
basicslime1 = {
    x: width - background.width_pipe,
    y: height / 2,
    width: 25,
    height: 15,
    velX: -1,
    velY: 0
},
keys = [],
        friction = 0.8,
        gravity = 0.3;

canvas.width = width;
canvas.height = height;
function drawsky1() {
    ctx.fillStyle = "lightskyblue";
    ctx.fillRect(0, 0, width, height);
}
function drawturf1() {
    ctx.fillStyle = "#934A00";
    ctx.fillRect(0, height - background.y_soil, width, background.height_soil);
    ctx.fillStyle = "green";
    ctx.fillRect(0, height - background.y_grass, width, background.height_grass);
}
function drawpipe() {
    ctx.fillStyle = "lime";
    ctx.fillRect(width - (background.width_pipe), background.y_pipe, background.width_pipe, background.height_pipe);
    ctx.fillStyle = "springgreen";
    ctx.fillRect(width - (background.width_pipe), background.y_pipe - 10, 20, background.height_pipe + 20);
}
function drawbackground() {
    drawsky1();
    drawturf1();
    drawpipe();
}
function gameoverscreen() {
    ctx.fillStyle = 'rgba(50,50,50,0.5)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "white";
    ctx.font = "20pt sans-serif";
    ctx.fillText("GAME OVER", 420, 300);
    
    //displays restart button
    $("#restartbutton").show();
}
function drawplayer()    {
    ctx.fillStyle = "blueviolet";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}
function drawbasicslime1()   {
    ctx.fillStyle = "lime";
    ctx.fillRect(basicslime1.x, basicslime1.y, basicslime1.width, basicslime1.height);
}
function update() {
    // check keys
    if (keys[38] || keys[32]) {
        // up arrow or space
        if (!player.jumping) {
            player.jumping = true;
            player.velY = -player.speed * 2.5;
        }
    }
    if (keys[39]) {
        // right arrow
        if (player.velX < player.speed) {
            player.velX++;
        }
    }
    if (keys[37]) {
        // left arrow
        if (player.velX > -player.speed) {
            player.velX--;
        }
    }
    //friction of the player
    player.velX *= friction;
    //factors gravity into equation
    player.velY += gravity;
    basicslime1.velY += gravity;

    //if player hits basicslime1 from behind (leftward <--)
    if (basicslime1.x - player.x <= player.width && basicslime1.x - player.x > -(basicslime1.width + 1) && player.y >= height - player.height - background.y_grass - basicslime1.height) {
        basicslime1.velX = 0;
        player.velX = 0;
        player.velY = 0;
        gameover = true;
    }
    //if player hits basicslime1 from in front (rightward-->)
    if (player.x - basicslime1.x <= player.width && player.x - basicslime1.x > -(player.width + 1) && player.y >= height - player.height - background.y_grass - basicslime1.height) {
        basicslime1.velX = 0;
        player.velX = 0;
        player.velY = 0;
        gameover = true;
    }

    //movement of player
    player.x += player.velX;
    player.y += player.velY;
    //movement of basicslime1


    basicslime1.x += basicslime1.velX;
    basicslime1.y += basicslime1.velY;

    //right boundary for player
    if (player.x >= width - player.width) {
        player.x = width - player.width;
    }
    //left boundary for player
    else if (player.x <= 0) {
        player.x = 0;
    }
    //bottom boundary for player
    if (player.y >= height - player.height - background.y_grass) {
        player.y = height - player.height - background.y_grass;
        player.jumping = false;
    }
    //right boundary for basicslime1
    if (basicslime1.x >= width - basicslime1.width) {
        basicslime1.x = width - basicslime1.width;
        basicslime1.velX *= -1;
    }
    //left boundary for basicslime1
    else if (basicslime1.x <= 0) {
        basicslime1.x = 0;
        basicslime1.velX *= -1;
    }
    //bottom boundary for basicslime1
    if (basicslime1.y >= height - basicslime1.height - background.y_grass) {
        basicslime1.y = height - basicslime1.height - background.y_grass;
    }

    ctx.clearRect(0, 0, width, height);
    drawbackground();
    drawplayer();
    drawbasicslime1();

    if (gameover) {
        gameoverscreen();
    }

    requestAnimationFrame(update);

}

document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});


