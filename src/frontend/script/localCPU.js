field = document.getElementById("pong_field");
lpad = document.getElementById("player1");
rpad = document.getElementById("player2");
ball_div = document.getElementById("ball");

side = 0, ball_x = field.offsetWidth / 2, ball_y = field.offsetHeight / 2;

/////////////////////////// On load ///////////////////////////
field.setAttribute('tabindex', '0'); // Make playground focusable
field.focus();
localGameCPU();

/////////////////////////// Events part ///////////////////////////

field.addEventListener('click', () => {
  field.focus();
});

field.addEventListener('keydown', keydown)
field.addEventListener('keyup', keyup)

function keydown(event) {
    key = event.key;
    if (keyStillCPUDown)
        return;
    keyStillCPUDown = key;
    if (key === 'q')
        move[0] = -1;
    else if (key === 'z')
        move[0] = 1;
}

function keyup(event) {
    if (event.key !== keyStillCPUDown)
        return
    keyStillCPUDown = false
    move[0] = 0;
}

/////////////////////////// Utils ///////////////////////////

function generateRandomNick() {
    const adjectives = ["Shadow", "Steady", "Mighty", "Funny", "Hidden", "Normal"];
    const nouns = ["Ficus", "Pidgin", "Rock", "Pillow", "Curtains", "Hobo"];

    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    return randomAdj + randomNoun + Math.floor(Math.random() * 1000);
}

function randomInRange(a, b) {
    let range = Math.random() < 0.5 ? [-b, -a] : [a, b];
    return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
}

/////////////////////////// Game engine ///////////////////////////

function localGameCPU() {
    init();
    difficulty = 3.2;
    // difficulty = document.getElementById("diff").value;
    raf = requestAnimationFrame(play);
}

function init() {
    resetValues();
    playing = true;
    move[LEFT_PLAYER] = move[RIGHT_PLAYER] = score[LEFT_PLAYER] = score[RIGHT_PLAYER] = 0;
    keyStillCPUDown = false;    
}

function resetValues() {
    ball_x = field.offsetWidth / 2;
    ball_y = field.offsetHeight / 2;
    ball_dx = randomInRange(3, 4);
    ball_dy = randomInRange(3, 4);
    speed = 1;
    size[LEFT_PLAYER] = size[RIGHT_PLAYER] = PADWIDTH;
    pad[LEFT_PLAYER] = pad[RIGHT_PLAYER] = (field.offsetHeight - PADWIDTH) / 2 ;
    document.getElementById("player1").style.height = size[LEFT_PLAYER] + 'px';
    document.getElementById("player2").style.height = size[RIGHT_PLAYER] + 'px';
}

function cpuMove() {
    move[RIGHT_PLAYER] = ball_y > (pad[RIGHT_PLAYER] + size[RIGHT_PLAYER] /2) ? 1 : -1;
}

function movePaddles() {
    cpuMove();
    if (move[LEFT_PLAYER]) {
        pad[LEFT_PLAYER] += move[LEFT_PLAYER] * 2 * speed;
        if (pad[LEFT_PLAYER] < 0)
            pad[LEFT_PLAYER] = 0;
        if (pad[LEFT_PLAYER] + size[LEFT_PLAYER] > field.offsetHeight)
            pad[LEFT_PLAYER] = field.offsetHeight - size[LEFT_PLAYER];
    }
    if (move[RIGHT_PLAYER]) {
        if (difficulty == 10)
            pad[RIGHT_PLAYER] = ball_y - size[RIGHT_PLAYER] / 2;
        else
            pad[RIGHT_PLAYER] += move[RIGHT_PLAYER] * difficulty * speed;
        if (pad[RIGHT_PLAYER] < 0)
            pad[RIGHT_PLAYER] = 0;
        if (pad[RIGHT_PLAYER] + size[RIGHT_PLAYER] > field.offsetHeight)
            pad[RIGHT_PLAYER] = field.offsetHeight - size[RIGHT_PLAYER];
    }
    lpad.style.top = pad[LEFT_PLAYER] + 'px';
    rpad.style.top = pad[RIGHT_PLAYER] + 'px';
}

function moveBall() {
    // Move ball
    ball_x = ball_x + ball_dx * speed;
    ball_y = ball_y +  ball_dy * speed;
    // Check top / bottom collision
    if (ball_y <= 0 || ball_y + RADIUS >= field.offsetHeight)
        ball_dy = -ball_dy;
    // Check left / right collision
    if (ball_x <= 0)
        side_collision(LEFT_PLAYER);
    else if (ball_x + RADIUS >= field.offsetWidth)
        side_collision(RIGHT_PLAYER);
    ball_div.style.left = ball_x + 'px'
    ball_div.style.top = ball_y + 'px'
}

function side_collision(side) {
    // check paddle collision
    if (pad[side] <= ball_y && ball_y <= pad[side] + size[side]) {
        if (size[side] > 10)
            size[side] -= 10;
        document.getElementById("player1").style.height = size[LEFT_PLAYER] + 'px';
        document.getElementById("player2").style.height = size[RIGHT_PLAYER] + 'px';
        ball_dx = -ball_dx;
        speed += 0.3;
        return;
    }
    scoreup(1 - side);
}

function scoreup(side) {
    score[side]++;
    document.getElementById("lscore").innerText = score[LEFT_PLAYER];
    document.getElementById("rscore").innerText = score[RIGHT_PLAYER];
    if (score[side] >= SCORE_MAX) {
        endgame();
        return;
    }
    resetValues();
}

function endgame() {
    winner = score[LEFT_PLAYER] >= SCORE_MAX ? "Player 1" : "CPU";
    alert(`GAME OVER\nLe gagnant est ${winner}!`);
    cancelAnimationFrame(raf);
    init();
    playing = false;
    changeMainHTML("./matchmaking.html", null);
}

function play() {
    movePaddles();
    moveBall();
    if (playing)
        requestAnimationFrame(play);
}