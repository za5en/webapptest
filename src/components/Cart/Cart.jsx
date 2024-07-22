import React from 'react'
import './Cart.css'
import BurgerIcon from '../../assets/images/burger.png';
import OtherHeader from '../OtherHeader/OtherHeader';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    let navigate = useNavigate();
    let goods = []
    let price = 100
    let delivery = 200

    function PaidDelivery() {
        if (price < 999) {
            return <div className='deliveryMin'>Минимальная сумма заказа для бесплатной доставки - 999 ₽</div>
        }
    }

    function Goods() {
        if (goods.length !== 0) {
            return  <div>
                        <div className='null'>Ваша корзина пока пуста</div>
                        <button className='shop-btn' onClick={() => navigate(-1)}>К списку товаров</button>
                    </div>
        } else {
            return  <div>
                        <div className='goods'>
                            <img
			    	        	src={BurgerIcon}
			    	        	alt='burger'
			    	        	className='prodImg'
			    	        />
                            <div className='prodText'>
                                <div className='prodName'>{'Бургер'}</div>
                                <div className='prodParam'>{'Параметр 1'}</div>                                
                                <div className='prodParam'>{'1 шт.'}</div>
                                <div className='prodPrice'>{price} ₽</div>
                            </div>
                        </div>
                        <div className='moneyBlock'>
                            <div className='cartLine'>
                                <div className='cartName'>Сумма заказа</div>
                                <div className='cartPrice'>{price} ₽</div>
                            </div>
                            <div className='cartLine'>
                                <div className='cartName'>Стоимость доставки</div>
                                <div className='cartPrice'>{delivery} ₽</div>
                            </div>                            
                            <div className='cartLine'>
                                <div className='cartName'>Общая сумма</div>
                                <div className='cartPrice'>{price + delivery} ₽</div>
                            </div>
                            <PaidDelivery />
                        </div>
                        <form className='payments'>
                            <div className='fieldHeader'>Промокод</div>
                            <div className='promoLine'>
                                <input className='textFieldPromo' type="text"></input>
                                <button className='promo-btn'>Применить</button>
                            </div>
                        </form>
                        <button className='shop-btn' onClick={() => navigate('ConfirmOrder', { replace: false })}>Далее</button>
                    </div>
        }
    }
    
    return (
        <div>
            <OtherHeader />
            <div className='cart'>
                <p className='name'>Корзина</p>
                <Goods />
            </div>
        </div>
    )
}

export default Cart;