import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

// Home.js 의 return 의 form 을 가져 온다.
// NweetFactory ==> nweets 생성을 담당

const NweetFactory = ({ userObj }) => {
    const [nweet,setNweet] = useState("");
    const [attachment,setAttachment] = useState("");  // 읽은 file String 저장
    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl="";       // for No photo
        if(attachment != "") { // photo 가 있으면
            // collection과 유사 가상의 path 만들어 주기
            var refpath = userObj.uid+'/'+uuidv4();  // path 로 접근하여 
            const attachmentRef = storageService
                                    .ref().child(refpath);
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
    return (
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
    );
};
export default NweetFactory;
