import React from "react";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import styles from './Inbox.module.css';

const serverHost = "http://localhost:3030";

export default function Inbox() {
    const [allMessages, setAllMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [myId, setMyId] = useState();
    const [room, setRoom] = useState();

    const search = useLocation().search;
    const socketRef = useRef();
    const latestMessage = useRef();

    useEffect(() => {
        socketRef.current = io.connect(serverHost);
        const param = new URLSearchParams(search).get("room");
        if (! room) {
            setRoom(param);
            socketRef.current.emit('joinRoom', param, (message) => {
                setAllMessages(oldMsgs => [...oldMsgs, {content: message, id: null}]);
            });
        }

        //Set id for every connection 
        socketRef.current.on('getId', data => {
            setMyId(data);
        })

        //Add a new message to oldMsg
        socketRef.current.on('sendDataServer', newMsg => {
            setAllMessages(oldMsgs => [...oldMsgs, newMsg]);
            scrollToBottom()
        })
        
        return () => {
            socketRef.current.disconnect();
        }
    }, []);

    const scrollToBottom = () => {
        latestMessage.current.scrollIntoView({ behavior: "smooth" });
    }

    const renderAllMessages = allMessages.map((obj, index) => 
        <div key={index}
            className={
                `${(() => {
                    if (!obj.id) {
                        return styles.botMessage
                    } else {
                        return obj.id === myId ? styles.myMessage : styles.otherMessage
                    }
                })()
                } ${styles.chatItem}`
            }
        >
            <p key={index}
                className={
                    `${ (() => {
                        if (obj.id === null) return styles.notification
                    })() }`
                }
            >
                {obj.content}
            </p>
        </div>
    )
    
    const sendMessage = () => {
        if (message === '') {
            setMessage('');
        }
        if (message !== null && message !== '') {
            const msg = {
                content: message,
                id: myId, 
            }
            socketRef.current.emit('sendDataClient', msg, room);
            setMessage('');
        }
    }

    return (
        <div className={styles.boxChat}>
            <div className={styles.boxChatMessage}>
                {renderAllMessages}
                <div style={{ float:"left", clear: "both" }}
                    ref={latestMessage}>
                </div>
            </div>

            <div className={styles.sendBox}>
                <textarea 
                    className={styles.messageTextarea}
                    value={message}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.shiftKey === false) {
                            sendMessage()
                        }
                    }}
                    onChange={(e) => {
                        setMessage(e.target.value)
                    }}
                    placeholder="Enter message..."
                />
                <button className={styles.sendMessageBtn} onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    )
} 