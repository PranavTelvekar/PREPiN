import React, { useEffect, useRef, useState } from "react"
import { Badge, IconButton, TextField } from '@mui/material';
import { Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import CallEnd from '@mui/icons-material/CallEnd'
import io from "socket.io-client";
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import Navbar from '../components/Navbar/Navbar';
import './videoMeet.css'
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import axios from "axios";
import { useParams } from "react-router";

import server from "../environment";

const server_url = `${server}`;

const client = axios.create({
    baseURL: `${server}`
})

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent() {
    const { iid } = useParams();
    
    // Refs
    const socketRef = useRef();
    const socketIdRef = useRef();
    const localVideoRef = useRef();
    const videoRef = useRef([]);
    
    // State
    const [videoAvailable, setVideoAvailable] = useState(true);
    const [audioAvailable, setAudioAvailable] = useState(true);
    const [video, setVideo] = useState([]);
    const [audio, setAudio] = useState();
    const [screen, setScreen] = useState();
    const [showModal, setModal] = useState(true);
    const [screenAvailable, setScreenAvailable] = useState();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("")
    const [code, setCode] = useState('// Start coding...');
    const [newMessages, setNewMessages] = useState(0);
    const [askForUserName, setAskForUsername] = useState(true);
    const [username, setUsername] = useState();
    const [videos, setVideos] = useState([]);
    const [isCodeRead, setIsCodeRead] = useState(false);
    const [isCodeMode, setIsCodeMode] = useState(false);
    
    // Connections
    const connections = useRef({});

    // Media permissions and setup
    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            setVideoAvailable(!!videoPermission);

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            setAudioAvailable(!!audioPermission);

            setScreenAvailable(!!navigator.mediaDevices.getDisplayMedia);

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ 
                    video: videoAvailable, 
                    audio: audioAvailable 
                });
                
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            setVideoAvailable(false);
            setAudioAvailable(false);
            console.log(error);
        }
    }

    // Media handlers
    const getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop());
        } catch (e) { console.log(e) }

        window.localStream = stream;
        localVideoRef.current.srcObject = stream;

        for (let id in connections.current) {
            if (id === socketIdRef.current) continue;

            connections.current[id].addStream(window.localStream);

            connections.current[id].createOffer().then((description) => {
                connections.current[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections.current[id].localDescription }));
                    })
                    .catch(e => console.log(e));
            });
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            localVideoRef.current.srcObject = window.localStream;

            for (let id in connections.current) {
                connections.current[id].addStream(window.localStream);

                connections.current[id].createOffer().then((description) => {
                    connections.current[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections.current[id].localDescription }));
                        })
                        .catch(e => console.log(e));
                });
            }
        });
    }

    const getDisplayMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop());
        } catch (e) { console.log(e) }

        window.localStream = stream;
        localVideoRef.current.srcObject = stream;

        for (let id in connections.current) {
            if (id === socketIdRef.current) continue;

            connections.current[id].addStream(window.localStream);

            connections.current[id].createOffer().then((description) => {
                connections.current[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections.current[id].localDescription }));
                    })
                    .catch(e => console.log(e));
            });
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false);

            try {
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            localVideoRef.current.srcObject = window.localStream;

            getUserMedia();
        });
    }

    const silence = () => {
        let ctx = new AudioContext();
        let oscillator = ctx.createOscillator();
        let dst = oscillator.connect(ctx.createMediaStreamDestination());
        oscillator.start();
        ctx.resume();
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
    }

    const black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height });
        canvas.getContext('2d').fillRect(0, 0, width, height);
        let stream = canvas.captureStream();
        return Object.assign(stream.getVideoTracks()[0], { enabled: false });
    }

    const getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .catch((e) => console.log(e));
        } else {
            try {
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            } catch (e) { }
        }
    }

    const getDisplayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDisplayMediaSuccess)
                    .catch((e) => console.log(e));
            }
        }
    }

    // Socket handlers
    const gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message);

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections.current[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections.current[fromId].createAnswer().then((description) => {
                            connections.current[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections.current[fromId].localDescription }));
                            }).catch(e => console.log(e));
                        }).catch(e => console.log(e));
                    }
                }).catch(e => console.log(e));
            }

            if (signal.ice) {
                connections.current[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e));
            }
        }
    }

    const connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false });

        socketRef.current.on('signal', gotMessageFromServer);

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href);
            socketIdRef.current = socketRef.current.id;

            socketRef.current.on('chat-message', (data, sender, socketIdSender, isCode) => {
                addMessage(data, sender, socketIdSender, isCode);
            });

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id));
            });

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {
                    connections.current[socketListId] = new RTCPeerConnection(peerConfigConnections);
                    
                    connections.current[socketListId].onicecandidate = function(event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }));
                        }
                    };

                    connections.current[socketListId].onaddstream = (event) => {
                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };

                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections.current[socketListId].addStream(window.localStream);
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
                        window.localStream = blackSilence();
                        connections.current[socketListId].addStream(window.localStream);
                    }
                });

                if (id === socketIdRef.current) {
                    for (let id2 in connections.current) {
                        if (id2 === socketIdRef.current) continue;

                        try {
                            connections.current[id2].addStream(window.localStream);
                        } catch (e) { }

                        connections.current[id2].createOffer().then((description) => {
                            connections.current[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections.current[id2].localDescription }));
                                })
                                .catch(e => console.log(e));
                        });
                    }
                }
            });
        });
    }

    // UI handlers
    const addMessage = (data, sender, socketIdSender, isCode = false) => {
        if (isCode) {
            setCode(data);
            setIsCodeRead(true);
            setIsCodeMode(true);
        } else {
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: sender, data: data }
            ]);
        }
        
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };

    const sendMessage = () => {
        if (isCodeMode) {
            socketRef.current.emit('chat-message', code, username, true);
        } else {
            socketRef.current.emit('chat-message', message, username, false);
        }
        setMessage("");
    };

    const handleVideo = () => {
        setVideo(!video);
    };

    const handleAudio = () => {
        setAudio(!audio);
    };

    const handleScreen = () => {
        setScreen(!screen);
    };

    const handleEndCall = async () => {
        try {
            let response = await client.post(`/call/${iid}`);
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        } catch (e) { }
        window.location.href = "/";
    };

    const handleEditorChange = (value) => {
        setCode(value);
    };

    const getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    };

    const connect = () => {
        setAskForUsername(false);
        getMedia();
    };

    // Effects
    useEffect(() => {
        getPermissions();
    }, []);

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
        }
    }, [video, audio]);

    useEffect(() => {
        if (screen !== undefined) {
            getDisplayMedia();
        }
    }, [screen]);

    return (
        <div className="video-meet-wrapper">
            <Navbar />
            {askForUserName ? (
                <div className="lobby">
                    <h2>Enter Into Lobby</h2>
                    <div className="trial-video-section">
                        <video id="trial-video" ref={localVideoRef} autoPlay muted></video>
                    </div>
                    <div className="connect">
                        <TextField 
                            id="outlined-basic" 
                            label="username" 
                            onChange={e => setUsername(e.target.value)} 
                            variant="outlined" 
                        />
                        <Button variant="contained" onClick={connect}>Connect</Button>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="interface">
                        <div className="meeting-videos">
                            <div className='video-display'>
                                {videos.map((video) => (
                                    <div key={video.socketId} className="video-display-stream">
                                        <video
                                            id="video1"
                                            data-socket={video.socketId}
                                            ref={ref => {
                                                if (ref && video.stream) {
                                                    ref.srcObject = video.stream;
                                                }
                                            }}
                                            autoPlay
                                        >
                                        </video>
                                    </div>
                                ))}
                            </div>
                            <video id="self-video" ref={localVideoRef} autoPlay muted></video>
                        </div>
                        
                        {showModal && (
                            <div className='code-display'>
                                <div className="code-inner" >
                                    <h1>{isCodeMode ? "Code Collaboration" : "Chat"}</h1>
                                    <div className="mode-toggle">
                                        <Button 
                                            variant={isCodeMode ? "contained" : "outlined"} 
                                            onClick={() => setIsCodeMode(true)}
                                        >
                                            Code
                                        </Button>
                                        <Button 
                                            variant={!isCodeMode ? "contained" : "outlined"} 
                                            onClick={() => setIsCodeMode(false)}
                                        >
                                            Chat
                                        </Button>
                                    </div>
                                    
                                    {isCodeMode ? (
                                        <>
                                            {isCodeRead ? (
                                                <div className="code-reader">
                                                    <CodeMirror
                                                        value={code}
                                                        height="500px"
                                                        theme={oneDark}
                                                        extensions={[javascript(), python()]}
                                                        className="w-full border rounded-xl shadow-md p-2 bg-gray-100"
                                                        readOnly={true}
                                                    />
                                                    <Button 
                                                        variant='contained' 
                                                        onClick={() => setIsCodeRead(false)}
                                                        style={{ marginTop: '10px' }}
                                                    >
                                                        Edit Code
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div>
                                                    <CodeMirror
                                                        value={code}
                                                        height="500px"
                                                        theme={oneDark}
                                                        extensions={[javascript(), python()]}
                                                        onChange={handleEditorChange}
                                                        className="w-full border rounded-xl shadow-md p-2 bg-gray-100"
                                                    />
                                                    <Button 
                                                        variant='contained' 
                                                        onClick={sendMessage}
                                                        style={{ marginTop: '10px' }}
                                                    >
                                                        Send Code
                                                    </Button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="chat-container">
                                            <div className="messages">
                                                {messages.map((msg, index) => (
                                                    <div key={index} className="message">
                                                        <strong>{msg.sender}: </strong>
                                                        <span>{msg.data}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="chat-input">
                                                <TextField 
                                                    fullWidth
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                    label="Type your message"
                                                    variant="outlined"
                                                />
                                                <Button 
                                                    variant='contained' 
                                                    onClick={sendMessage}
                                                    style={{ marginLeft: '10px' }}
                                                >
                                                    Send
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className='buttons'>
                        <IconButton onClick={handleVideo} style={{ color: "white", fontSize: "32px" }}>
                            {(video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>
                        <IconButton onClick={handleEndCall} style={{ color: "red", fontSize: "32px" }}>
                            <CallEnd />
                        </IconButton>
                        <IconButton onClick={handleAudio} style={{ color: "white", fontSize: "32px" }}>
                            {(audio === true) ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>
                        {screenAvailable && (
                            <IconButton onClick={handleScreen} style={{ color: "white" }}>
                                {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                            </IconButton>
                        )}
                        <Badge badgeContent={newMessages} color="secondary">
                            <IconButton 
                                onClick={() => {
                                    setModal(!showModal);
                                    setNewMessages(0);
                                }} 
                                style={{ color: "white", fontSize: "32px" }}
                            >
                                <ChatIcon />
                            </IconButton>
                        </Badge>
                    </div>
                </div>
            )}
        </div>
    );
}
