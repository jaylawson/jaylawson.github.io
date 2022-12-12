// Initialising the canvas
var canvas = document.querySelector('canvas'),
    ctx = canvas.getContext('2d');

// Setting up the letters
var letters = 'ABCDEFGHIJKLMNOPQRSTUVXYZ1234567890你尼擬妮泥倪逆我喔沃窩握臥倭一二三四五六七八九十あいうえおかきくけこさしすせそがぎぐげごぱぴぷぺぽアイウエオカキクケコサシスセソ가방도마도땅친구하나';
letters = letters.split('');

var sidebar = document.getElementById('left-div')

canvas.width = sidebar.offsetWidth;
canvas.height = sidebar.offsetHeight;

// Setting up the columns
var fontSize = 10,
    columns = canvas.width / fontSize;

// Setting up the drops
var drops = [];
for (var i = 0; i < columns; i++) {
    drops[i] = Math.floor(Math.random() * sidebar.children[1].offsetHeight);
}

console.log(sidebar.height);

// Setting up the draw function
function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, .09)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < drops.length; i++) {
        var text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillStyle = '#0f0';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        drops[i]++;
        if (drops[i] * fontSize > canvas.height && Math.random() > .96) {
            drops[i] = 0;
        }
    }
}

// Loop the animation
setInterval(draw, 100);
