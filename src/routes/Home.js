import Nweet from "components/Nweet";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
const Home = ({userObj}) =>{
    const [nweet,setNweet] = useState("");
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
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("nweets").add({      // db 에 추가 
            text: nweet,
            createdAt: Date.now(),
            createId: userObj.uid,          // 누가 문서를 만들었는지..
        });
        setNweet("");

    };
    const onChange = (event) => {
        const { target: { value } } = event; // event 중에서 target 안에서 value 를 선택하여 value 변수 사용
        setNweet(value);

    };
    //console.log(nweets);
    return(
    <div>
    <form onSubmit={onSubmit}>
        <input value={nweet} onChange={onChange} 
        type="text" placeholder="What's on your mind?" maxLength={120} />
        <input type="file" accept="image/*" />
        <input type="submit" value="Nweet" />
    </form>
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
