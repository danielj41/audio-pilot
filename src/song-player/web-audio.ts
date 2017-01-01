export class Audio {
  public context: AudioContext;

  constructor() {
    this.context = new AudioContext();
  }

  playNote(start: number, stop: number, frequency: number) {
    let oscillator = this.context.createOscillator();
    let gain = this.context.createGain();

    oscillator.connect(gain);
    oscillator.frequency.value = frequency;
    oscillator.start(start);
    oscillator.stop(stop);

    gain.gain.value = 0.5;
    gain.connect(this.context.destination);

    console.log(start, stop, frequency);

    oscillator.addEventListener('onended', () => {
      oscillator.disconnect();
      console.log('disconnected');
    });
  }
}
