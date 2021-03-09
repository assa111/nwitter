import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";


export default ({refreshUser,userObj}) => {
    // hook 사용하여 "/" url 변경
    const history = useHistory();
    const [newDisplayName,setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");  
    };
    const getMyNweets = async() => { // ID 가 나 => nweet 가져오기
        const nweets = await dbService.collection("nweets")     // firestore query 방법 예제
        .where("createId","==", userObj.uid)
        .orderBy("createdAt","desc")       // No sql 이므로 error ==> error 의 link 를 따라가 index 생성 요망
        .get();
        console.log(nweets.docs.map((doc)=>doc.data()));
    };
    useEffect(() => {
        getMyNweets();
    },[]
    );
    const onChange = (event) => {
        const {
            target:{value},
        }=event;
        setNewDisplayName(value);
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        if(userObj.displayName != newDisplayName) {     // firebase. User profile update
            await userObj.updateProfile({displayName:newDisplayName,});
            refreshUser(); // App 에 있는 함수 firebase 의 user 로 web 의 user 를 update ==> refresh 위해 
        }
    };
    return (
        <>
        <form onSubmit={onSubmit}>
        <input 
            onChange={onChange}
            value={newDisplayName}
            type="text" placeholder="" />
        <input type="submit" value = "Update Profile" />
        </form>
        <button onClick ={onLogOutClick}>Log Out</button>
        </>
    );
};