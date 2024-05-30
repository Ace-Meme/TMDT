import { useCollectionData } from 'react-firebase-hooks/firestore';
import { query, collection, getFirestore } from 'firebase/firestore';
import { useState } from 'react';
import './style.css';


export function History(){
    const firestore = getFirestore();
    const q = query(collection(firestore, "basket_database"));
    const [data] = useCollectionData(q, {idField: "id"});
    const [searchKey, setSearchKey] = useState('');
    const onSearch = () => {
        let ss = document.getElementById('search').value;
        if(ss == undefined) setSearchKey('');
        else setSearchKey(ss);
    }
    return(
        <>
        <div className='form-control'>
        <label htmlFor='search'>Tìm kiếm mã đặt vé đã được bán ra</label>
            <input className='form-control' type='text' id='search' placeholder='Tìm kiếm...' />
            <button className='btn btn-success' onClick={onSearch}>Tìm kiếm</button>
        </div>
        {
            data ? 
            <table className='table table-striped'>
                <thead>
                <tr>
                    <th>Mã booking</th>
                    <th>Trạng thái</th>
                    <th>Vé đặt - Số lượng</th>
                    <th>Ngày đi trên vé</th>
                </tr>
                </thead>
                <tbody>
                {
                    data.map((item, index) => {
                        let d = item.date_on_ticket.toDate();
                        if(searchKey == '' || (searchKey != '' && item.booking_code.search(RegExp(searchKey, 'i')) != -1)) return(
                            <tr key={index}>
                                <td>{item.booking_code}</td>
                                <td>{item.state}</td>
                                <td>
                                {
                                    item.ticket.map((val, index) => {
                                        return(
                                            <div key={index}>
                                            <div>{val.name} - Số lượng: {val.num}</div>
                                            </div>
                                        )
                                    })
                                }
                                </td>
                                <td>{"" + d.getDate() + " - " + d.getMonth() + " - " + d.getFullYear()}</td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
            :
            <div>
                Hiện tại không có lịch sử nào.
            </div>
        }
        </>
    )
}