import React from 'react'
import './ConfirmOrder.css'
import { useTelegram } from '../../../hooks/useTelegram';

const OrderConfirmed = () => {
    const {onClose} = useTelegram(); 

    return (
        <div>
            {/* <SecondOtherHeader /> */}
            <div className='blocks'>
                <div className='confirmedText'>Заказ успешно оформлен!</div>
                <button className='shop-btn' onClick={onClose}>Закрыть</button>
            </div>
        </div>
    )
}

export default OrderConfirmed;