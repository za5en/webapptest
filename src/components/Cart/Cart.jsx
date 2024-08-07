import React, { useState } from 'react'
import './Cart.css'
import BurgerIcon from '../../assets/images/burger.png';
import OtherHeader from '../OtherHeader/OtherHeader';
import { useNavigate } from 'react-router-dom';
import { goodsAmount } from '../Products/Products';

const Cart = () => {
    let navigate = useNavigate();
    let goods = []
    let price = 0
    const [delivery, setDelivery] = useState()

    const [courier, setCourier] = useState()

    const {products} = require('../TestData/prod.jsx');

    const deliveryMethod = [
        {method: 'Самовывоз'},
        {method: 'Доставка'}
    ];

    let find = false;
    for (let i = 0; i < Object.keys(products).length && !find; i++) {
        if (goodsAmount.has(products[i].id)) {
            goods.push(products[i])
            price += parseFloat(products[i].price.substring(0, products[i].price.indexOf(' '))) * goodsAmount.get(products[i].id)
        }
    }

    // const onChange = (edit, id) => {
    //     console.log(goodsAmount)
    //     if (edit === '-') {
    //         if (goodsAmount.has(id)) {
    //             // changePriceHandler(edit);
    //             if (goodsAmount.get(id) == 1) {
    //                 goodsAmount.delete(id);
    //             }
    //             else {
    //                 goodsAmount.set(id, goodsAmount.get(id) - 1)
    //             }
    //         }
    //     } else {
    //         if (goodsAmount.has(id)) {
    //             // changePriceHandler(edit);
    //             goodsAmount.set(id, goodsAmount.get(id) + 1)
    //         } else {                
    //             // changePriceHandler(edit);
    //             goodsAmount.set(id, 2)
    //         }
    //     }
    //     console.log(goodsAmount)
    // }

    const [activeButton, setActiveButton] = useState(0);

    const changeType = (type) => {
        setActiveButton(type)
        if (type === 0) {
            setCourier(false);
            setDelivery(0);
        } else {
            setCourier(true);
            if (price < 999) {
                setDelivery(200);
            }
        }
    }

    function PaidDelivery() {
        if (courier && price < 999) {
            return <div className='deliveryMin'>Минимальная сумма заказа для бесплатной доставки - 999 ₽</div>
        }
    }

    function Address() {
        if (courier) {
            return  <form className='payments'>
                        <div className='fieldHeader'>Адрес доставки</div>
                        <input className='textField' type="text"></input>
                    </form>
        }
    }

    function ClearText() {
        const getElement = document.getElementsByClassName('textFieldPromo');
        getElement.value = "";
    }

    function Goods() {
        if (goods.length === 0) {
            return  <div>
                        <div className='null'>Ваша корзина пока пуста</div>
                        <button className='shop-btn' onClick={() => navigate(-1)}>К списку товаров</button>
                    </div>
        } else {
            return  <div>
                        {[...Array.from(goods)].map(item => ( 
                            <div className='goods'>
                                <img
                                    src={BurgerIcon}
                                    alt='burger'
                                    className='prodImg'
                                />
                                <div className='prodText'>
                                    <div className='prodName'>{item.title}</div>
                                    <div className='prodParam'>{item.weight} гр</div>
                                    {/* <div className='changeAmountButtons'>
                                        <button className='minus-cart-btn' onClick={() => onChange('-', item.id)}>-</button>
                                        <div className='amountCart'>{goodsAmount.get(item.id) ?? 1}</div>
                                        <button className='plus-cart-btn' onClick={() => onChange('+', item.id)}>+</button>
                                    </div>                   */}
                                    <div className='prodParam'>{goodsAmount.get(item.id)} шт.</div>
                                    <div className='prodPrice'>{(parseFloat(item.price.substring(0, item.price.indexOf(' '))) * goodsAmount.get(item.id)).toFixed(2)} ₽</div>
                                </div>
                            </div>
                        ))}
                        <div className='payments'>
                            <div className='fieldHeader'>Выберите способ доставки:</div>
                            <div className='deliveryLine'>
                                {deliveryMethod.map((method, index) =>
                                    <div className='deliveryButton'>
                                        <button className={`method${activeButton === index ? 'active' : ''}`} label={activeButton === index ? 'ACTIVE' : 'inactive'} onClick={() => changeType(index)}>
                                            {method.method}
                                        </button>
                                    </div>
                                )}
                            </div>
                            {/* <form className='radioButtons'>
                                <div onClick={() => changeType(1)}>
                                    <input className='radioField' type="radio" name="deliveryType" id="pickup" value="pickup"></input>
                                    <label className='radioText' for="pickup">Самовывоз</label><br />
                                </div>
                                <div onClick={() => changeType(0)}>
                                    <input className='radioField' type="radio" name="deliveryType" id="delivery" value="delivery"></input>
                                    <label className='radioText' for="delivery">Доставка</label><br />
                                </div>
                            </form> */}
                        </div>
                        <Address />
                        <div className='moneyBlock'>
                            <div className='cartLine'>
                                <div className='cartName'>Сумма заказа</div>
                                <div className='cartPrice'>{price.toFixed(2)} ₽</div>
                            </div>
                            <div className='cartLine'>
                                <div className='cartName'>Стоимость доставки</div>
                                <div className='cartPrice'>{delivery ?? 0} ₽</div>
                            </div>                            
                            <div className='cartLine'>
                                <div className='cartName'>Общая сумма</div>
                                <div className='cartPrice'>{(price + (delivery ?? 0)).toFixed(2)} ₽</div>
                            </div>
                            <PaidDelivery />
                        </div>
                        <form className='payments'>
                            <div className='fieldHeader'>Промокод</div>
                            <div className='promoLine'>
                                <input className='textFieldPromo' type="text"></input>
                                <button className='promo-btn' onClick={ClearText}>ОК</button>
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