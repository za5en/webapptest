import React, { useState } from 'react'
import './Cart.css'
import OtherHeader from '../OtherHeader/OtherHeader';
import { useNavigate } from 'react-router-dom';
import { goodsAmount } from '../Products/Products';
import { deliveryAddress } from './ConfirmOrder/ConfirmOrder.jsx';
import { deliveryType } from './ConfirmOrder/ConfirmOrder.jsx';
import { promo } from './ConfirmOrder/ConfirmOrder.jsx';
import axios from 'axios';
import { userInfo } from '../TestData/user.jsx';
import { contacts } from '../Profile/Profile.jsx';
import ReactLoading from "react-loading";

export var cartId = []

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
            price += products[i].price * goodsAmount.get(products[i].id)
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

    const [appState, setAppState] = useState();
    const [isLoading, setIsLoading] = useState(false);

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

    const confirm = async () => {
        promo.length = 0
        promo.push(document.getElementById('promo').value)
        deliveryType.length = 0
        deliveryType.push(deliveryMethod[activeButton].method)
        deliveryAddress.length = 0
        if (activeButton === 1) {
            deliveryAddress.push(document.getElementById('deliveryAddress').value)
        }

        setIsLoading(true);
        await createCart()
        setIsLoading(false);
        navigate('ConfirmOrder', { replace: false })
    }

    async function createCart() {
        var response  = await axios.post(`https://market-bot.org:8082/clients_api/clients_menu/create_cart?client_id=${userInfo[0].id}`)
        cartId.length = 0
        cartId.push(response.data.data)
        setAppState(response);

        await addToCart();
    }

    async function addToCart() {
        var response = ''
        for (let i = 0; i < goods.length; i++) {
            response = await axios.post('https://market-bot.org:8082/clients_api/clients_menu/add_to_cart', {
                cart_id: cartId[0],
                product_id: goods[i].id,
                count: goodsAmount.get(goods[i].id),
                price: goods[i].price * goodsAmount.get(goods[i].id),
                option: []
              }, {
                headers: {
                    'Content-Type': 'application/json'
                }
              })
        }
        // message = response.data.message
        // if (message === 'Product added to cart')
        setAppState(response);
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
                        <textarea className='textFieldAddress' type="text" id='deliveryAddress'></textarea>
                    </form>
        } else {
            return <div className='payments'>
                <div className='fieldHeader'>Адрес самовывоза</div>
                <textarea className='textFieldAddress' type="text" id='pickupAddress' readOnly>{contacts[0].shop_address}</textarea>
            </div>
        }
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
			    		            src={item.photoFile}
                                    alt={item.name}
                                    className='prodImg'
                                />
                                <div className='prodText'>
                                    <div className='prodName'>{item.name}</div>
                                    <div className='prodParam'>{item.weight} гр</div>
                                    {/* <div className='changeAmountButtons'>
                                        <button className='minus-cart-btn' onClick={() => onChange('-', item.id)}>-</button>
                                        <div className='amountCart'>{goodsAmount.get(item.id) ?? 1}</div>
                                        <button className='plus-cart-btn' onClick={() => onChange('+', item.id)}>+</button>
                                    </div>                   */}
                                    <div className='prodParam'>{goodsAmount.get(item.id)} шт.</div>
                                    <div className='prodPrice'>{(item.price * goodsAmount.get(item.id)).toFixed(2)} ₽</div>
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
                                <input className='textFieldPromo' type="text" id='promo'></input>
                                {/* <button className='promo-btn' onClick={ClearText}>ОК</button> */}
                            </div>
                        </form>
                        <button className='shop-btn' onClick={() => confirm()}>Далее</button>
                    </div>
        }
    }
    
    return (
        <div>
            {isLoading ? (
                <div className='loadScreen'>
                    <ReactLoading type="bubbles" color="#419FD9"
                        height={100} width={50} />
                </div>
            ) : (
                <div>
                    <OtherHeader />
                    <div className='cart'>
                        <p className='name'>Корзина</p>
                        <Goods />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Cart;