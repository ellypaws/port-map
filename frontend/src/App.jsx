import React, { useState } from 'react';
import './App.css';
// import './buttons.scss';
import './buttons.css';
import {GetTcpConnections, TerminateProcess} from "../wailsjs/go/main/App";

function App() {
    const [connections, setConnections] = useState([]);

    const getTcpConnections = async () => {
        setLoading(true);
        try {
            const result = await GetTcpConnections();
            setConnections(JSON.parse(result));
            setLoading(false);
        } catch (err) {
            console.error("Error fetching TCP connections:", err);
        }
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }

    const [loading, setLoading] = useState(false);

    const terminateProcess = async (index) => {
        setLoading(true);
        try {
            await TerminateProcess(index);
            await getTcpConnections(); // refresh the list
        } catch (err) {
            console.error("Error terminating process:", err);
        }
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }


    return (
        <div className="App">





            {/*<img id={logo} className={logo} src={logo}></img>*/}
            <button
                onClick={getTcpConnections}
                className={`bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded ${loading ? 'loading loading-spinner' : ''}`}
            >
                Ping
            </button>
            <div className="container">
                {connections.map((conn, index) => (
                        <div className="item" key={index}>
                            {/*<div className="left">*/}
                            {/*    <span className="interface">{`${conn.LocalAddress}:${conn.LocalPort}`}</span>*/}
                            {/*    <span className="process">{conn.Process}</span>*/}
                            {/*</div>*/}
                            {/*    <button className="glow-on-hover" onClick={() => terminateProcess(index)}>*/}
                            {/*        Terminate*/}
                            {/*    </button>*/}

                            <div className="stats shadow">

                                <div className="stat">
                                    <div className="stat-figure text-primary bg">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                    </div>
                                    <div className="stat-title">Address</div>
                                    <div className="stat-value text-primary">{`${conn.LocalAddress}:${conn.LocalPort}`}</div>
                                    <div className="stat-desc">{`Running on port ${conn.LocalPort}`}</div>
                                </div>

                                <div className="stat">
                                    <div className="stat-figure text-secondary">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                    </div>
                                    <div className="stat-title">Running process</div>
                                    <div className="stat-value text-secondary">{conn.Process}</div>
                                    <progress className="progress w-55 hidden"></progress>
                                </div>

                                <div className="stat">
                                    <div className="stat-title">Terminate</div>
                                    <div className="text-secondary">
                                        <button className={`glow-on-hover align-middle content-center ${loading ? 'loading loading-spinner' : ''}`} onClick={() => terminateProcess(index)}>
                                            ❌</button>
                                    </div>
                                </div>

                            </div>

                        </div>
                ))}
            </div>

        </div>
    );
}

export default App;