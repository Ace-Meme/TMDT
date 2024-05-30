import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getFirestore, query, collection, setDoc, deleteDoc, doc } from 'firebase/firestore';
import './style.css';
import { useState } from 'react';

export function RowTicket({item, onSave, onDelete}){
    const [formApp, setFormApp] = useState(false);
    return (
        <tr>
            <td>{item.ticket_id}</td>
            <td>{item.name}</td>
            <td>{item.price}</td>
            <td>
                {
                    formApp && <form className='form-control' name={'ticket' + item.ticket_id}>
                        <input type='text' name='name' placeholder='Tên vé'/>
                        <input type='text' name='price' placeholder='Giá vé'/>
                        <button className='btn btn-primary' onClick={() => {onSave(item.ticket_id)}}>Lưu</button>
                    </form>
                }
                <button className='btn btn-secondary' onClick={() => {setFormApp(!formApp)}}>
                    {
                        formApp ? <>Đóng</> : <>Chỉnh sửa vé</>
                    }
                </button>
                <button className='btn btn-danger' onClick={() => {onDelete(item.ticket_id)}}>Xóa vé</button>
            </td>
        </tr>
    )
}

export function Ticket(){
    const firestore = getFirestore();
    const q = query(collection(firestore, 'ticket_database'));
    const [ticket] = useCollectionData(q, {idField: 'id'});
    const [loading, setLoading] = useState(false);
    const [searchKey, setSearchKey] = useState('');
    const onCreate = (event) => {
        event.preventDefault();
        setLoading(true);
        let f = document.forms['create'];
        let id = ticket.length;
        
        /////Check
        if(f['name'].value == "" || f['name'].value == undefined || f['price'].value == undefined || f['price'].value == "" || Number(f['price'].value) <= 0){
            window.alert("Bạn nhập thiếu dữ liệu");
            setLoading(false);
            return;
        }

        let o = {
            name: f['name'].value,
            num: 0,
            price: Number(f['price'].value),
            state: "Không chọn",
            ticket_id: id,
            uid: ""
        }
        setDoc(doc(firestore, 'ticket_database', `${id}`), o).then((val) => {
            setLoading(false);
        }).catch(console.error);
    }

    const onSave = (i) => {
        setLoading(true);
        let f = document.forms[`ticket${i}`];
        let o = {};
        if(f['name'].value != undefined && f['name'].value != ""){
            o.name = f['name'].value;
        }
        if(f['price'].value != undefined && f['price'].value != "" && Number(f['price'].value) > 0){
            o.price = Number(f['price'].value);
        }
        setDoc(doc(firestore, 'ticket_database', `${i}`), o, {merge: true}).then((val) => {
            setLoading(false);
        }).catch(console.error);
    }
    const onDelete = (i) => {
        setLoading(true);
        deleteDoc(doc(firestore, 'ticket_database', `${i}`)).then((val) => {
            setLoading(false);
        }).catch(console.error);
    }
    const onSearch = () => {
        let ss = document.getElementById('search').value;
        if(ss == undefined) setSearchKey('');
        else setSearchKey(ss);
    }
    if(loading){
        return(
            <div>Đang tải ...</div>
        )
    }
    return(
        <>
        
        <div className='form-control'>
        <label htmlFor='search'>Tìm kiếm vé theo tên</label>
            <input className='form-control' type='text' id='search' placeholder='Tìm kiếm...' />
            <button className='btn btn-success' onClick={onSearch}>Tìm kiếm</button>
        </div>
        

        <label htmlFor='create'>Nhập thông tin tạo vé mới</label>
        <form id='create' name='create' className='form-control' onSubmit={(event) => {onCreate(event)}}>
            <input className='form-control' type='text' name='name' placeholder='Tên vé' />
            <input className='form-control' type='number' name='price' placeholder='Giá vé' />
            <button type='submit' className='btn btn-primary'>Tạo vé mới</button>
        </form>
        
        {
            ticket ? 
            <table className='table table-striped'>
                <thead>
                <tr>
                    <th>Mã vé</th>
                    <th>Tên vé</th>
                    <th>Giá vé</th>
                    <th>Chức năng</th>
                </tr>
                </thead>
                <tbody>
                {
                    ticket.map((item, index) => {
                        if(searchKey == '' || (searchKey != '' && item.name.search(RegExp(searchKey, 'i')) != -1)) return(<RowTicket key={index} item={item} onSave={onSave} onDelete={onDelete}/>)
                    })
                }
                </tbody>
                
            </table>
            :
            <div>
                Chưa có một loại vé nào
            </div>
        
        }
        </>
    )
}