import React, { useEffect, useState } from 'react'
import './ConfirmOrder.css'
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../../hooks/useTelegram';
import { goodsAmount } from '../../Products/Products';
import axios from 'axios';
import { userInfo } from '../../TestData/user';
import ReactLoading from "react-loading";
import { contacts } from '../../Profile/Profile.jsx';
import OtherHeader from '../../OtherHeader/OtherHeader.jsx';

var promo = []
// export var deliveryAddress = []
// export var deliveryType = []
var paymentSelect = ['Онлайн']

var selection = new Map()

var fieldFill = new Map()

const ConfirmOrder = () => {
    let navigate = useNavigate();
    const {queryId} = useTelegram(); 

    const [appState, setAppState] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isValidPhone, setIsValidPhone] = useState(true);
    const [isValidName, setIsValidName] = useState(true);
    const [isValidComment, setIsValidComment] = useState(true);
    const [isValidPromo, setIsValidPromo] = useState(true);

    const {products} = require('../../TestData/prod.jsx');

    const paymentMethod = [
        {method: 'Онлайн'},
        {method: 'Банковской картой'},
        {method: 'Наличными'},
        // {method: 'Оплатить бонусами'}
    ];

    // const [activeButton, setActiveButton] = useState(0);

    const [courier, setCourier] = useState();

    const [isValidAddress, setIsValidAddress] = useState(true);

    const deliveryMethod = [
        {method: 'Самовывоз'},
        {method: 'Доставка'}
    ];

    let goods = []
    let price = 0
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

    if (typeof selection.get('delivery') === "undefined") {
        selection.set('delivery', 0);
    }

    if (typeof selection.get('payment') === "undefined") {
        selection.set('payment', 0);
    }

    const changeType = (type) => {
        // setActiveButton(type)
        selection.set('delivery', type);
        setAppState(appState + 1)
        if (type === 0) {
            setCourier(false);
            // setDelivery(0);
        } else {
            setCourier(true);
            // if (price < 999) {
            //     setDelivery(200);
            // }
        }
    }

    const confirm = async () => {
        var paymentType = paymentSelect[0] === 0 ? 'card' : 'cash';
        var delType = selection.get('delivery') === 0 ? 'pickup': 'delivery';
        var deliveryAddress = selection.get('delivery') === 0 ? '' : document.getElementById('deliveryAddress').value;
        var phone = document.getElementById('phone').value;
        var name = document.getElementById('name').value;
        var comment = document.getElementById('comment').value;
        userInfo[0].latitude = 0
        userInfo[0].longitude = 0
        while (promo.length > 0) {
            promo.pop()
        }
        promo.push(document.getElementById('promo').value)

        fieldFill.set('address', deliveryAddress);
        fieldFill.set('name', name);
        fieldFill.set('phone', phone);
        fieldFill.set('comment', comment);
        
        async function getCoords() {
            try {
                const response = await axios.get(
			    	`https://geocode-maps.yandex.ru/1.x/?apikey=97e17441-c27d-4020-9b23-0b815499d385&geocode=${deliveryAddress}&format=json`,
			    	{ withCredentials: false }
			    )

			    if (
			    	response.data &&
			    	response.data.response.GeoObjectCollection.featureMember.length > 0
			    ) {
			    	const coords =
			    		response.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
			    			.split(' ')
			    			.map(Number)
                    console.log(coords)
                    userInfo[0].latitude = coords[1]
                    userInfo[0].longitude = coords[0]
			    }
            } catch (error) {
                console.error('Failed to fetch coordinates:', error)
            }
        }

        async function createCart() {
            var response  = await axios.post(`https://market-bot.org:8082/clients_api/clients_menu/create_cart?client_id=${userInfo[0].id}`)
            // while (cartId.length > 0) {
            //     cartId.pop()
            // }
            // cartId.push(response.data.data)
            userInfo[0].cartId = response.data.data
            // setAppState(response);
    
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
                            var prodKey = goods[i].id.substring(goods[i].id.indexOf("_") + 1);
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
                            cart_id: userInfo[0].cartId,
                            product_id: parseInt(goods[i].id.substring(0, goods[i].id.indexOf("_"))),
                            count: goodsAmount.get(goods[i].id),
                            price: goods[i].price * goodsAmount.get(goods[i].id),
                            option: options
                        }, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                    })
                    console.log(response)
                } else {
                    response = await axios.post('https://market-bot.org:8082/clients_api/clients_menu/add_to_cart', {
                            cart_id: userInfo[0].cartId,
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
            // setAppState(response);
        }
      
        async function createOrder() {
            var response = await axios.post('https://market-bot.org:8082/clients_api/clients_orders/create_order', {
                "client_id": userInfo[0].id,
                "bot_id": userInfo[0].bot_id,
                "cart_id": userInfo[0].cartId,
                "pay_type": paymentType,
                "delivery_type": delType,
                "delivery_address": deliveryAddress,
                "comment": comment,
                "phone": phone,
                "promo_code": promo[0],
                "latitude": userInfo[0].latitude,
                "longitude": userInfo[0].longitude,
                "name": name,
            }, {
              headers: {
                  'Content-Type': 'application/json'
              }
            })
            setAppState(response);
            return response.status
        }
  
        async function payForCart() {
            if (promo[0] !== null && promo[0] !== "" && typeof promo[0] !== "undefined") {
                var response = await axios.post(`https://market-bot.org:8082/clients_api/clients_menu/pay_for_cart/?bot_id=${userInfo[0].bot_id}&client_id=${userInfo[0].id}&cart_id=${userInfo[0].cartId}&promo_code=${promo[0]}`, {
                    "client_id": userInfo[0].id,
                    "bot_id": userInfo[0].bot_id,
                    "cart_id": userInfo[0].cartId,
                    "pay_type": paymentType,
                    "delivery_type": delType,
                    "delivery_address": deliveryAddress,
                    "comment": comment,
                    "phone": phone,
                    "promo_code": promo[0],
                    "latitude": userInfo[0].latitude,
                    "longitude": userInfo[0].longitude,
                    "name": name
                    }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                var json = response.data
                json.query_id = queryId
                setAppState(response);
                return response.status
            } else {
                var response = await axios.post(`https://market-bot.org:8082/clients_api/clients_menu/pay_for_cart/?bot_id=${userInfo[0].bot_id}&client_id=${userInfo[0].id}&cart_id=${userInfo[0].cartId}`, {
                  "client_id": userInfo[0].id,
                  "bot_id": userInfo[0].bot_id,
                  "cart_id": userInfo[0].cartId,
                  "pay_type": paymentType,
                  "delivery_type": delType,
                  "delivery_address": deliveryAddress,
                  "comment": comment,
                  "phone": phone,
                  "latitude": userInfo[0].latitude,
                  "longitude": userInfo[0].longitude,
                  "name": name
                }, {
                  headers: {
                      'Content-Type': 'application/json'
                  }
                })
                var json = response.data
                json.query_id = queryId
                setAppState(response);
                return response.status
            }
        }
      
        async function makeRequest() {
            await createCart();
            if (selection.get('delivery') === 1) {
                await getCoords();
            }
            if (paymentSelect[0] === 0) {
                return await payForCart()
            } 
            // else if (paymentSelect[0] === 3) {
            //     // метод для оплаты бонусами
            // }             
            else {
                return await createOrder()
            }
        }

        if (document.getElementById('phone').value.length === 11) {
            setIsValidPhone(true);
            if (document.getElementById('name').value.length > 0 && document.getElementById('name').value.length < 100) {
                setIsValidName(true);
                if (document.getElementById('comment').value.length < 200) {
                    setIsValidComment(true);
                    if ((selection.get('delivery') === 1 && document.getElementById('deliveryAddress').value.length > 0 && document.getElementById('deliveryAddress').value.length < 200) || (selection.get('delivery') === 0)) {
                        setIsValidAddress(true);
                        if (document.getElementById('promo').value.length < 50) {
                            setIsValidPromo(true);
                            setIsLoading(true);
                            var code = 400
                            try {
                                code = await makeRequest();
                            } catch (e) {
                                if (typeof e !== "undefined") {
                                    if (typeof e.response !== "undefined") {
                                        if (typeof e.response.data !== "undefined") {
                                            if (typeof e.response.data.detail !== "undefined" && (e.response.data.detail === "Wrong promo code" || e.response.data.detail === "Error with create order: 400: Wrong promo code")) {
                                                alert("Неверный промокод");
                                            } else if (typeof e.response.data.detail !== "undefined" && (e.response.data.detail === "Error with create order: 400: Can't find out where user is" || e.response.data.detail === "Can't find out where user is")) {
                                                alert("Адрес указан неверно");
                                            } else if (typeof e.response.data.detail !== "undefined" && (e.response.data.detail === "Error with create order: 400: User is too far from a shop" || e.response.data.detail === "User is too far from a shop")) {
                                                alert("По указанному адресу доставка не осуществляется");
                                            } else {
                                                alert('Ошибка при оформлении заказа, попробуйте ещё раз')
                                            }
                                        } else {
                                            alert('Ошибка при оформлении заказа, попробуйте ещё раз')
                                        }
                                    } else {
                                        alert('Ошибка при оформлении заказа, попробуйте ещё раз')
                                    }
                                } else {
                                    alert('Ошибка при оформлении заказа, попробуйте ещё раз')
                                }
                            }
                            setIsLoading(false);
                            if (code === 200) {
                                var type = paymentSelect[0] === 0 ? 'online' : 'courier'
                                navigate(`OrderConfirmed/${type}`, { replace: false, state: {type: type} })
                            }
                        } else {
                            setIsValidPromo(false);
                        }
                    } else {
                        setIsValidAddress(false);
                    }
                } else {
                    setIsValidComment(false);
                }
            } else {
                setIsValidName(false);
            }
        } else {
            setIsValidPhone(false);
        }
    }

    const changePaymentType = (type) => {
        while (paymentSelect.length > 0) {
            paymentSelect.pop()
        }
        paymentSelect.push(type)
        selection.set('payment', type)
        setAppState(appState - 1)
        // setActiveButton(type)
    }

    function Address() {
        if (courier) {
            // setIsValidAddress(true)
            return  <form className='deliveryConfirmOrderLine'>
                        <div className='fieldHeader'>Адрес доставки</div>
                        <textarea className='textFieldAddress' type="text" id='deliveryAddress' placeholder='город …, улица …, дом …, квартира …' defaultValue={fieldFill.get('address')}></textarea>
                    </form>
        } else {
            // setIsValidAddress(true)
            return <div className='deliveryConfirmOrderLine'>
                <div className='fieldHeader'>Адрес самовывоза</div>
                <textarea className='textFieldAddress' type="text" id='pickupAddress' defaultValue={contacts[0].shop_address} readOnly></textarea>
            </div>
        }
    }
    
    return (
        <div>
            <OtherHeader />
            {isLoading ? (
                <div className='loadScreen'>
                    <ReactLoading type="bubbles" color="#419FD9"
                        height={100} width={50} />
                </div>
            ) : (
                <div>
                    <div className='cart'>
                        <p className='name'>Оформление заказа</p>
                        <div>
                            <div className='payments'>
                                <div className='fieldHeader'>Выберите способ доставки:</div>
                                <div className='deliveryLine'>
                                    {deliveryMethod.map((method, index) => (
                                        (method.method === "Самовывоз" || (method.method === "Доставка" && userInfo[0].haveDelivery)) ? (
                                            <div className='deliveryButton'>
                                                <button className={`method${selection.get('delivery') === index ? 'active' : ''}`} onClick={() => changeType(index)}>
                                                    {method.method}
                                                </button>
                                            </div>
                                            ) : (
                                                <div></div>
                                        )
                                    ))}
                                </div>
                                <Address />
                            </div>
                            { isValidAddress ? ( 
                                <div></div> 
                            ) : (
                                <div className='wrongPhone'>Адрес должен быть заполнен (не боле 200 символов)</div>
                            )}
                            <div className='payments'>
                                <div className='fieldHeader'>Выберите способ оплаты:</div>
                                <div className='paymentBlock'>
                                        {paymentMethod.map((method, index) =>
                                            <div className='paymentButton'>
                                                <button className={`method${selection.get('payment') === index ? 'active' : ''}`} onClick={() => changePaymentType(index)}>
                                                    {method.method}
                                                </button>
                                            </div>
                                        )}
                                </div>
                            </div>
                            <form className='payments'>
                                <div className='fieldHeader'>ФИО</div>
                                <div className='promoLine'>
                                    <input className='textField' type="text" id='name' defaultValue={fieldFill.get('name')}></input>
                                </div>
                                { isValidName ? ( 
                                    <div></div> 
                                ) : (
                                    <div className='wrongPhone'>ФИО должно быть заполнено (не более 100 символов)</div>
                                )}
                                <div className='fieldHeader'>Номер телефона</div>
                                <div className='promoLine'>
                                    <input className='textField' type="text" id='phone' defaultValue={fieldFill.get('phone')}></input>
                                </div>
                                { isValidPhone ? ( 
                                    <div></div> 
                                ) : (
                                    <div className='wrongPhone'>Номер телефона должен содержать строго 11 цифр</div>
                                )}
                                <div className='fieldHeader'>Промокод</div>
                                <div className='promoLine'>
                                    <input className='textField' type="text" id='promo'></input>
                                    {/* <button className='promo-btn' onClick={ClearText}>ОК</button> */}
                                </div>
                                { isValidPromo ? ( 
                                    <div></div> 
                                ) : (
                                    <div className='wrongPhone'>Промокод должен содержать до 50 символов</div>
                                )}
                                {/* <div className='fieldHeader'>Ник в Telegram</div>
                                <input className='textField' type="text" id='tg'></input> */}
                                {/* <div className='fieldHeader'>Адрес доставки</div>
                                <input className='textField' type="text" id='address'></input> */}
                                <div className='fieldHeader'>Комментарий</div>
                                <textarea className='textFieldExt' type="text" id='comment' placeholder='Комментарий' defaultValue={fieldFill.get('comment')}></textarea>
                                { isValidComment ? ( 
                                    <div></div> 
                                ) : (
                                    <div className='wrongPhone'>Комментарий должен содержать до 200 символов</div>
                                )}
                            </form>
                            <button className='shop-btn' onClick={() => confirm()}>Подтвердить оформление</button>
                        </div>
                    </div>
                </div>
            )}            
        </div>
    )
}

export default ConfirmOrder;