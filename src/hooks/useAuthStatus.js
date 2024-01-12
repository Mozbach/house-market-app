import {useEffect, useState, useRef} from 'react';
import {getAuth, onAuthStateChanged} from 'firebase/auth'; 

export const useAuthStatus = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);

    const isMounted = useRef(true);

    useEffect(() => {
        if(isMounted) {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if(user) {
                    setLoggedIn(true);
                }
                setCheckingStatus(false);
            })
        }

        return () => {
            isMounted.current = false;
        }
    }, [isMounted]);
        
  return (
    {loggedIn, checkingStatus}
  )
}


// this was taken from a stackoverflow post, like some pirate coder - bastard child
// Guess it isn't bad of brad, the lecturer to say he got things from stackoverflow - makes me realize you are not supposed to just KNOW everything

// Protected route in router dom v6
// https://stackoverflow.com/questions/65505665/protected-route-with-firebase


// Fix memory leaks
// https://stackoverflow.com/questions/59780268/cleanup-memory-leaks-on-an-unmounted-component-in-react-hooks