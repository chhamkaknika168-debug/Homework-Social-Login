import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase/firebase.config";
import { tr } from "zod/v4/locales";
import { check, email, flattenError } from "zod";
import {
  useLoginMutation,
  useRegisterMutation,
} from "../../features/auth/authSlide";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router";
import {
  getDecryptAccessToken,
  storeAccessToken,
} from "../../utils/tokenUtils";

export const useLoginWithGoogle = () => {
  //calling signup slice
  const [signUpRequest, { error: signUpError }] = useRegisterMutation();
  const [loginRequest, { data }] = useLoginMutation();
  const [error, setError] = useState(false);
  const [pending, setIsPending] = useState(false);
  //data (user credential)
  const [user, setUser] = useState(null);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
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

  const googleLogin = async () => {
    setIsPending(true);

    try {
      const res = await signInWithPopup(auth, provider);
      if (!res) {
        throw new Error("Failed to login");
      }
      const user = res?.user;
      console.log("Google Info : ", user);

      //implement with api
      try {
        await signUpRequest({
          username: user?.displayName.substring(0, 4),
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
        console.log(data);
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

          //implement to store access token in
          if (data.accessToken) {
            /*
            const ENCRYPT_KEY =
              import.meta.env.VITE_ENCRYPTED_KEY || "teco_accessToken";
            secureLocalStorage.setItem(ENCRYPT_KEY, data?.accessToken);*/
            storeAccessToken(data?.accessToken);
            console.log("=====> After Decrypted : ", getDecryptAccessToken());
            navigate("/products");
          }
          if (!data.accessToken) {
            navigate("/login");
          }
        }
      }

      setIsPending(false);
    } catch (error) {
      setError(error);
      console.log(error);
      setIsPending(false);
    }
  };
  const googleLogout = async () => {
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

  return { googleLogout, googleLogin, pending, error, user };
};
