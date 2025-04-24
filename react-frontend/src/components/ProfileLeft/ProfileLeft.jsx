import React, {useEffect,useState} from 'react';
import {assets} from '../../assets/assets'
import { getUserProfile, updateUsername } from '../../api/profile';
import useUsernameAvailability from '../../hooks/usernameAvailability';


export default function profileLeft() {
    const [editing, setEditing] = useState(false);
    const [profile, setProfile] = useState({username: '', national_id: ''});
    const [tempUsername, setTempUsername] = useState('');
    const {available, checkUsername} = useUsernameAvailability();

    useEffect(()=> {
        (async() => {
            try{
                const data = await getUserProfile();
                setProfile(data);
                setTempUsername(data.username);
            } catch (err) {
                console.error(err);
            }
        })();
    },[]);
}