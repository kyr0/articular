import { WaveForm } from '../interface/Waveform';

export const PERIODIC_WAVE_SIZE = 24;

export const generatePeriodicWaveCoefficients = (waveForm: WaveForm, periodicWaveSize: number = PERIODIC_WAVE_SIZE) => {
    const partials: Array<number> = [];
    for (let i = 1; i < periodicWaveSize; ++i) {
        const piFactor = 2 / (i * Math.PI);

        switch (waveForm) {
            case WaveForm.SINE:
                // Standard sine wave function.
                partials.push(i == 1 ? 1 : 0);
                break;
            case WaveForm.PULSE:
            case WaveForm.PWM:
            case WaveForm.SQUARE:
                partials.push(
                    // Square-shaped waveform with the first half its maximum value and the second half its
                    // minimum value.
                    //
                    // See http://mathworld.wolfram.com/FourierSeriesSquareWave.html
                    //
                    // b[n] = 2/n/pi*(1-(-1)^n)
                    //      = 4/n/pi for n odd and 0 otherwise.
                    //      = 2*(2/(n*pi)) for n odd
                    i & 1 ? 2 * piFactor : 0,
                );
                break;
            case WaveForm.SAWTOOTH:
                partials.push(
                    // Sawtooth-shaped waveform with the first half ramping from zero to maximum and the
                    // second half from minimum to zero.
                    //
                    // b[n] = -2*(-1)^n/pi/n
                    //      = (2/(n*pi))*(-1)^(n+1)
                    piFactor * (i & 1 ? 1 : -1),
                );
                break;
            case WaveForm.TRIANGLE:
                // Triangle-shaped waveform going from 0 at time 0 to 1 at time pi/2 and back to 0 at
                // time pi.
                //
                // See http://mathworld.wolfram.com/FourierSeriesTriangleWave.html
                //
                // b[n] = 8*sin(pi*k/2)/(pi*k)^2
                //      = 8/pi^2/n^2*(-1)^((n-1)/2) for n odd and 0 otherwise
                //      = 2*(2/(n*pi))^2 * (-1)^((n-1)/2)
                let b = 0;
                if (i & 1) {
                    b = 2 * (piFactor * piFactor) * (((i - 1) >> 1) & 1 ? -1 : 1);
                }
                partials.push(b);
                break;
        }
    }
    return partials;
};
