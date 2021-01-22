import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { List } from 'immutable';

export interface SineWaveProps {
    sines: List<List<number>>;
    width: number;
    height: number;
    showTensionLines?: boolean;
}
export const SinusSurfaceWaveSpacing = 20; // px

export const drawSineWave = (
    ctx: CanvasRenderingContext2D,
    marginLeft: number,
    marginTop: number,
    width: number,
    height: number,
    controlPoints: List<number>,
    sineWaveIndex: number,
    showTensionLines: boolean,
    sineWaveCount: number,
): [number, number] => {
    const effectiveHeight = height - ctx.lineWidth * 2;
    ctx.strokeStyle = '#000';

    if (sineWaveIndex === 1) {
        ctx.lineWidth = 3;
    }

    // draw the centerline
    /*
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    */
    let endPos: [number, number];

    // draw the curve
    ctx.strokeStyle = `rgba(51, 199, 255, ${1 / sineWaveIndex + 0.1})`;

    // each data point in pixels
    const step = width / controlPoints.size;
    const endOfLineSteck: Array<[number, number]> = [];

    // reduce height so line is not cut off at top and bottom edges.
    controlPoints.forEach((value, index) => {
        const x = step * index + marginLeft;
        const y = effectiveHeight + ctx.lineWidth - ((value + 1) / 2) * effectiveHeight + marginTop;

        //ctx.lineWidth = 2 * (y / 100);
        ctx.lineWidth = 1;
        if (index === 0) {
            ctx.moveTo(x, y);
            ctx.beginPath();
        } else {
            ctx.lineTo(x, y);
        }

        if (index === controlPoints.size - 1) {
            if (showTensionLines) {
                endOfLineSteck.push([x, y]);

                if (sineWaveIndex === 1) {
                    endPos = [x, y];
                }

                if (sineWaveCount === sineWaveIndex) {
                    endPos = [x, y];
                }
            }
            /*
            ctx.font = '12px sans-serif';
            ctx.textBaseline = 'hanging';
            ctx.fillStyle = '#fff';
            ctx.fillText('+ ' + (sineWaveIndex - 1 === 0 ? 'F' : (sineWaveIndex - 1).toFixed(0)), x - 2, y - 6);
            */
        }
    });
    ctx.stroke();

    if (showTensionLines) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.8 / sineWaveIndex})`;

        endOfLineSteck.forEach((pos: [number, number], index: number) => {
            const lineToPos: [number, number] = [pos[0], pos[1] + height];
            ctx.beginPath();
            ctx.moveTo(pos[0], pos[1]);
            ctx.lineTo(lineToPos[0], lineToPos[1]);
            ctx.stroke();
        });
    }
    return endPos!;
};

export const SineSurface = ({ width, height, sines, showTensionLines = false }: SineWaveProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

    useEffect(() => {
        if (canvasRef.current) {
            setCtx(canvasRef.current.getContext('2d') as CanvasRenderingContext2D);
        }
    }, [canvasRef.current]);

    useEffect(() => {
        if (ctx) {
            let margin = 0;
            const relativePadding = 200 / sines.size;

            ctx.clearRect(0, 0, width, height + 40);

            const endOfGraphStack: Array<[number, number]> = [];
            sines.forEach((sineWaveControlPoints, index) => {
                const endPos = drawSineWave(
                    ctx,
                    margin,
                    -margin + relativePadding * sines.size,
                    width - relativePadding * sines.size,
                    height / 8,
                    sineWaveControlPoints,
                    index + 1,
                    showTensionLines,
                    sines.size,
                );

                if (endPos) {
                    endOfGraphStack.push(endPos);
                }
                margin += relativePadding;
            });

            if (showTensionLines && endOfGraphStack.length === 2) {
                ctx.strokeStyle = `rgba(255, 255, 255, 0.2)`;
                ctx.beginPath();
                ctx.moveTo(endOfGraphStack[0][0], endOfGraphStack[0][1] + 40);
                ctx.lineTo(endOfGraphStack[1][0], endOfGraphStack[1][1] + 40);
                ctx.stroke();
            }
        }
    }, [ctx, width, height, sines]);

    return (
        <canvas
            width={width}
            height={height + SinusSurfaceWaveSpacing}
            style={{
                width,
                height: height + SinusSurfaceWaveSpacing,
            }}
            ref={canvasRef}
        ></canvas>
    );
};
