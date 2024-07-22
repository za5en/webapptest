import React from 'react'
import './OrderPage.css'
import OtherHeader from '../../OtherHeader/OtherHeader';
import { useNavigate } from 'react-router-dom';

const OrderPage = () => {
    let navigate = useNavigate();
    let goods = []

    return (
        <div>
            <OtherHeader />
            <div className='blocks'>
                <p className='name'>Заказы</p>
                <div className='orderCard'>
                    <div className='orderPositions'>
                        <div className='orderPos'>
                            <div className='posName'>{'Бургер'}</div>
                            <div className='multiple'>
                                <div className='orderAmount'>{'2 шт'}</div>
                                <div className='orderCostInside'>{'444 ₽'}</div>
                            </div>
                        </div>
                    </div>
                    <div className='firstOrderLine'>
                        <div className='orderMainNoMargin'>{'Сумма заказа'}</div>
                        <div className='orderCostInside'>{'444 ₽'}</div>
                    </div>
                    <div className='orderSub'>{'Имя'}</div>
                    <div className='orderMain'>{'UserName'}</div>
                    <div className='orderSub'>{'Адрес доставки'}</div>
                    <div className='orderMain'>{'г. Москва'}</div>
                    <div className='orderSub'>{'Дата и время заказа'}</div>
                    <div className='orderMain'>{'22.07.2024 12:05'}</div>
                </div>
                <button className='repeat-btn' onClick={() => navigate(-3)}>Повторить заказ</button>
            </div>
        </div>
    )
}

export default OrderPage;