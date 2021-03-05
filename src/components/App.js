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
        //setUserObj(user);   // user id 의 저장을 위해 
        setUserObj({    // 필요한 부분만 저장 why 너무 길어 지면 react 가 비교하지 못한다.
          displayName:user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args), // function 을 저장하기 위해
        });
      }
      else {
        setIsLoggedIn(false);
      }
      setInit(true);
      console.log(user);
      
    });
  },[]);
  const refreshUser = () => {   // 이 함수를 Router 로 넘겨 전체적으로 끌고 다닌다. refresh 을 위해
    //setUserObj(authService.currentUser); // firebase user 와 web 의 user 를 일치시켜 refresh 할 수 있도록
    const user = authService.currentUser;
    setUserObj({    // 필요한 부분만 저장 why 너무 길어 지면 react 가 비교하지 못한다.
      displayName:user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args), // function 을 저장하기 위해
    });    
  };
  return (
    <>
    {/* <AppRouter in isLoggedIn={isLoggedIn} /> */}
    {init?<AppRouter 
        refreshUser = {refreshUser}
        isLoggedIn={isLoggedIn} 
        userObj={userObj} 
        />:"Initializing..."}  
    <footer>&copy;JANG {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
