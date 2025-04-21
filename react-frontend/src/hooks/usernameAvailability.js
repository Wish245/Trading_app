import { useEffect, useState, useRef } from "react";

export default function useUsernameAvailability() {
    const [available, setAvailable] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const socket = useState(null);

    useEffect(() => {
        socket.current = new WebSocket('ws://localhost:8000/ws/username-check');

        socket.current.onopen = () => setIsConnected(true);
        socket.current.onerror = {console.error(false);
        }
    })
}