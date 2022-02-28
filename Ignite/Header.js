function setup() {
  var svgObject = document.getElementById("svg-object").contentDocument;
  var svg = svgObject.getElementsByTagName("svg")[0];

  console.log(svg);

  const ctx = document.getElementById("header-canvas").getContext("2d");

  const { width, height } = ctx.canvas;

  ctx.fillStyle = "green";
  ctx.fill();
  ctx.fillRect(0, 0, width, height);
}

window.addEventListener("load", setup);
