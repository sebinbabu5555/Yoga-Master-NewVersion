import React, { createContext, useEffect, useState } from 'react'
import { app } from '../../config/firebase.init';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    signInWithPopup,
    onAuthStateChanged,
    updateProfile,
    updatePassword,
    deleteUser,
    reauthenticateWithCredential,
    EmailAuthProvider
} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';


export const AuthContext = createContext()

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loader, setLoader] = useState(true);
    const [error, setError] = useState('');

    const auth = getAuth(app);

    // signup user
    const signUp = async (email, password) =>{
        try {
            setLoader(true);
            return await createUserWithEmailAndPassword(auth, email, password)
        } catch (error) {
            setError(error.code);
            throw error;
        }
    }

    // login user
    const login = async (email, password) =>{
        try {
            setLoader(true);
            return await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            setError(error.code);
            console.log(error);
            throw error;
        }
    }

    // logout user
    const logout = async () => {
        try {
            return await signOut(auth)
        } catch (error) {
            setError(error.code);
            throw error;
        }
    }

    // update user
    const updateUser = async (name, photo) => {
        try {
            await updateProfile(auth.currentUser, {
                displayName: name, photoURL: photo
            })
            setUser(auth.currentUser)
        } catch (error) {
            setError(error.code);
            throw error;
        }
    }

    // change password
    const changePassword = async (currentPassword, newPassword) => {
        if (!auth.currentUser) throw new Error("No authenticated user");
        const isPasswordProvider = auth.currentUser.providerData?.some(p => p.providerId === 'password');
        if (isPasswordProvider && currentPassword) {
            const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
            await reauthenticateWithCredential(auth.currentUser, credential);
        }
        await updatePassword(auth.currentUser, newPassword);
    }

    // delete account
    const deleteAccount = async (currentPassword) => {
        if (!auth.currentUser) throw new Error("No authenticated user");
        const isPasswordProvider = auth.currentUser.providerData?.some(p => p.providerId === 'password');
        if (isPasswordProvider && currentPassword) {
            const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
            await reauthenticateWithCredential(auth.currentUser, credential);
        }
        await deleteUser(auth.currentUser);
        localStorage.removeItem('token');
        setUser(null);
    }

    //using google login
    const googleProvider = new GoogleAuthProvider();
    const googleLogin = async () => {
        try {
            setLoader(true);
            return await signInWithPopup(auth, googleProvider)
        } catch (error) {
            setError(error.code);
            throw error;
        }
    }

    // observer for user
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user)

            if(user){
                axios.post(`${API_BASE_URL}/api/set-token`, {email: user.email, name: user.displayName})
                .then((data) => {
                    if(data.data?.token){
                        localStorage.setItem('token', data.data.token);
                    }
                    setLoader(false);
                })
                .catch((err) => {
                    console.error('Token error in AuthProvider:', err);
                    setLoader(false);
                })
            } else{
                localStorage.removeItem('token')
                setLoader(false)
            }
        })
        return () => unsubscribe()
    }, [])

    const contextVale = {
        user,
        signUp,
        login,
        logout,
        updateUser,
        googleLogin,
        changePassword,
        deleteAccount,
        error,
        setError,
        loader,
        setLoader
    }
  return (
    <AuthContext.Provider value={contextVale}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider