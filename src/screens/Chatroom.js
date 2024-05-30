import { getFirestore, collection, query, addDoc, orderBy, limit, serverTimestamp, onSnapshot } from 'firebase/firestore';

import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useState } from 'react';

export function ChatRoom() {
    const firestore = getFirestore();
  const messagesRef = collection(firestore, 'messages');
  const q = query(collection(firestore, 'messages'), orderBy('createdAt'), limit(25));
  const [messages] = useCollectionData(q, {idField: 'id'});

  //const [messages, setMessages] = useState()
  const [formValue, setFormValue] = useState('');
  const sendMessage = async(e) => {
    e.preventDefault();
    //const {uid, photoURL} = auth.currentUser;
    try{
        await addDoc(messagesRef, {
        text: formValue,
        createdAt: serverTimestamp(),
        uid: "0",
        photoURL: "https://th.bing.com/th/id/OIP.OYjSQ1u0g7s8w1HxeC6LcAHaHa?rs=1&pid=ImgDetMain",
        displayName: "Chăm sóc khách hàng"
      })
    }
    catch(e){
      console.error(e);
    };
    setFormValue('');
  }
  
  return (
    <div>
        <div className='Chatroom'>
            {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        </div>
        <form className='SendForm' onSubmit={sendMessage}>
            <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
            <button className='IntroButton' type='submit' disabled={!formValue}>Gửi</button>
        </form>
    </div>
  )
}
function ChatMessage(props){
  const {text, uid, photoURL, displayName} = props.message;
  const messageClass = uid === "0" ? 'sent' : 'received';
  return (
    <div className={`messageCont${messageClass}`}>
        <div className={`message ${messageClass}`}>
        <img width={32} src={photoURL} alt={`${photoURL}`}/>
        <p>{text}</p>
        </div>
    </div>
  )
}


