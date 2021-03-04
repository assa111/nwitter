// import logo from './logo.svg';
// import './App.css';
import React, { useEffect, useState } from 'react';
//import AppRouter from './Router';
import AppRouter from 'components/Router';
import {authService} from "fbase"

function App() {
  const [init,setInit] = useState(false);
  const [isLoggedIn,setIsLoggedIn]=useState(false); // 초기에는 firebase 실행X --> loginX
  const [userObj, setUserObj] = useState(null); // 누가 사용하는지 id 를 db 에 저장하기 위해 
  
  useEffect(()=>{ // 처음 시작할 때, component 가 mount 될때 실행
    authService.onAuthStateChanged((user)=>{
      if(user) { // currentUser 가 있으면 
        setIsLoggedIn(true);
        setUserObj(user);   // user id 의 저장을 위해 
      }
      else {
        setIsLoggedIn(false);
      }
      setInit(true);
      console.log(user);
      
    });
  },[]);
  return (
    <>
    {/* <AppRouter in isLoggedIn={isLoggedIn} /> */}
    {init?<AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />:"Initializing..."}  
    <footer>&copy;JANG {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
