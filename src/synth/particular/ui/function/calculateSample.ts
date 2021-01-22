// calculate an individual value for a sine curve.
export const calculateSample = (
    frequency: number,
    amplitude: number,
    sampleNumber: number,
    sampleRate: number,
): number => {
    // how many radians per second does the oscillator go?
    const angularFrequency = frequency * 2 * Math.PI;
    // what's the "time" of this sample in our curves?
    const sampleTime = sampleNumber / sampleRate;
    // what's the angle of the oscillator at this time?
    const sampleAngle = sampleTime * angularFrequency;
    // what's the value of the sinusoid for this angle?
    return amplitude * Math.sin(sampleAngle);
};
