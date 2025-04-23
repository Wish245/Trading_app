import { useEffect, useState, useRef } from "react";

export default function useUsernameAvailability() {
    const [available, setAvailable] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const socket = useState(null);

    useEffect(() => {
        socket.current = new WebSocket('ws://localhost:8000/ws/username-check');

        socket.current.onopen = () => setIsConnected(true);
        socket.current.onclose = () => setIsConnected(false);
        socket.current.onerror = (error) => console.error('WebSocket error:', error);

        socket.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setAvailable(data.available);
        };
        
        return () => socket.current.close();

    }, []);

    const checkUsername = (username) => {
        if (socket.current && isConnected) {
            socket.current.send(JSON.stringify({username}));
        }
    };

    return {available, checkUsername, isConnected };
    
}