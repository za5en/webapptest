import React from 'react'
import './ConfirmOrder.css'
import { useTelegram } from '../../../hooks/useTelegram';
import { useLocation } from 'react-router-dom';

const OrderConfirmed = () => {
    const {onClose} = useTelegram();
    
    const location = useLocation();

    return (
        <div>
            {/* <SecondOtherHeader /> */}
            <div className='blocks'>
                {
                    location.state.type === "online" ? (
                        <div className='confirmedText'>
                            Заказ успешно оформлен!
                            <br />
                            Сейчас придёт сообщение с оплатой, этот экран можно закрыть
                        </div>
                    ) : (
                        <div className='confirmedText'>Заказ успешно оформлен!</div>
                    )
                }
                <button className='shop-btn' onClick={onClose}>Закрыть</button>
            </div>
        </div>
    )
}

export default OrderConfirmed;