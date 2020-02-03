import { DNA } from './dna.js';
import * as helper from './helper.js';
import * as PIXI from 'pixi.js';

export function Rocket(texture, windowWidth, windowHeight, lifespan, vectorMag, smiteRocketFunc, dna) {
  this.dna = dna || new DNA(lifespan, vectorMag);
  this.vel = helper.ZERO_VECTOR;
  this.crashed = false;
  this.dayCrashed = null;
  this.finished = false;
  this.dayFinished = null;
  this.smote = false;
  this.fitness = 0;
  
  this.sprite = new PIXI.Sprite(texture);
  this.sprite.width = 10;
  this.sprite.height = 30;
  this.sprite.x = windowWidth / 2;
  this.sprite.y = windowHeight - this.sprite.height - 50;

  // Smite rockets with mouseover
  this.sprite.interactive = true;
  let that = this;
  this.sprite.mouseover = function(mouseoverEvent) {
    smiteRocketFunc(that);
  }

  this.windowWidth = windowWidth;
  this.windowHeight = windowHeight;

  this.calcFitness = function(target) {
    var d = this.distanceTo(target);
    this.fitness = (this.windowWidth + this.windowHeight) - d;
  
    if (this.finished) {
      this.fitness *= 10;
      this.fitness *= (lifespan - this.dayFinished);
    }
  
    if (this.crashed) {
      this.fitness /= 10;
      this.fitness /= (lifespan - this.dayCrashed);
    }
  }

  this.distanceTo = function(target) {
    let a = this.sprite.x - target.x;
    let b = this.sprite.y - target.y;
    return Math.sqrt(a*a + b*b);
  }
}
