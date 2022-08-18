var img = null;
var count = 0;
var canvas = document.getElementById("can");

function upload() {
  restart();
  var file = document.getElementById("input");
  img = new SimpleImage(file);
  img.drawTo(canvas);
  count += 1;
}

function greyScale() {
  if (img == null || !img.complete()) {
    alert("The image not loaded");
    return;
  }
  clearCanvas();
  for (var pix of img.values()) {
    var red = pix.getRed();
    var green = pix.getGreen();
    var blue = pix.getBlue();
    var greyScale = (red + green + blue) / 3;
    pix.setRed(greyScale);
    pix.setGreen(greyScale);
    pix.setBlue(greyScale);
  }
  img.drawTo(canvas);
}

function toRed() {
  if (img == null || !img.complete()) {
    alert("The image not loaded");
    return;
  }
  clearCanvas();
  for (var pix of img.values()) {
    var red = pix.getRed();
    var green = pix.getGreen();
    var blue = pix.getBlue();
    var avg = (red + green + blue) / 3;
    if (avg < 128) {
      pix.setRed(2 * avg);
      pix.setGreen(0);
      pix.setBlue(0);
    } else {
      pix.setRed(255);
      pix.setGreen(2 * avg - 255);
      pix.setBlue(2 * avg - 255);
    }
  }
  img.drawTo(canvas);
}

function colorFilter() {
  if (img == null || !img.complete()) {
    alert("The image not loaded");
    return;
  }
  clearCanvas();
  var tempImg = new SimpleImage(img.getWidth(), img.getHeight());
  var colorPicker = document.getElementById("color");
  var input = colorPicker.value;
  //Color filter algorithm
  var rc = hexToRgb(input)[0];
  var gc = hexToRgb(input)[1];
  var bc = hexToRgb(input)[2];
  for (var pix of img.values()) {
    var x = pix.getX();
    var y = pix.getY();
    tempImg.setPixel(x, y, pix);
  }
  for (var pix of tempImg.values()) {
    var red = pix.getRed();
    var green = pix.getGreen();
    var blue = pix.getBlue();
    var avg = (red + green + blue) / 3;
    colorFilerAlgorithm(avg, pix, rc, gc, bc);
  }
  tempImg.drawTo(canvas);
}

function rainbow() {
  if (img == null || !img.complete()) {
    alert("The image not loaded");
    return;
  }
  clearCanvas();
  //color red
  var rr = 255;
  var gr = 0;
  var br = 0;
  //color orange
  var ro = 255;
  var go = 165;
  var bo = 0;
  //color yellow
  var ry = 255;
  var gy = 255;
  var by = 0;
  //color green
  var rg = 0;
  var gg = 255;
  var bg = 0;
  //color blue
  var rb = 0;
  var gb = 0;
  var bb = 255;
  //color indigo
  var ri = 75;
  var gi = 0;
  var bi = 130;
  //color violet
  var rv = 238;
  var gv = 130;
  var bv = 238;
  var part = parseInt(img.getHeight() / 7);
  for (var pix of img.values()) {
    var y = pix.getY();
    var red = pix.getRed();
    var green = pix.getGreen();
    var blue = pix.getBlue();
    var avg = (red + green + blue) / 3;
    if (y < part) {
      colorFilerAlgorithm(avg, pix, rr, gr, br);
    } else if (y < 2 * part) {
      colorFilerAlgorithm(avg, pix, ro, go, bo);
    } else if (y < 3 * part) {
      colorFilerAlgorithm(avg, pix, ry, gy, by);
    } else if (y < 4 * part) {
      colorFilerAlgorithm(avg, pix, rg, gg, bg);
    } else if (y < 5 * part) {
      colorFilerAlgorithm(avg, pix, rb, gb, bb);
    } else if (y < 6 * part) {
      colorFilerAlgorithm(avg, pix, ri, gi, bi);
    } else if (y <= 7 * part) {
      colorFilerAlgorithm(avg, pix, rv, gv, bv);
    }
  }
  img.drawTo(canvas);
}

