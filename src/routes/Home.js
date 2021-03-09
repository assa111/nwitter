import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";


const Home = ({userObj}) =>{
    const [nweets,setNweets] = useState([]); // for get

    // const getNweets = async () => {      // 1. foreach 를 이용한 방법
    //     const dbNweets = await dbService.collection("nweets").get();
    //     dbNweets.forEach((document) => {
    //         const nweetObject = {
    //             ...document.data(),     // spread attribute 기능  data() 를 가져와 unpack
    //             id:document.id,
    //         };
    //         setNweets((prev) => [nweetObject,...prev]); //// 문법은 모두를 위한 ES6 참조
    //     } ); // enumerate data 
        
   // };
    useEffect(() => { // when mount db 에서 값을 가져오기
        //getNweets();
        // db 에 무엇인가 일어나면 --> listner -- 2. snapshot 을 이용한 방법
        dbService.collection("nweets").onSnapshot(snapshot => {
            const nweetArray = snapshot.docs.map((doc) => ({
                id:doc.id,...doc.data()}));
            setNweets(nweetArray);
        });
    },[]);
   
    return(
    <div>
        <NweetFactory userObj={userObj} />  
    <div>
        {nweets.map((nweet) => (
            <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.createId==userObj.uid} />
        )
        )}
    </div>
    </div>

    );
};
export default Home;
