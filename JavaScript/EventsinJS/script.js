function on() {
  document.getElementById("bulb").style.backgroundColor = "yellow";
}

function off() {
  document.getElementById("bulb").style.backgroundColor = "white";
}

function red() {
  document.getElementById("bulb").style.backgroundColor = "red";
}

function green() {
  document.getElementById("bulb").style.backgroundColor = "green";
}

function blue() {
  document.getElementById("bulb").style.backgroundColor = "blue";
}

const userColor = document.getElementById("color");
userColor.addEventListener("change", () => changeBulbColor(userColor.value));

function changeBulbColor(color) {
  document.getElementById("bulb").style.backgroundColor = color;
}

function SB_control() {
  const btn = document.getElementById("SB_btn");
  if (btn.innerText === "On") {
    document.getElementById("SB_btn").innerText = "Off";
    document.getElementById("smartBulb").classList.add("on");
  } else if (btn.innerText === "Off") {
    document.getElementById("SB_btn").innerText = "On";
    document.getElementById("smartBulb").classList.remove("on");
  }
}

function SB_control2() {
  document.getElementById("smartBulb").classList.toggle("on");
}

document.getElementById("c1").addEventListener("mouseenter", () => {
  fillColor("violet");
});

document.getElementById("c1").addEventListener("mouseleave", () => {
  fillColor("white");
});

document.getElementById("c2").addEventListener("mouseenter", () => {
  fillColor("indigo");
});

document.getElementById("c2").addEventListener("mouseleave", () => {
  fillColor("white");
});

document.getElementById("c3").addEventListener("mouseenter", () => {
  fillColor("blue");
});

document.getElementById("c3").addEventListener("mouseleave", () => {
  fillColor("white");
});

document.getElementById("c4").addEventListener("mouseenter", () => {
  fillColor("green");
});

document.getElementById("c4").addEventListener("mouseleave", () => {
  fillColor("white");
});

document.getElementById("c5").addEventListener("mouseenter", () => {
  fillColor("yellow");
});

document.getElementById("c5").addEventListener("mouseleave", () => {
  fillColor("white");
});

document.getElementById("c6").addEventListener("mouseenter", () => {
  fillColor("orange");
});

document.getElementById("c6").addEventListener("mouseleave", () => {
  fillColor("white");
});

document.getElementById("c7").addEventListener("mouseenter", () => {
  fillColor("red");
});

document.getElementById("c7").addEventListener("mouseleave", () => {
  fillColor("white");
});

function fillColor(color) {
  console.log(color);

  document.getElementById("rainbowBulb").style.backgroundColor = color;
}
