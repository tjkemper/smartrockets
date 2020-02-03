import { Rocket } from './rocket.js';
import * as PIXI from 'pixi.js';
import * as helper from './helper.js';

export function Population(size, rootStage, rocketTexture, windowWidth, windowHeight, lifespan, vectorMag) {
  this.size = size || 10;
  this.rockets = [];
  this.matingPool = [];

  this.rootStage = rootStage;
  this.rocketTexture = rocketTexture;
  this.windowWidth = windowWidth;
  this.windowHeight = windowHeight;
  this.rocketContainer = null;

  this.vectorMag = vectorMag;

  this.initRockets = function() {
    this.rockets = [];
    for (let i = 0; i < this.size; i++) {
      let newRocket = new Rocket(this.rocketTexture, this.windowWidth, this.windowHeight, lifespan, this.vectorMag);
      this.rockets.push(newRocket);
    }
  }

  this.display = function () {
    this.rootStage.removeChild(this.rocketContainer);
    this.rocketContainer = new PIXI.Container();
    this.rocketContainer.zIndex = 100;
    this.rockets.forEach((rocket) => {
      this.rocketContainer.addChild(rocket.sprite);
    });
    this.rootStage.addChild(this.rocketContainer);
  }

  // Create and display rockets
  this.initRockets();
  this.display();

  this.evaluate = function(target) {
    let maxFitness = 0;
    this.rockets.forEach((rocket) => {
      rocket.calcFitness(target);
      if (rocket.fitness > maxFitness) {
        maxFitness = rocket.fitness;
      }
    });

    // Normalize
    this.rockets.forEach((rocket) => {
      rocket.fitness /= maxFitness;
    });

    // Create mating pool
    this.matingPool = [];
    this.rockets.forEach((rocket) => {
      let geneCopies = rocket.fitness * 100;
      for (let i = 0; i < geneCopies; i++) {
        this.matingPool.push(rocket);
      }
    });
  }

  this.selection = function() {
    let newRockets = [];
    for (let i = 0; i < this.rockets.length; i++) {
      let parentA = helper.randomElement(this.matingPool).dna;
      let parentB = helper.randomElement(this.matingPool).dna;
      let child = parentA.crossover(parentB);
      child.mutation();
      newRockets.push(new Rocket(this.rocketTexture, this.windowWidth, this.windowHeight, lifespan, this.vectorMag, child));
    }
    this.rockets = newRockets;
  }

}