import * as helper from './helper.js';

export function DNA(lifespan, vectorMag, genes) {
  this.lifespan = lifespan;
  this.vectorMag = vectorMag;
  if (genes) {
    this.genes = genes;
  } else {
    this.genes = [];
    for (let i = 0; i < lifespan; i++) {
      this.genes.push(helper.Random2DVector(this.vectorMag));
    }
  }

  // TODO: better crossover algorithm: https://en.wikipedia.org/wiki/Crossover_(genetic_algorithm)
  this.crossover = function(partner) {
    let newGenes = [];
    // Pick random split point
    let split = Math.floor(Math.random(this.genes.length));
    for (let i = 0; i < this.genes.length; i++) {
      if (i < split) {
        newGenes.push(this.genes[i]);
      } else {
        newGenes.push(partner.genes[i]);
      }
    }
    return new DNA(this.lifespan, this.vectorMag, newGenes);
  }

  this.mutation = function() {
    for (let i = 0; i < this.genes.length; i++) {
      if (Math.random() < 0.01) {
        this.genes[i] = helper.Random2DVector(this.vectorMag);
      }
    }
  }
}
