import { authService, firebaseInstance } from "fbase";
import React, { useState } from "react";

const Auth = () => {
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [newAccount,setNewAccount]=useState(true);
    const [error,setError]=useState("");
    const onChange = (event) => {
            
        const {
            target:{name,value},
        }=event;    // event 중에서 target name value 를 사용한다
        if(name=='email') {
            setEmail(value);
        }
        else if(name=='password') {
            setPassword(value);
        }
    }
    const onSubmit = async(event) => {
        event.preventDefault();
        try{
            let data;
            if(newAccount) {
                // create New Account
                data= await authService.createUserWithEmailAndPassword(email,password)
            } else {
                // Log In
                data= await authService.signInWithEmailAndPassword(email,password)
            }
            console.log(data);
        } catch(error){
                //console.log(error.message);
                setError(error.message);
        }
 
    }
    const toggleAccount = () =>setNewAccount((prev)=>!prev);

    const onSocialClick = async (event) => {  // google login
        //event.target.name
        const {target:{name},} = event; // 문법은 모두를 위한 ES6 참조
        let provider;
        if (name == "google") {
            provider = new firebaseInstance.auth.GoogleAuthProvider();

        }
        else if(name == "github"){

        }
        const data = await authService.signInWithPopup(provider);
        console.log(data);

    };
    return (
    <div>
        <form onSubmit={onSubmit}>
            <input name="email" 
            type="text" placeholder="Email" required 
            value={email}
            onChange={onChange} />
            <input name="password" 
            type="password" placeholder="Password" required 
            value={password}
            onChange={onChange} />
            <input type="submit" value={newAccount?"Create Account":"Sign In"} />
            <p>{error}</p>
        </form>
        <span onClick={toggleAccount}>
            {newAccount?"Sign In":"Create Account"}</span>
        <div>
            <button name="google" onClick={onSocialClick}>Continue with Google</button>
        </div>
    </div>);
};
export default Auth;
