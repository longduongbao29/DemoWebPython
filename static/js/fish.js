window.onload = function () {
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const fish = new Image();
    fish.src = 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnNlMDBmbDN6aXZhYnNhYW84YTB6bzZ4M3ozc3k1OTByYTBmd29nNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/loX6wSV615DWTePyqJ/giphy.gif';
    const scale = 0.5
    const w = fish.width * scale
    const h = fish.height * scale
    let x = 0;
    let y = 0;

    let headx = x + w
    let heady = y + h / 2
    let targetX = x;
    let targetY = y;

    let vector = { x: 0, y: 0 }
    const speed = 2;


    let angle = 0
    function len(x0, y0, x1, y1) {
        return Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0))
    }
    function vectorize(x0, y0, x1, y1) {
        len_vec = len(x0, y0, x1, y1)
        ret_vec = {
            x: (x1 - x0) / len_vec, y: (y1 - y0) / len_vec
        }
        return { vec: ret_vec, len: len_vec }
    }
    function drawFish() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save(); // Lưu trạng thái của context
        context.translate(x, y); // Di chuyển tọa độ gốc đến vị trí của hình ảnh
        context.rotate(angle); // Xoay hình ảnh
        context.scale(scale, scale); // Thay đổi tỉ lệ
        context.drawImage(fish, -fish.width / 2, -fish.height / 2); // Vẽ hình ảnh tại tọa độ mới
        context.restore(); // Khôi phục trạng thái của context
        requestAnimationFrame(drawFish);
    }

    function moveToTarget() {
        headx = x + w / 2
        heady = y + h / 2


        if (len(targetX, targetY, headx, heady) > 0.5) {
            x += vector.x * speed
            y += vector.y * speed
        }
        console.log(angle)
    }

    fish.onload = function () {
        drawFish();
    };

    canvas.addEventListener('click', function (event) {
        targetX = event.clientX - canvas.offsetLeft;
        targetY = event.clientY - canvas.offsetTop;
        vector_ = vectorize(headx, heady, targetX, targetY);
        distance = vector_.len
        vector = vector_.vec
        angle = Math.atan(vector.y / vector.x)
        if (targetX < x) {
            angle = angle + Math.PI

        }
    });

    function update() {
        moveToTarget();
        requestAnimationFrame(update);
    }

    update();
}