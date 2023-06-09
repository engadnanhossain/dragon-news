import React, { createContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import app from '../firebase/firebase.config';


export const AuthContext = createContext()

const auth = getAuth(app)

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const googleSignIn = (provider) => {
        setLoading(true);
        return signInWithPopup(auth, provider);
    }

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    }

    const emailVerify = () => {
        return sendEmailVerification(auth.currentUser);
    }

    const updateUserProfile = (name, photourl) => {
        setLoading(true);
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photourl
        })
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            if (currentUser === null || currentUser.emailVerified) {
                setUser(currentUser);
            }
            setLoading(false);
        })
        return () => {
            unsubscribe();
        }
    }, [])

    const authInfo = {
        user,
        loading,
        setLoading,
        googleSignIn,
        createUser, signIn,
        logOut,
        updateUserProfile,
        emailVerify
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;