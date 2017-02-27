import * as Synaptic from 'synaptic'
import { ActionInputVector } from '../song-builder'

export class Network {
  private network: Synaptic.Architect.Perceptron;

  constructor() {
    this.network = new Synaptic.Architect.Perceptron(21, 5, 5, 1);
  }

  activate(input: number[]) : number {
    let output = this.network.activate(input);
    return output[0];
  }

  propagate(target: number) {
    this.network.propagate(0.3, [target]);
  }
}
