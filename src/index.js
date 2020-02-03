import * as PIXI from 'pixi.js';
import { Population } from './population.js';
import * as helper from './helper.js';

//Create a Pixi Application
let app = new PIXI.Application({width: 1000, height: 600, transparent: false});
app.renderer.backgroundColor = 0x061639;
//Add the canvas that Pixi automatically created for you to the HTML document
document.getElementById("smartrockets").appendChild(app.view);

const rocketImg = "./imgs/rocket-sm.png";
const birdhouseImg = "./imgs/birdhouse-sm.png";

let images = [
  rocketImg,
  birdhouseImg
];

app.loader
  .add(images)
  .on("progress", loadProgressHandler)
  .load(setup);

let state = smartRocketsState;

// TODO: Allow user to customize variables
// TODO: Allow user to move the target
// TODO: Allow user to change the map
// TODO: Make hard maps and race to complete them
// TODO: Allow users to delete rockets during the genetic algorithm.  They can guide the rockets to go in the right direction.
//       Is it obvious which direction is the right one?  I bet there are interesting and fun puzzles to play alongside ML.
//       Or make it simple and cool: https://www.youtube.com/watch?v=5xN4DxdiFrs
// TODO: Better physics: https://www.khanacademy.org/science/physics/two-dimensional-motion/two-dimensional-projectile-mot/a/what-is-2d-projectile-motion
let population;
let target;
const lifespan = 300;
const populationSize = 100;
let count = 0;
let generation = 0;
const vectorMag = 1;
const gravity = [0, .01];


function setup() {
  population = new Population(populationSize, app.stage, app.loader.resources[rocketImg].texture, app.renderer.width, app.renderer.height, lifespan, vectorMag);
  
  // Load default target
  initTarget();
  // Load default map
  app.stage.addChild(maps[mapIndex]);

  app.ticker.add(delta => state(delta));
}

function initTarget() {
  target = new PIXI.Sprite(app.loader.resources[birdhouseImg].texture);
  target.width = 50;
  target.height = 75;
  target.x = app.renderer.width / 2;
  target.y = 100;
  target.zIndex = 1;
  app.stage.addChild(target);
}


function smartRocketsState(delta) {
  for (let i = 0; i < population.rockets.length; i++) {
    updateRocket(population.rockets[i], target);
  }
  count++;
  document.getElementById("count").innerHTML = "Day: " + count;
  document.getElementById("gen").innerHTML = "Generation: " + generation;

  if (count >= lifespan) {
    population.evaluate(target);
    population.selection();
    population.display();
    count = 0;
    generation++;
  }
}

  // TODO: utilize quadtrees for efficient collision detection.  Broad vs Narrow.
function updateRocket(rocket, target) {
  if (helper.outOfBounds(rocket.sprite, app.renderer.width, app.renderer.height)) {
    rocket.crashed = true;
    rocket.dayCrashed = count;
  }

  // TODO: break after first crash: https://stackoverflow.com/questions/2641347/short-circuit-array-foreach-like-calling-break
  maps[mapIndex].children.forEach((obstacle) => {
    if (helper.rectRect(rocket.sprite.x, rocket.sprite.y, rocket.sprite.width, rocket.sprite.height,
                        obstacle.x, obstacle.y, obstacle.width, obstacle.height)) {
      rocket.crashed = true;
      rocket.dayCrashed = count;
    }
  });

  if (helper.spriteCollide(rocket.sprite, target)) {
    rocket.finished = true;
    rocket.dayFinished = count;
    rocket.sprite.x = target.x + (target.width / 2) - (rocket.sprite.width / 2);
    rocket.sprite.y = target.y + (target.height / 2) - (rocket.sprite.height / 2);
  }

  if (!rocket.crashed && !rocket.finished) {
    // Add gravity acceleration to velocity
    rocket.vel = helper.addVectors(rocket.vel, gravity);

    // Add rocket acceleration to velocity
    rocket.vel = helper.addVectors(rocket.vel, rocket.dna.genes[count]);

    // Add velocity to position
    let pos = [rocket.sprite.x, rocket.sprite.y];
    [rocket.sprite.x, rocket.sprite.y] = helper.addVectors(pos, rocket.vel);
  }
}

// TODO
function titleState(){}
function endState(){}

function loadProgressHandler(loader, resource) {
  //Display the file `url` currently being loaded
  console.log("loading: " + resource.url); 

  //Display the percentage of files currently loaded
  console.log("progress: " + loader.progress + "%"); 
}

// TODO: Define crash and bounce obstacles
// Maps
let mapIndex = 0;
let maps = [
  map1(),
  map2(),
  map3(),
];
function loadNextMap() {
  app.stage.removeChild(maps[mapIndex]);
  mapIndex++;
  if (mapIndex >= maps.length) {
    mapIndex = 0;
  }
  app.stage.addChild(maps[mapIndex]);
}

function map1() {
  let mapContainer = new PIXI.Container();

  let oW = 500;
  let oH = 10;
  let oX = app.renderer.width / 2 - oW / 2;
  let oY = 300;
  let rect = new PIXI.Graphics();
  rect.beginFill(0x000000);
  rect.drawRect(0, 0, oW, oH);
  rect.position.set(oX, oY)

  mapContainer.addChild(rect);
  return mapContainer;
}

function map2() {
  let mapContainer = new PIXI.Container();

  let oW = 500;
  let oH = 10;
  let oX = app.renderer.width / 2 - oW / 2;
  let oY = 400;
  let rect = new PIXI.Graphics();
  rect.beginFill(0xFFFFFF);
  rect.drawRect(0, 0, oW, oH);
  rect.position.set(oX, oY)

  mapContainer.addChild(rect);
  return mapContainer;
}

function map3() {
  let mapContainer = new PIXI.Container();

  let style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 36,
    fill: "white",
    stroke: '#000000',
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
  });
  let message = new PIXI.Text("Welcome to the Birdhouse", style);
  message.position.set(300, 300);

  mapContainer.addChild(message);
  return mapContainer;
}

document.getElementById("changeMap").addEventListener("click", function(e) {
  loadNextMap();
});

