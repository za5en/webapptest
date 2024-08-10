import React from 'react'
import './ConfirmOrder.css'
import { useTelegram } from '../../../hooks/useTelegram';
import SecondOtherHeader from '../../OtherHeader/OtherHeader2';

const OrderConfirmed = () => {
    const {onClose} = useTelegram(); 

    return (
        <div>
            <SecondOtherHeader />
            <div className='blocks'>
                <div className='nullEdited'>Заказ был успешно оформлен!</div>
                <button className='shop-btn' onClick={onClose}>Закрыть</button>
            </div>
        </div>
    )
}

export default OrderConfirmed;