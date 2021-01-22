import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { List } from 'immutable';

export interface SineWaveProps {
    sineWaveControlPoints: List<number>;
    width: number;
    height: number;
    color?: string;
}

export const drawSineWave = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    controlPoints: List<number>,
    color: string,
): void => {
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = '#ffffff';

    ctx.lineWidth = 2;

    // draw the centerline
    /*
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    */

    // draw the curve
    ctx.strokeStyle = color;

    // each data point in pixels
    const step = width / controlPoints.size;

    // reduce height so line is not cut off at top and bottom edges.
    const effectiveHeight = height - ctx.lineWidth * 2;
    controlPoints.forEach((value, index) => {
        const x = step * index;
        const y = effectiveHeight + ctx.lineWidth - ((value + 1) / 2) * effectiveHeight;
        if (index === 0) {
            ctx.moveTo(x, y);
            ctx.beginPath();
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
};

export const SineWave = ({ width, height, sineWaveControlPoints, color = '#33C7FF' }: SineWaveProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

    useEffect(() => {
        if (canvasRef.current) {
            setCtx(canvasRef.current.getContext('2d') as CanvasRenderingContext2D);
        }
    }, [canvasRef.current]);

    useEffect(() => {
        if (ctx) {
            drawSineWave(ctx, width, height, sineWaveControlPoints, color);
        }
    }, [ctx, width, height, sineWaveControlPoints]);

    return (
        <canvas
            width={width}
            height={height}
            style={{
                width,
                height,
            }}
            ref={canvasRef}
        ></canvas>
    );
};
