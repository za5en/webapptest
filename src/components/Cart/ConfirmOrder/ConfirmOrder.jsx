import React from 'react'
import './ConfirmOrder.css'
import OtherHeader from '../../OtherHeader/OtherHeader';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../../hooks/useTelegram';

const ConfirmOrder = () => {
    // let navigate = useNavigate();
    const {onClose} = useTelegram(); 
    
    return (
        <div>
            <OtherHeader />
            <div className='cart'>
                <p className='name'>Оформление заказа</p>
                <div>
                    <form className='payments'>
                        <div className='fieldHeader'>ФИО</div>
                        <input className='textField' type="text"></input>
                        <div className='fieldHeader'>Номер телефона</div>
                        <input className='textField' type="text"></input>
                        <div className='fieldHeader'>Ник в Telegram</div>
                        <input className='textField' type="text"></input>
                        <div className='fieldHeader'>Адрес доставки</div>
                        <input className='textField' type="text"></input>
                        <div className='fieldHeader'>Комментарий</div>
                        <input className='textFieldExt' type="text"></input>
                    </form>
                    <div className='payments'>
                        <div className='fieldHeader'>Выберите способ оплаты:</div>
                        <form className='radioButtons'>
                            <div>
                                <input className='radioField' type="radio" name="payment" id="card" value="card"></input>
                                <label className='radioText' for="card">Банковской картой</label><br />
                            </div>
                            <div>
                                <input className='radioField' type="radio" name="payment" id="remittance" value="remittance"></input>
                                <label className='radioText' for="remittance">Переводом</label><br />
                            </div>
                            <div>
                                <input className='radioField' type="radio" name="payment" id="cash" value="cash"></input>
                                <label className='radioText' for="cash">Наличными курьеру</label><br />
                            </div>
                        </form>
                        <div className='fieldHeader'>Выберите способ доставки:</div>
                        <form className='radioButtons'>
                            <div>
                                <input className='radioField' type="radio" name="deliveryType" id="delivery" value="delivery"></input>
                                <label className='radioText' for="delivery">Доставка</label><br />
                            </div>
                            <div>
                                <input className='radioField' type="radio" name="deliveryType" id="pickup" value="pickup"></input>
                                <label className='radioText' for="pickup">Самовывоз</label><br />
                            </div>
                        </form>
                    </div>
                    <button className='shop-btn' onClick={onClose}>Подтвердить оформление</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmOrder;