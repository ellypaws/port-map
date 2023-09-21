import React, { useState } from 'react';
import './App.css';
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
            <button onClick={getTcpConnections}>Get TCP Connections</button>
            <ul>
                {connections.map((conn, index) => (
                    <li key={index}>
                        <span>{`Local Address: ${conn.LocalAddress}, Local Port: ${conn.LocalPort}, Process: ${conn.Process}`}</span>
                        <button onClick={() => terminateProcess(index)}>Terminate</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;