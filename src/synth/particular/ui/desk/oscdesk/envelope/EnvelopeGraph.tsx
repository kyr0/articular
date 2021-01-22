import React from 'react';
import { getClasses } from './EnvelopeGraph.jss';

export interface GraphPoint {
    x: number;
    y: number;
}

export interface EnvelopeGraphProps {
    data: Array<GraphPoint>;
    height: number;
    width: number;
}

export const EnvelopeGraph = ({ data, width }: EnvelopeGraphProps) => {
    const WIDTH = width;

    const classes = getClasses();
    const HEIGHT = 120;
    const MAX_X = Math.max(...data.map((d: any) => d.x));
    const MAX_Y = Math.max(...data.map((d: any) => d.y));

    const x = (val: number) => (val / MAX_X) * WIDTH;
    const y = (val: number) => HEIGHT - (val / MAX_Y) * HEIGHT;

    const d = `
        M${x(data[0].x)} ${y(data[0].y)} 
        ${data
            .slice(1)
            .map((d: any) => {
                return `L${x(d.x)} ${y(d.y)}`;
            })
            .join(' ')}
    `;

    return (
        <div
            className={classes.lineChart}
            style={{
                width: WIDTH + 'px',
                height: HEIGHT + 'px',
                backgroundColor: 'rgba(0,0,0,0.5)',
            }}
        >
            <svg className={classes.svg} width={WIDTH} height={HEIGHT}>
                <path d={d} />

                {data.map((point) => (
                    <circle
                        key={point.x + point.y + Math.random()}
                        cx={x(point.x)}
                        cy={y(point.y)}
                        r="2"
                        stroke="white"
                        strokeWidth="1"
                        fill="white"
                    />
                ))}
            </svg>
        </div>
    );
};