function toBlur() {
  if (img == null || !img.complete()) {
    alert("The image not loaded");
    return;
  }
  clearCanvas();
  var newImg = new SimpleImage(img.getWidth(), img.getHeight());
  for (var pix of img.values()) {
    var x = pix.getX();
    var y = pix.getY();
    if (halfByHalf()) {
      newImg.setPixel(x, y, pix);
    } else {
      var newX = 0;
      var newY = 0;
      if (halfByHalf()) {
        newX = x + Math.floor(Math.random() * 10) + 1;
      } else {
        newX = x - Math.floor(Math.random() * 10) + 1;
      }
      if (halfByHalf()) {
        newY = y + Math.floor(Math.random() * 10) + 1;
      } else {
        newY = y - Math.floor(Math.random() * 10) + 1;
      }
      if (newX <= 0 || newX >= img.getWidth()) {
        newX = x;
      }
      if (newY <= 0 || newY >= img.getHeight()) {
        newY = y;
      }
    }
    newImg.setPixel(x, y, img.getPixel(newX, newY));
  }
  newImg.drawTo(canvas);
}

function halfByHalf() {
  var random = Math.random();
  if (random < 0.5) {
    return true;
  } else {
    return false;
  }
}

function colorFilerAlgorithm(avg, pix, rc, gc, bc) {
  if (avg < 128) {
    pix.setRed((rc / 127.5) * avg);
    pix.setGreen((gc / 127.5) * avg);
    pix.setBlue((bc / 127.5) * avg);
  } else {
    pix.setRed((2 - rc / 127.5) * avg + 2 * rc - 255);
    pix.setGreen((2 - gc / 127.5) * avg + 2 * gc - 255);
    pix.setBlue((2 - bc / 127.5) * avg + 2 * bc - 255);
  }
}

function hexToRgb(hex) {
  var bigint = parseInt(hex.slice(1), 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;
  return [r, g, b];
}

function reset() {
  clearCanvasA();
  img = null;
  var file = document.getElementById("input");
  file.value = null;
  var color = document.getElementById("color");
  color.value = "#ffffff";
  count = 0;
}

function restart() {
  clearCanvas();
  img = null;
  var color = document.getElementById("color");
  color.value = "#ffffff";
  count = 0;
}

function clearCanvasA() {
  var cxt = canvas.getContext("2d");
  cxt.clearRect(0, 0, canvas.width, canvas.height);
}


/*Functions for Green Screen */
var foreImg;
var backImg;
function uploadFore() {
  var canvas1 = document.getElementById("a");
  var file1 = document.getElementById("file1");
  foreImg = new SimpleImage(file1);
  foreImg.drawTo(canvas1);
}

function uploadBack() {
  var canvas2 = document.getElementById("b");
  var file2 = document.getElementById("file2");
  backImg = new SimpleImage(file2);
  backImg.drawTo(canvas2);
}

function merge() {
  if (foreImg == null || !foreImg.complete()) {
    alert("The foreground image hasn't uploaded");
    return;
  }
  if (backImg == null || !backImg.complete()) {
    alert("The backgroung image hasn't uploaded");
    return;
  }
  clearImg();
  var out = new SimpleImage(foreImg.getWidth(), foreImg.getHeight());
  for (var pix of foreImg.values()) {
    var red = pix.getRed();
    var green = pix.getGreen();
    var blue = pix.getBlue();
    var x = pix.getX();
    var y = pix.getY();
    if (green > blue + red) {
      out.setPixel(x, y, backImg.getPixel(x, y));
    } else {
      out.setPixel(x, y, pix);
    }
  }
  var can = document.getElementById("a");
  out.drawTo(can);
  alert("Success!!Click on Clear Canvas to start another job");
}

function clearCanvas() {
  var can1 = document.getElementById("a");
  var can2 = document.getElementById("b");
  var cxt1 = can1.getContext("2d");
  var cxt2 = can2.getContext("2d");
  var file1 = document.getElementById("file1");
  var file2 = document.getElementById("file2");
  file1.value = null;
  file2.value = null;
  foreImg = null;
  backImg = null;
  cxt1.clearRect(0, 0, can1.width, can1.height);
  cxt2.clearRect(0, 0, can2.width, can2.height);
}

function clearImg() {
  var can1 = document.getElementById("a");
  var can2 = document.getElementById("b");
  var cxt1 = can1.getContext("2d");
  var cxt2 = can2.getContext("2d");
  cxt1.clearRect(0, 0, can1.width, can1.height);
  cxt2.clearRect(0, 0, can2.width, can2.height);
}