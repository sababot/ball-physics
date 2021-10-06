document.addEventListener("keydown", doKeyDown, true);

let g = 0;
let f = 1;

function toggleGravity(){
    if (g == 0){
        g = 0.5;
    }
    else if(g == 0.5){
        g = 0;
    }
}

function toggleFriction(){
    if (f == 1){
        f = 0.5;
    }
    else if(f == 0.5){
        f = 1;
    }
}

function doKeyDown(e) {
    if(e.keyCode == 71){
        toggleGravity();
        toggleFriction();
    }
}

function Particle(x, y, dx, dy){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.r = 15;
    this.m = 2.5;
    this.colliding = true;

    this.draw = function(){
        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        c.fillStyle = "#c842f5";
        c.fill();
        c.stroke();
    }

    this.update = function(){
        if(this.x + this.r > innerWidth || this.x - this.r < 0){
            this.dx = -(this.dx *= f);
        }

        if(this.y + this.r > innerHeight || this.y - this.r < 0){
            this.dy = -(this.dy *= f);
        }

        // gravity
        if(this.y < window.innerHeight - this.r){
            this.dy += g;
        }

        if (this.y > window.innerHeight - this.r){
            this.y = window.innerHeight - this.r;
        }

        if (this.y == window.innerHeight - this.r && g == 0){
            this.dx *= 0.9;
        }

        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }
}

var particleArray = [];

for (var i = 0; i < 50; i++){
    var r = 15;
    var x = Math.random() * (innerWidth - r * 2) + r;
    var y = Math.random() * (innerHeight - r * 2) + r;
    var dx = (Math.random() - 0.5) * 10;
    var dy = (Math.random() - 0.5) * 10;
    particleArray.push(new Particle(x, y, dx, dy));
}

var circleIntersect = function(x1, y1, r1, x2, y2, r2) {

    // Calculate the distance between the two circles
    let squareDistance = (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2);

    // When the distance is smaller or equal to the sum
    // of the two radius, the circles touch or overlap
    return squareDistance <= ((r1 + r2) * (r1 + r2))
}

function collide(){
    let obj1;
    let obj2;

    // Reset collision state of all objects
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].colliding = false;
    }

    // Start checking for collisions
    for (let i = 0; i < particleArray.length; i++)
    {
        obj1 = particleArray[i];

        for (let j = i + 1; j < particleArray.length; j++)
        {
            obj2 = particleArray[j];

            // Compare object1 with object2
            var dist = circleIntersect(obj1.x, obj1.y, obj1.r, obj2.x, obj2.y, obj2.r);
            if (dist === true){
                obj1.colliding = true;
                obj2.colliding = true;

                let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
                let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
                let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
                let vRelativeVelocity = {x: obj1.dx - obj2.dx, y: obj1.dy - obj2.dy};
                let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

                if (speed < 0){
                    break;
                }

                obj1.dx -= (speed * vCollisionNorm.x);
                obj1.dy -= (speed * vCollisionNorm.y);
                obj2.dx += (speed * vCollisionNorm.x);
                obj2.dy += (speed * vCollisionNorm.y);
            }
        }
    }
}

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);
    collide();
    for (i = 0; i < particleArray.length; i++){
        particleArray[i].update();
    }
}

animate();
