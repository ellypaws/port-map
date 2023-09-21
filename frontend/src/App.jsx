import React, { useState } from 'react';
import './App.css';
// import './buttons.scss';
import './buttons.css';
import logo from "./assets/images/logo-universal.png";
// import './buttons.js';
import {GetTcpConnections, TerminateProcess} from "../wailsjs/go/main/App";

function App() {
    const [connections, setConnections] = useState([]);

    const getTcpConnections = async () => {
        try {
            const result = await GetTcpConnections();
            setConnections(JSON.parse(result));
        } catch (err) {
            console.error("Error fetching TCP connections:", err);
        }
    }

    const terminateProcess = async (index) => {
        try {
            await TerminateProcess(index);
            await getTcpConnections(); // refresh the list
        } catch (err) {
            console.error("Error terminating process:", err);
        }
    }


    return (
        <div className="App">
            {/*<img id={logo} className={logo} src={logo}></img>*/}
            <button
                onClick={getTcpConnections}
                className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
            >
                Ping
            </button>
            <div className="container">
                {connections.map((conn, index) => (
                        <div className="item" key={index}>
                            <div className="left">
                                <span className="interface">{`${conn.LocalAddress}:${conn.LocalPort}`}</span>
                                <span className="process">{conn.Process}</span>
                            </div>
                                <button className="glow-on-hover" onClick={() => terminateProcess(index)}>
                                    Terminate
                                </button>
                        </div>
                ))}
            </div>

        </div>
    );
}

export default App;