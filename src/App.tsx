import './App.css';
import React from 'react';
import { Particular } from './synth/particular/Particular';

function App() {
    return (
        <div
            className="App"
            style={{
                background: '#000',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <div style={{ width: '80vw', height: 900, margin: 'auto' }}>
                <Particular instanceId={'particular-1'} />
            </div>
        </div>
    );
}

export default App;
