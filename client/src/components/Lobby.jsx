import React, { useState, useEffect } from "react";
import { challenges } from "../codeExample.js";
import Block from "./Block"
import io from 'socket.io-client';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css'; 
import 'prismjs/components/prism-javascript'; 
import Popup from "./Popup"; 

const socket = io("realtimecodeeditor-production.up.railway.app");

export default function Lobby() {

    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [codeContent, setCodeContent] = useState("");
    const [isMantor, setIsMentor] = useState(null);
    const [solved, setSolved] = useState(false);

    useEffect(()=>{
        socket.on("isMentor", (val) => {
            setIsMentor(val);
        });
        socket.on("solved", (val) => {
            setSolved(val);
        });
        socket.on("mentorLeave", () => {
            setSelectedChallenge(null);
            setCodeContent("");
            setIsMentor(null);
        })
        socket.on("presentCodeToMentor", (code) => {
            setCodeContent(code);
        });
    });

    useEffect(() => {
        if (solved) {
            const popupTimeout = setTimeout(() => {
                setSolved(false);
            }, 9000); 
            return () => clearTimeout(popupTimeout);
        }
    }, [solved]);
    
    useEffect(() => {
        Prism.highlightAll();
    }, [codeContent, isMantor]);

    function handleClick(index) {
        if (selectedChallenge && isMantor)
            socket.emit("mentorLeaveRoom", selectedChallenge);
        if (selectedChallenge && !isMantor)
            socket.emit("studentLeaveRoom", selectedChallenge);
        setCodeContent(challenges[index - 1].code);
        setSelectedChallenge(index);
        socket.emit("joinCodeBlock", index);
    }

    function handleCodeChange(event) {
        const newCodeContent = event.target.value;
        setCodeContent(newCodeContent); 
        socket.emit("changeCode", newCodeContent, selectedChallenge);
    }

    return (

        <div className="lobby-container">
            <div className="card-container">
                {challenges.map((challenge) => (
                    <button
                        key={challenge.id}
                        className={"card" + (selectedChallenge === challenge.id ? " selected" : "")}
                        onClick={() => handleClick(challenge.id)}
                    >
                        <h3>{challenge.title}</h3>
                    </button>
                ))}
            </div>
            <div className="code-block-container">
                {selectedChallenge && (
                <div>
                    <Block changeCode={handleCodeChange} codeContent={codeContent} isMentor={isMantor}/>
                </div>
                )}
            </div>
            {solved && <Popup onClose={() => setSolved(false)} />}
        </div>
    );
}
