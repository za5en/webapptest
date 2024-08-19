import React, { useState } from 'react'
import './Cart.css'
import OtherHeader from '../OtherHeader/OtherHeader';
import { useNavigate } from 'react-router-dom';
import { goodsAmount } from '../Products/Products';
import axios from 'axios';
import { userInfo } from '../TestData/user.jsx';
import { contacts } from '../Profile/Profile.jsx';
import ReactLoading from "react-loading";

const Cart = () => {
    let navigate = useNavigate();
    let goods = []
    let price = 0
    const [delivery, setDelivery] = useState()

    const [courier, setCourier] = useState()

    const [isValidAddress, setIsValidAddress] = useState(true);

    const {products} = require('../TestData/prod.jsx');

    const deliveryMethod = [
        {method: 'Самовывоз'},
        {method: 'Доставка'}
    ];

    let find = false;
    for (let i = 0; i < Object.keys(products).length && !find; i++) {
        if (typeof products[i]?.options !== "undefined" && products[i]?.options.length > 0) {
            for (var [key, value] of goodsAmount) {
                if (key.includes(`${products[i].id}`)) {
                    goods.push(JSON.parse(JSON.stringify(products[i])));
                    var prodKey = key.substring(key.indexOf("_") + 1);
                    var j = 0;
                    var optionPriceBoost = 0;
                    var optionNames = []
                    while (prodKey.length > 0) {
                        var index = 0
                        if (prodKey.includes("_")) {
                            index = prodKey.substring(0, prodKey.indexOf("_"));
                        } else {
                            index = prodKey
                        }
                        optionPriceBoost += products[i].options[j].options[index].price;
                        optionNames.push(products[i].options[j].options[index].name)
                        if (prodKey.includes("_")) {
                            prodKey = prodKey.substring(prodKey.indexOf("_") + 1)
                        } else {
                            prodKey = ""
                        }
                        j++;
                    }
                    goods[goods.length - 1].id = key;
                    goods[goods.length - 1].names = optionNames;
                    goods[goods.length - 1].boostPrice = products[i].price + optionPriceBoost;
                    price += (products[i].price + optionPriceBoost) * value;
                }
            }            
        }
        if (goodsAmount.has(`${products[i].id}`)) {
            goods.push(products[i])
            price += products[i].price * goodsAmount.get(`${products[i].id}`)
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
        // while (deliveryType.length > 0) {
        //     deliveryType.pop()
        // }
        // deliveryType.push(deliveryMethod[activeButton].method)
        userInfo[0].deliveryType = deliveryMethod[activeButton].method
        // while (deliveryAddress.length > 0) {
        //     deliveryAddress.pop()
        // }
        if (activeButton === 1) {
            userInfo[0].deliveryAddress = document.getElementById('deliveryAddress').value
            // deliveryAddress.push(document.getElementById('deliveryAddress').value)
        } else {
            userInfo[0].deliveryAddress = ""
        }

        if ((activeButton === 1 && document.getElementById('deliveryAddress').value.length > 0 && document.getElementById('deliveryAddress').value.length < 200) || (activeButton === 0)) {
            setIsValidAddress(true);
            setIsLoading(true);
            try {
                await createCart()
            } catch (e) {
                // console.log(e)
            }
            setIsLoading(false);
            navigate('ConfirmOrder', { replace: false })
        } else {
            setIsValidAddress(false);
        }
    }

    async function createCart() {
        var response  = await axios.post(`https://market-bot.org:8082/clients_api/clients_menu/create_cart?client_id=${userInfo[0].id}`)
        // while (cartId.length > 0) {
        //     cartId.pop()
        // }
        // cartId.push(response.data.data)
        userInfo[0].cartId = response.data.data
        setAppState(response);

        await addToCart();
    }

    async function addToCart() {
        var response = ''
        for (let i = 0; i < goods.length; i++) {
            if (typeof goods[i]?.options !== "undefined" && goods[i]?.options.length > 0) {
                let find = false;
                var options = []
                for (let j = 0; j < products.length && !find; j++) {
                    if (parseInt(goods[i].id.substring(0, goods[i].id.indexOf("_"))) === products[j].id) {
                        find = true;
                        var prodKey = key.substring(key.indexOf("_") + 1);
                        var k = 0;
                        while (prodKey.length > 0) {
                            var index = 0
                            if (prodKey.includes("_")) {
                                index = prodKey.substring(0, prodKey.indexOf("_"));
                            } else {
                                index = prodKey
                            }

                            var option = {
                                "group_name": products[j].options[k].group_name,
                                options: [
                                    products[j].options[k].options[index]
                                ]
                            }
                            options.push(option)

                            if (prodKey.includes("_")) {
                                prodKey = prodKey.substring(prodKey.indexOf("_") + 1)
                            } else {
                                prodKey = ""
                            }
                            k++;
                        }
                    }
                }
                response = await axios.post('https://market-bot.org:8082/clients_api/clients_menu/add_to_cart', {
                        cart_id: cartId[0],
                        product_id: parseInt(goods[i].id.substring(0, goods[i].id.indexOf("_"))),
                        count: goodsAmount.get(goods[i].id),
                        price: goods[i].price * goodsAmount.get(goods[i].id),
                        option: options
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                })
            } else {
                response = await axios.post('https://market-bot.org:8082/clients_api/clients_menu/add_to_cart', {
                        cart_id: cartId[0],
                        product_id: parseInt(goods[i].id),
                        count: goodsAmount.get(`${goods[i].id}`),
                        price: goods[i].price * goodsAmount.get(`${goods[i].id}`),
                        option: []
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                })
            }
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
            setIsValidAddress(true)
            return  <form className='payments'>
                        <div className='fieldHeader'>Адрес доставки</div>
                        <textarea className='textFieldAddress' type="text" id='deliveryAddress'></textarea>
                    </form>
        } else {
            setIsValidAddress(true)
            return <div className='payments'>
                <div className='fieldHeader'>Адрес самовывоза</div>
                <textarea className='textFieldAddress' type="text" id='pickupAddress' defaultValue={contacts[0].shop_address} readOnly></textarea>
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
                        {[...Array.from(goods)].map(item => {
                            return <div className='goods'>
                                <img
			    		            src={item.photoFile}
                                    alt={item.name}
                                    className='prodImg'
                                />
                                <div className='prodText'>
                                    <div className='prodName'>{item.name}</div>
                                    {
                                        typeof item.weigth !== "undefined" ? (
                                            <div className='prodParam'>{item.weight} гр</div>
                                        ) : (
                                            <div></div>
                                        )
                                    }
                                    {typeof item?.options !== "undefined" && item?.options.length > 0 ? (
                                        item.names.map(option => (
                                            <div className='prodOption'>{option}</div>
                                        ))
                                    ) : (
                                        <div></div>
                                    )}
                                    {/* <div className='changeAmountButtons'>
                                        <button className='minus-cart-btn' onClick={() => onChange('-', item.id)}>-</button>
                                        <div className='amountCart'>{goodsAmount.get(item.id) ?? 1}</div>
                                        <button className='plus-cart-btn' onClick={() => onChange('+', item.id)}>+</button>
                                    </div>                   */}
                                    <div className='prodParam'>{goodsAmount.get(`${item.id}`)} шт.</div>
                                    <div className='prodPrice'>{(item.price * goodsAmount.get(`${item.id}`)).toFixed(2)} ₽</div>
                                </div>
                            </div>
                        })}
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
                        { isValidAddress ? ( 
                            <div></div> 
                        ) : (
                            <div className='wrongPhone'>Адрес должен быть заполнен (не боле 200 символов)</div>
                        )}
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