import Nweet from "components/Nweet";
import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const Home = ({userObj}) =>{
    const [nweet,setNweet] = useState("");
    const [nweets,setNweets] = useState([]); // for get
    const [attachment,setAttachment] = useState("");  // 읽은 file String 저장

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
        let attachmentUrl="";       // for No photo
        if(attachment != "") { // photo 가 있으면
            // collection과 유사 가상의 path 만들어 주기
            var refpath = userObj.uid+'/'+uuidv4();  // path 로 접근하여 
            const attachmentRef = storageService.ref().child(refpath);
            const response = await attachmentRef.putString(attachment,"data_url"); // upload
            attachmentUrl = await response.ref.getDownloadURL();  // URL 얻기
        }
        const nweetObj = {
             text: nweet,
             createdAt: Date.now(),
             createId: userObj.uid,          // 누가 문서를 만들었는지..
             attachmentUrl
        };
        await dbService.collection("nweets").add(nweetObj);
        setNweet("");           // 지워주기
        setAttachment("");      // 지워주기

        //console.log(fileRef);
        // await dbService.collection("nweets").add({      // db 에 추가 
        //     text: nweet,
        //     createdAt: Date.now(),
        //     createId: userObj.uid,          // 누가 문서를 만들었는지..
        // });
        // setNweet("");

    };
    const onChange = (event) => {
        const { target: { value } } = event; // event 중에서 target 안에서 value 를 선택하여 value 변수 사용
        setNweet(value);

    };
    //console.log(nweets);
    const onFileChange = (event) => {
        //console.log(event.target.files);    // FileList
        const {
            target:{files},
        } = event ;  // es6
        const theFile = files[0];   // get the file
        const reader = new FileReader(); 
        reader.onloadend = (finishedEvent) => { // event listener 추가.. 파일 로딩이 끝날때 실행됨
            //console.log(finishedEvent); // 아래의 read 한 결과 확인 가능
            const {
                currentTarget: {result},
            } = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile); //read the file

    };
    const onClearAttachment = () => setAttachment(null);
    return(
    <div>
    <form onSubmit={onSubmit}>
        <input value={nweet} onChange={onChange} 
        type="text" placeholder="What's on your mind?" maxLength={120} />
        <input type="file" accept="image/*" onChange={onFileChange}/>
        <input type="submit" value="Nweet" />
        {attachment && (
            <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
            </div>
            )}
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
