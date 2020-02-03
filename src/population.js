import { Rocket } from './rocket.js';
import * as PIXI from 'pixi.js';
import * as helper from './helper.js';

export function Population(size, rootStage, rocketTexture, windowWidth, windowHeight, lifespan, vectorMag) {
  this.populationSize = size || 10;
  this.functionalPopSize = this.populationSize;
  this.rockets = [];
  this.matingPool = [];

  this.rootStage = rootStage;
  this.rocketTexture = rocketTexture;
  this.windowWidth = windowWidth;
  this.windowHeight = windowHeight;
  this.rocketContainer = null;

  this.vectorMag = vectorMag;

  let that = this;
  this.smiteRocket = function(rocket) {
    if (that.functionalPopSize > 1) {
      rocket.smote = true;
      that.rocketContainer.removeChild(rocket.sprite);
      that.functionalPopSize--;
    }
  }

  this.initRockets = function() {
    this.rockets = [];
    for (let i = 0; i < this.populationSize; i++) {
      let newRocket = new Rocket(this.rocketTexture, this.windowWidth, this.windowHeight, lifespan, this.vectorMag, this.smiteRocket);
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
      if (rocket.smote) {
        geneCopies = 0;
      }
      for (let i = 0; i < geneCopies; i++) {
        this.matingPool.push(rocket);
      }
    });
  }

  this.selection = function() {
    let newRockets = [];
    for (let i = 0; i < this.populationSize; i++) {
      let parentA = helper.randomElement(this.matingPool).dna;
      let parentB = helper.randomElement(this.matingPool).dna;
      let child = parentA.crossover(parentB);
      child.mutation();
      newRockets.push(new Rocket(this.rocketTexture, this.windowWidth, this.windowHeight, lifespan, this.vectorMag, this.smiteRocket, child));
    }
    this.rockets = newRockets;
    this.functionalPopSize = this.rockets.length;
  }

}