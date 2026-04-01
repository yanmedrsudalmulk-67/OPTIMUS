'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';

interface UserProfile {
  uid: string;
  username: string;
  role: 'unit' | 'admin';
  unitName?: string;
  createdAt: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthReady: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAuthReady: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    let unsubscribeProfile: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const docRef = doc(db, 'users', firebaseUser.uid);
          unsubscribeProfile = onSnapshot(docRef, async (docSnap) => {
            if (docSnap.exists()) {
              setProfile(docSnap.data() as UserProfile);
              setLoading(false);
              setIsAuthReady(true);
            } else {
              // Auto-create profile for bootstrap admins
              const bootstrapAdmins = ["VisiFisnawati@gmail.com", "aditresa10@gmail.com", "aditresa12@gmail.com", "timmuturs@optimus.local"];
              if (firebaseUser.email && bootstrapAdmins.includes(firebaseUser.email)) {
                const newProfile: UserProfile = {
                  uid: firebaseUser.uid,
                  username: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                  role: 'admin',
                  createdAt: new Date().toISOString()
                };
                try {
                  await setDoc(docRef, newProfile);
                  // onSnapshot will trigger again with the new data
                } catch (err) {
                  console.error("Error auto-creating admin profile:", err);
                  setProfile(null);
                  setLoading(false);
                  setIsAuthReady(true);
                }
              } else {
                setProfile(null);
                setLoading(false);
                setIsAuthReady(true);
              }
            }
          }, (error) => {
            console.error("Error fetching user profile:", error);
            setProfile(null);
            setLoading(false);
            setIsAuthReady(true);
          });
        } catch (error) {
          console.error("Error setting up profile listener:", error);
          setProfile(null);
          setLoading(false);
          setIsAuthReady(true);
        }
      } else {
        if (unsubscribeProfile) {
          unsubscribeProfile();
        }
        setProfile(null);
        setLoading(false);
        setIsAuthReady(true);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
};
