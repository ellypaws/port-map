import React, {useEffect, useState} from 'react';
import './App.css';
import './buttons.css';
import './glow.js';
import './glow.css';
import {GetTcpConnections, TerminateProcess} from "../wailsjs/go/main/App";

// import './buttons.scss';

function App() {
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const getTcpConnections = async () => {
        setLoading(true);
        try {
            const result = await GetTcpConnections();
            setConnections(JSON.parse(result));
            setLoading(false);
            setShowSuccess(true);
        } catch (err) {
            console.error("Error fetching TCP connections:", err);
        }
        setTimeout(() => {
            setLoading(false);
            setShowSuccess(false);
        }, 2000);
    }

    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => {
                setShowSuccess('fade');
            }, 2000); // Starts fading out after 2 seconds
            return () => clearTimeout(timer); // Cleans up the timer when the component unmounts
        }
    }, [showSuccess]);

    const [loadingStates, setLoadingStates] = useState([]);

    const terminateProcess = async (index) => {
        setLoadingStates(prev => prev.map((state, idx) => idx === index ? true : state));
        try {
            await TerminateProcess(index);
            await getTcpConnections(); // refresh the list
        } catch (err) {
            console.error("Error terminating process:", err);
        }
        setLoadingStates(prev => prev.map((state, idx) => idx === index ? false : state));
    }

    return (
        <div className="App">

            <div id="blob" className="bg-clip-text"></div>
            <div className="z-10">
                {/*<div id="blur" className=""></div>*/}
            {showSuccess && (
                <div
                    className={`alert alert-success ${showSuccess === true ? 'visible' : showSuccess === 'fade' ? 'fade' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none"
                         viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Refreshed the list!</span>
                    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
                        <div className="shrink-0">
                            <svg className="h-12 w-12" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="a">
                                        <stop stop-color="#2397B3" offset="0%"></stop>
                                        <stop stop-color="#13577E" offset="100%"></stop>
                                    </linearGradient>
                                    <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="b">
                                        <stop stop-color="#73DFF2" offset="0%"></stop>
                                        <stop stop-color="#47B1EB" offset="100%"></stop>
                                    </linearGradient>
                                </defs>
                                <g fill="none" fill-rule="evenodd">
                                    <path
                                        d="M28.872 22.096c.084.622.128 1.258.128 1.904 0 7.732-6.268 14-14 14-2.176 0-4.236-.496-6.073-1.382l-6.022 2.007c-1.564.521-3.051-.966-2.53-2.53l2.007-6.022A13.944 13.944 0 0 1 1 24c0-7.331 5.635-13.346 12.81-13.95A9.967 9.967 0 0 0 13 14c0 5.523 4.477 10 10 10a9.955 9.955 0 0 0 5.872-1.904z"
                                        fill="url(#a)" transform="translate(1 1)"></path>
                                    <path
                                        d="M35.618 20.073l2.007 6.022c.521 1.564-.966 3.051-2.53 2.53l-6.022-2.007A13.944 13.944 0 0 1 23 28c-7.732 0-14-6.268-14-14S15.268 0 23 0s14 6.268 14 14c0 2.176-.496 4.236-1.382 6.073z"
                                        fill="url(#b)" transform="translate(1 1)"></path>
                                    <path
                                        d="M18 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM24 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM30 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                                        fill="#FFF"></path>
                                </g>
                            </svg>
                        </div>
                        <div>
                            <div className="text-xl font-medium text-black">ChitChat</div>
                            <p className="text-slate-500">You have a new message!</p>
                        </div>
                    </div>
                </div>
            )}


            {/*<img id={logo} className={logo} src={logo}></img>*/}
            <button
                onClick={getTcpConnections}
                className={`px-4 m-2 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 ${loading ? 'loading loading-spinner' : ''}`}
            >
                Ping
            </button>

                {connections.map((conn, index) => (
                        <div className="item" key={index}>
                            {/*<div className="left">*/}
                            {/*    <span className="interface">{`${conn.LocalAddress}:${conn.LocalPort}`}</span>*/}
                            {/*    <span className="process">{conn.Process}</span>*/}
                            {/*</div>*/}
                            {/*    <button className="glow-on-hover" onClick={() => terminateProcess(index)}>*/}
                            {/*        Terminate*/}
                            {/*    </button>*/}

                            <div className="stats shadow w-full flex">

                                <div
                                    className="stat w-3/12 overflow-clip hover:overflow-visible space-x-4 delay-150 transition-all duration-300 hover:-translate-x-5">
                                    <div className="stat-figure text-primary bg">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                    </div>
                                    <div className="stat-title justify-self-start">Address</div>
                                    <div
                                        className="stat-value text-primary justify-self-start">{conn.LocalAddress}</div>
                                    <div
                                        className="stat-desc justify-self-start">{`Running on port ${conn.LocalPort}`}</div>
                                </div>

                                <div className="stat w-6/12 overflow-clip space-x-4">
                                    <div className="stat-figure text-secondary">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                    </div>
                                    <div className="stat-title align-middle">Running process</div>
                                    <div
                                        className="stat-value text-secondary text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">{conn.Process}</div>
                                    <progress
                                        className={`progress w-55 ${loadingStates[index] ? '' : 'hidden'}`}></progress>
                                </div>

                                <div className="stat w-3/12 overflow-clip">
                                    <div className="stat-title">Terminate</div>
                                    <div className="text-secondary">
                                        <button className={`glow-on-hover align-middle content-center`}
                                                onClick={() => terminateProcess(index)}>
                                            ❌
                                        </button>
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