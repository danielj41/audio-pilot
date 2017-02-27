import * as Synaptic from 'synaptic'
import { ActionInputVector } from '../song-builder'

export class Network {
  private network: Synaptic.Architect.Perceptron;

  constructor() {
    this.network = new Synaptic.Architect.Perceptron(7, 10, 10, 1);
  }

  activate(vector: ActionInputVector) : number {
    let input = vector.toArray();
    let output = this.network.activate(input);
    return output[0];
  }

  propagate(target: number) {
    this.network.propagate(0.3, [target]);
  }
}
