import React from 'react'
import OtherHeader from '../OtherHeader/OtherHeader';
import { useLocation } from 'react-router-dom';
import { requests } from './Support';

const CheckRequest = () => {

    const location = useLocation();

    let request = []

    let find = false;
    for (let i = 0; i < requests.length && !find; i++) {
        if (requests[i].id === location.state.id) {
            find = true;
            request = requests[i]
        }
    }

    return (
        <div>
            <div>
                <OtherHeader />
                <div className='blocks'>
                    <p className='name'>Обращение №{request.id}</p>
                    <div className='orderViewCard'>
                        {/* <div className='firstOrderLineEdited'>
                            <div className='orderMainNoMargin'>{'Сумма заказа'}</div>
                            <div className='orderMainNoMarginColored'>{item[0].sum + '₽'}</div>
                        </div> */}
                        <div className='contactsTitle'>{'Тема'}</div>
                        <div className='supportInfo'>{request.title}</div>
                        <div className='contactsTitle'>{'Email'}</div>
                        <div className='supportInfo'>{request.email}</div>
                        <div className='contactsTitle'>{'Дата обращения'}</div>
                        <div className='supportInfo'>{new Date(request.create_date+'Z').toLocaleDateString(undefined, {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})}</div>
                        <div className='contactsTitle'>{'Комментарий'}</div>
                        <div className='supportInfo'>{request.content}</div>
                        <div className='contactsTitle'>{'Вопрос решён?'}</div>
                        <div className='supportInfo'>{request.completed ? "Да" : "Нет"}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckRequest;