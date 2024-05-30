import { Routes, Route, Outlet, Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, query, doc, addDoc, setDoc} from 'firebase/firestore';
import { Ticket } from './Ticket';
import { History } from './History';
import './style.css';
import { ChatRoom } from './Chatroom';

const app = initializeApp({
    apiKey: "AIzaSyBY9xbzGkS5eojokY-_cyJpyJpQtabrD7c",
    authDomain: "superchat-92a58.firebaseapp.com",
    projectId: "superchat-92a58",
    storageBucket: "superchat-92a58.appspot.com",
    messagingSenderId: "777835468914",
    appId: "1:777835468914:web:662495657ff93bcb300aeb",
    measurementId: "G-6KL1F8BDGR"
});
const firestore = getFirestore(app);

export function Root(){
    return(
        <Routes>
            <Route path='/' element={<RootLayout />}>
                <Route index element={<Ticket />} />
                <Route path='history' element={<History />} />
                <Route path='chatroom' element={<ChatRoom />} />
            </Route>
        </Routes>
    )
}
export function RootLayout(){
    return(
        <>
        <div className='navbar'>
            <Link to='/'><button className='NavigateHome'>Quản lý vé</button></Link>
            <Link to='/history'><button className='NavigateHome'>Lịch sử mua vé</button></Link>
            <Link to='/chatroom'><button className='NavigateHome'>Phòng chat</button></Link>
        </div>
        <Outlet />
        </>
    )
}