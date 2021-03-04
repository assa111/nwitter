import { dbService } from 'fbase';
import React, { useState } from 'react';

const Nweet = ({nweetObj,isOwner}) =>{  // 소유자? yes => delete,edit
    const [editing,setEditing] = useState(false);
    const [newNweet,setNewNweet] = useState(nweetObj.text);
    const onDelectClck = async () => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        //console.log(ok);
        //console.log(nweetObj.id);
        if(ok) {
            var docptah = "nweets/" + nweetObj.id;  // path 로 접근하여 지운다
            console.log(docptah);
            await dbService.doc(docptah).delete();
            

        }
    }
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {       // nweNweet 는 사용자가 입력한 text 를 가지고 있다.
        event.preventDefault();
        console.log(nweetObj,newNweet);
        var docptah = "nweets/" + nweetObj.id;  // path 로 접근
        await dbService.doc(docptah).update(
            {text:newNweet}
        );
        setEditing(false); // editing mode 종료 ==> normal mode 로

    };
    const onChange = (event) => {
        const {target:{value},} = event;
        setNewNweet(value);
    };
    return(
    <div>
        {
        editing?
       // editing mode
        <>
        <form onSubmit={onSubmit}>  
            <input 
            type="text" placeholder="Edit your nweet" required 
            value={newNweet} 
            onChange={onChange}
            />
            <input type="submit" value="Update Nweet" />
        </form>        
        <button onClick={toggleEditing}>Cancel</button>
        </>
        :
        // Normal mode
        <>                                                       
         <h4>{nweetObj.text}</h4>                               
        {isOwner && (
            <>
            <button onClick={onDelectClck}>Delete Nweet</button>
            <button onClick={toggleEditing}>Edit Nweet</button>
            </>
        )}
        </>
        }
 
    </div>
     );
}; 

export default Nweet;