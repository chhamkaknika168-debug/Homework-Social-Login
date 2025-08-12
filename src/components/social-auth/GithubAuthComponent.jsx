import {
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase/firebase.config";
import { tr } from "zod/v4/locales";
import { flattenError } from "zod";
import {
  useLoginMutation,
  useRegisterMutation,
} from "../../features/auth/authSlide";

export const useLoginWithGitHub = () => {
  const [signUpRequest, { error: signUpError }] = useRegisterMutation();
  const [loginRequest, { data }] = useLoginMutation();
  const [error, setError] = useState(false);
  const [pending, setIsPending] = useState(false);
  //data (user credential)
  const [user, setUser] = useState(null);
  const provider = new GithubAuthProvider();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const gitHubLogin = async () => {
    setIsPending(true);
    try {
      const res = await signInWithPopup(auth, provider);
      if (!res) {
        throw new Error("Failed to login");
      }
      const user = res.user;
      console.log("Github Info : ", user);

      try {
        await signUpRequest({
          username: "Kim" + user?.displayName.substring(0, 4),
          phoneNumber: user?.phoneNumber,
          address: {
            addressLine1: "",
            addressLine2: "",
            road: "",
            linkAddress: "",
          },
          email: user?.email,
          password: `${user?.displayName.substring(0, 4)}${
            import.meta.env.VITE_SECRET_KEY
          }`,
          confirmPassword: `${user?.displayName.substring(0, 4)}${
            import.meta.env.VITE_SECRET_KEY
          }`,
          profile: user?.photoURL,
        }).unwrap();
        if (!data) console.log("Signup Failed");
      } catch (error) {
        const checkAuth = error.status;
        if (checkAuth == 400 || checkAuth == 200) {
          await loginRequest({
            email: user?.email,
            password: `${user?.displayName.substring(0, 4)}${
              import.meta.env.VITE_SECRET_KEY
            }`,
          }).unwrap();
          if (!data) {
            console.log("Failed to login");
          }
          console.log("======>user data after login", data);
        }
      }

      setIsPending(false);
    } catch (error) {
      setError(error);
      console.log(error.message);
      setIsPending(false);
    }
  };
  const gitHubLogout = async () => {
    setIsPending(false);
    setError(null);
    try {
      await signOut(auth);
      console.log("Sign out successfully!");
      setIsPending(false);
    } catch (error) {
      setError(error);
      setIsPending(false);

      console.log(error.message);
    }
  };

  return { gitHubLogout, gitHubLogin, pending, error, user };
};
