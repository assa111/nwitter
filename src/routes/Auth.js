import AuthForm from "components/AuthForm";
import { authService, firebaseInstance } from "fbase";
import React, { useState } from "react";

const Auth = () => {


    const onSocialClick = async (event) => {  // google login
        //event.target.name
        const {target:{name},} = event; // 문법은 모두를 위한 ES6 참조
        let provider;
        if (name == "google") {
            provider = new firebaseInstance.auth.GoogleAuthProvider();

        }
        else if(name == "github"){

        }
        await authService.signInWithPopup(provider);
        //console.log(data);

    };
    return (
    <div>
        <AuthForm />
        <div>
            <button name="google" onClick={onSocialClick}>Continue with Google</button>
        </div>
    </div>);
};
export default Auth;
