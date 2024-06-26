import { GIF } from '/static/js/gif.js'

var canvas_width
var canvas_height

class Vector {
    constructor(x0, y0, x1, y1) {
        this.len = Vector.len_(x0, y0, x1, y1)
        if (this.len != 0) {
            this.x = (x1 - x0) / this.len
            this.y = (y1 - y0) / this.len
        }
        else {
            this.x = this.y = 0;
        }
    }
    static len_(x0, y0, x1, y1) {
        return Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0))
    }
}
class SmallFish {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 120;
        this.h = 75;
        this.centx = this.x + this.w / 2
        this.centy = this.y + this.h / 2
        this.speed = 1.5; // Tốc độ di chuyển
        // Các thuộc tính khác nếu cần
        this.src = 'static/gif/giphy.gif';
        this.image = GIF();
        this.image.load(this.src);
        this.in_shoal = false
        this.vector = new Vector(0, 0, 0, 0)
        this.ran_time = Math.random() * 1000
        this.flip = false
        this.targetX = Math.random() * 10000 % canvas_width
        this.targetY = Math.random() * 10000 % canvas_height
    }

    moveToTarget() {
        let thres = 2
        if (Vector.len_(this.centx, this.centy, this.targetX, this.targetY) > thres) {
            this.centx += this.vector.x * this.speed
            this.centy += this.vector.y * this.speed
        }
        this.x = this.centx - this.w / 2
        this.y = this.centy - this.h / 2
    }
    draw(context) {
        // Vẽ cá nhỏ
        if (!this.image.loading) {

            context.save();
            if (this.flip) {
                context.translate(this.x + this.w, this.y);
                context.scale(-1, 1);
                context.drawImage(this.image.image, 0, 0, this.w, this.h);
            } else {
                context.drawImage(this.image.image, this.x, this.y, this.w, this.h);
            }
            context.restore();
        }

    }

    update() {
        if (this.in_shoal) {

        }
        else {
            if (this.ran_time > 0) {
                this.ran_time -= 1;
            }
            else {
                this.targetX = Math.random() * 10000 % canvas_width
                this.targetY = Math.random() * 10000 % canvas_height
                this.vector = new Vector(this.x, this.y, this.targetX, this.targetY)
                this.ran_time = Math.random() * 1000;
            }

        }

        if (this.centx < this.targetX) {
            this.flip = false;
        }
        else {
            this.flip = true;
        }
        this.moveToTarget();
        // Cập nhật vị trí của cá nhỏ
        // Có thể thêm logic di chuyển cho cá nhỏ ở đây
    }
}

class BigFish {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.w = 240;
        this.h = 135;

        this.centx = this.x + this.w / 2
        this.centy = this.y + this.h / 2
        this.radius = 10; // Bán kính của cá nhỏ
        this.speed = 2; // Tốc độ di chuyển
        // Các thuộc tính khác nếu cần
        this.src = 'static/gif/giphy.gif';
        this.targetX = 0;
        this.targetY = 0;
        this.vector = new Vector(0, 0, 0, 0)
        this.image = GIF();
        this.image.load(this.src);

        this.flip = false;

    }
    init(canvas, bigFish) {
        canvas.addEventListener('click', function (event) {
            bigFish.targetX = event.clientX;
            bigFish.targetY = event.clientY;
            bigFish.vector = new Vector(bigFish.centx, bigFish.centy, bigFish.targetX, bigFish.targetY)
            console.log(bigFish.vector);
        });


    }
    moveToTarget() {
        let thres = 1
        if (Vector.len_(this.centx, this.centy, this.targetX, this.targetY) > thres) {
            this.centx += this.vector.x * this.speed
            this.centy += this.vector.y * this.speed
        }
        this.x = this.centx - this.w / 2
        this.y = this.centy - this.h / 2


    }
    draw(context) {
        if (!this.image.loading) {

            context.save();
            if (this.flip) {
                context.translate(this.x + this.w, this.y);
                context.scale(-1, 1);
                context.drawImage(this.image.image, 0, 0, this.w, this.h);
            } else {
                context.drawImage(this.image.image, this.x, this.y, this.w, this.h);
            }
            context.restore();
        }
    }


    update() {
        // Cập nhật vị trí của cá nhỏ
        // Có thể thêm logic di chuyển cho cá nhỏ ở đây
        if (this.centx < this.targetX) {
            this.flip = false;
        }
        else {
            this.flip = true;
        }
        this.moveToTarget();


    }
}


window.onload = function () {
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');
    canvas_width = canvas.width = window.innerWidth;
    canvas_height = canvas.height = window.innerHeight;
    // Tạo một con cá lớn
    const bigFish = new BigFish(0, 0);
    bigFish.init(canvas, bigFish);
    // Tạo danh sách chứa các con cá nhỏ
    const smallFishes = [];
    const numSmallFishes = 10; // Số lượng con cá nhỏ

    // Khởi tạo các con cá nhỏ
    for (let i = 0; i < numSmallFishes; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const smallFish = new SmallFish(x, y);
        smallFishes.push(smallFish);
    }
    bigFish.init(canvas);
    window.addEventListener('resize', function () {
        // Resize canvas when window size changes
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        x = canvas.width / 2;
        y = canvas.height / 2;
    });
    function draw() {

        context.clearRect(0, 0, canvas.width, canvas.height);

        // Vẽ con cá lớn
        bigFish.update();
        bigFish.draw(context);


        // // Vẽ và cập nhật các con cá nhỏ
        smallFishes.forEach((smallFish) => {
            smallFish.update();
            smallFish.draw(context);

        });

        requestAnimationFrame(draw);
    }

    draw();
};
