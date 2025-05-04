import { useState, useEffect } from 'react';
import { getAuth, signOut } from "firebase/auth";
import { getUserData } from '../services/apiService';

const useAuth = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                try {
                    const userData = await getUserData(); // Fetch user info from Django
                    setUser8
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            } else {
                setUser(null);
            }
        });
    }, []);

    const logout = () => {
        const auth = getAuth();
        signOut(auth).then(() => setUser(null));
    };

    return { user, logout };
};

export default useAuth;
