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
// var paymentSelect = ['Онлайн']

export var selection = new Map()

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
    const [isValidBonus, setIsValidBonus] = useState(true);

    const {products} = require('../../TestData/prod.jsx');

    const paymentMethod = [
        {method: 'Онлайн'},
        {method: 'Банковской картой'},
        {method: 'Наличными'},
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

    const [finalPrice, setFinalPrice] = useState(price);


    if (typeof selection.get('delivery') === "undefined") {
        selection.set('delivery', 0);
    }

    if (typeof selection.get('payment') === "undefined") {
        selection.set('payment', 0);
    }

    if (typeof selection.get('bonuses') === "undefined") {
        selection.set('bonuses', 0);
    }

    var maxBonusValue = (price + (userInfo[0].delivery_cost ?? 0) * selection.get('delivery')) * (userInfo[0].limit_bonuses ?? 0) / 100;
    if (maxBonusValue > userInfo[0].bonus_points) {
        maxBonusValue = userInfo[0].bonus_points;
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
        var paymentType = selection.get('payment') === 0 ? 'card' : 'cash';
        var delType = selection.get('delivery') === 0 ? 'pickup': 'delivery';
        var deliveryAddress = selection.get('delivery') === 0 ? '' : fieldFill.get('address');
        var phone = fieldFill.get('phone');
        var name = fieldFill.get('name');
        var comment = fieldFill.get('comment');
        var bonusPoints = parseInt(fieldFill.get('bonus'));
        userInfo[0].latitude = 0
        userInfo[0].longitude = 0
        while (promo.length > 0) {
            promo.pop()
        }
        if (typeof fieldFill.get('promo') === "undefined") {
            promo.push("")
        } else {
            promo.push(fieldFill.get('promo'))
        }

        // fieldFill.set('address', deliveryAddress);
        // fieldFill.set('name', name);
        // fieldFill.set('phone', phone);
        // fieldFill.set('comment', comment);

        if (typeof fieldFill.get('bonus') === "undefined" || selection.get("bonuses") === 0) {
            bonusPoints = 0
        }
        
        async function getCoords() {
            try {
                const response = await axios.get(
			    	`https://geocode-maps.yandex.ru/1.x/?apikey=08afa3ed-8e3e-46ea-b965-cd5f435f6a92&geocode=${deliveryAddress}&format=json`,
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
                    userInfo[0].latitude = coords[1]
                    userInfo[0].longitude = coords[0]
			    }
            } catch (error) {
                console.error('Failed to fetch coordinates:', error)
            }
        }

        async function createCart() {
            var response  = await axios.post(`https://market-bot.org:8082/clients_api/clients_menu/create_cart/${userInfo[0].bot_id}?client_id=${userInfo[0].id}`)
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
                    if (typeof goods[i].boostPrice === 'undefined') {
                        goods[i].boostPrice = goods[i].price;
                    }
                    response = await axios.post(`https://market-bot.org:8082/clients_api/clients_menu/add_to_cart/${userInfo[0].bot_id}`, {
                            cart_id: userInfo[0].cartId,
                            product_id: parseInt(goods[i].id.substring(0, goods[i].id.indexOf("_"))),
                            count: goodsAmount.get(goods[i].id),
                            price: goods[i].boostPrice * goodsAmount.get(goods[i].id),
                            option: options
                        }, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                    })
                } else {
                    response = await axios.post(`https://market-bot.org:8082/clients_api/clients_menu/add_to_cart/${userInfo[0].bot_id}`, {
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
            var response = await axios.post(`https://market-bot.org:8082/clients_api/clients_orders/create_order/${userInfo[0].bot_id}`, {
                "client_id": userInfo[0].id,
                "bot_id": userInfo[0].bot_id,
                "cart_id": userInfo[0].cartId,
                "pay_type": paymentType,
                "delivery_type": delType,
                "delivery_address": deliveryAddress,
                "comment": comment,
                "phone": phone,
                "promo_code": promo[0],
                "bonus_points": bonusPoints,
                "latitude": userInfo[0].latitude,
                "longitude": userInfo[0].longitude,
                "name": name,
            }, {
              headers: {
                  'Content-Type': 'application/json'
              }
            })
            // console.log(response)
            setAppState(response);
            return response.status
        }
  
        async function payForCart() {
            if (promo[0] !== null && promo[0] !== "" && typeof promo[0] !== "undefined") {
                var response = await axios.post(`https://market-bot.org:8082/clients_api/clients_menu/pay_for_cart/${userInfo[0].bot_id}?client_id=${userInfo[0].id}&cart_id=${userInfo[0].cartId}&promo_code=${promo[0]}&bonus_points=${bonusPoints}`, {
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
                // console.log(response)
                setAppState(response);
                return response.status
            } else {
                var response = await axios.post(`https://market-bot.org:8082/clients_api/clients_menu/pay_for_cart/${userInfo[0].bot_id}?client_id=${userInfo[0].id}&cart_id=${userInfo[0].cartId}&bonus_points=${bonusPoints}`, {
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
                // console.log(response)
                setAppState(response);
                return response.status
            }
        }
      
        async function makeRequest() {
            await createCart();
            if (selection.get('delivery') === 1) {
                await getCoords();
            }
            if (selection.get('payment') === 0) {
                return await payForCart()
            }     
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
                                // console.log(e);
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
                                var type = selection.get('payment') === 0 ? 'online' : 'courier'
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
        // while (paymentSelect.length > 0) {
        //     paymentSelect.pop()
        // }
        // paymentSelect.push(type)
        selection.set('payment', type)
        setAppState(appState - 1)
        // setActiveButton(type)
    }

    const changeBonusType = () => {
        if (selection.get('bonuses') === 1) {
            setFinalPrice(price);
            setIsValidBonus(true);
            selection.set('bonuses', 0)
            fieldFill.delete('bonus');
        } else {
            selection.set('bonuses', 1)
        }
        setAppState(appState - 1)
        // setActiveButton(type)
    }

    const bonusUpd = (value) => {
        if (value > maxBonusValue) {
            setFinalPrice(price);
            setIsValidBonus(false);
            fieldFill.delete('bonus');
        } else {
            setFinalPrice(price - value);
            setIsValidBonus(true);
            fieldFill.set('bonus', value);
        }
    }

    const addressUpd = (value) => {
        if (selection.get('delivery') === 0) {
            fieldFill.delete('address');
        } else {
            fieldFill.set('address', value);
        }
    }

    const nameUpd = (value) => {
        fieldFill.set('name', value);
    }

    const phoneUpd = (value) => {
        fieldFill.set('phone', value);
    }

    const commentUpd = (value) => {
        fieldFill.set('comment', value);
    }

    const promoUpd = (value) => {
        fieldFill.set('promo', value);
    }

    var shop_address = ""
    if (typeof contacts !== 'undefined') {
        if (typeof contacts[0] !== 'undefined') {
            shop_address = contacts[0].shop_address
        }
    }

    function Address() {
        if (courier) {
            // setIsValidAddress(true)
            return  <form className='deliveryConfirmOrderLine'>
                        <div className='fieldHeader'>Адрес доставки</div>
                        <textarea className='textFieldAddress' type="text" id='deliveryAddress' placeholder='город …, улица …, дом …, квартира …' defaultValue={fieldFill.get('address')} onChange={() => addressUpd(document.getElementById('deliveryAddress').value)}></textarea>
                    </form>
        } else {
            // setIsValidAddress(true)
            return <div className='deliveryConfirmOrderLine'>
                <div className='fieldHeader'>Адрес самовывоза</div>
                <textarea className='textFieldAddress' type="text" id='pickupAddress' defaultValue={shop_address} readOnly></textarea>
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
                            <div className='payments'>
                                {/* <div className='fieldHeader'></div> */}
                                <div className='bonusLine'>
                                    <div className='deliveryButton'>
                                        <button className={`method${selection.get('bonuses') === 1 ? 'active' : ''}`} onClick={() => changeBonusType()}>
                                            Оплата бонусами
                                        </button>
                                    </div>
                                    <div className='bonusText'>Бонусов: {userInfo[0].bonus_points.toFixed(0)}</div>
                                </div>
                                {selection.get('bonuses') === 1 ? (
                                    <div className='promoLine'>
                                        <input className='textField' type="text" id='bonus' defaultValue={fieldFill.get('bonus')} placeholder={`Можно списать бонусов: ${maxBonusValue.toFixed(0)}`} onChange={() => bonusUpd(document.getElementById('bonus').value)}></input>
                                    </div>
                                ) : (
                                    <div></div>
                                )}
                                { isValidBonus ? ( 
                                    <div></div> 
                                ) : (
                                    <div className='wrongPhone'>Указано неверное количество бонусов для списания</div>
                                )}
                            </div>
                            <div className='moneyBlock'>
                                {/* <PaidDelivery /> */}
                                <div className='cartLine'>
                                    <div className='cartName'>Стоимость доставки</div>
                                    {
                                        selection.get('delivery') === 0 ? (
                                            <div className='cartPrice'>0 ₽</div>
                                        ) : (
                                            <div className='cartPrice'>{userInfo[0].delivery_cost ?? 0} ₽</div>
                                        )
                                    }
                                </div>                            
                                <div className='cartLine'>
                                    <div className='cartName'>Общая сумма к оплате</div>
                                    {
                                        selection.get('delivery') === 0 ? (
                                            <div className='cartPrice'>{(finalPrice).toFixed(2)} ₽</div>
                                        ) : (
                                            <div className='cartPrice'>{(finalPrice + (userInfo[0].delivery_cost ?? 0)).toFixed(2)} ₽</div>
                                        )
                                    }
                                </div>
                                <div className='cartLine'>
                                    <div className='cartName'>Вернётся бонусами</div>
                                    {
                                        selection.get('delivery') === 0 ? (
                                            <div className='cartPrice'>{((userInfo[0].cashback ?? 0) * (finalPrice) / 100).toFixed(2)} ₽</div>
                                        ) : (
                                            <div className='cartPrice'>{((userInfo[0].cashback ?? 0) * (finalPrice + (userInfo[0].delivery_cost ?? 0)) / 100).toFixed(2)} ₽</div>
                                        )
                                    }
                                </div>
                            </div>
                            <form className='payments'>
                                <div className='fieldHeader'>ФИО</div>
                                <div className='promoLine'>
                                    <input className='textField' type="text" id='name' defaultValue={fieldFill.get('name')} onChange={() => nameUpd(document.getElementById('name').value)}></input>
                                </div>
                                { isValidName ? ( 
                                    <div></div> 
                                ) : (
                                    <div className='wrongPhone'>ФИО должно быть заполнено (не более 100 символов)</div>
                                )}
                                <div className='fieldHeader'>Номер телефона *</div>
                                <div className='promoLine'>
                                    <input className='textField' type="text" id='phone' defaultValue={fieldFill.get('phone')} onChange={() => phoneUpd(document.getElementById('phone').value)}></input>
                                </div>
                                { isValidPhone ? ( 
                                    <div></div> 
                                ) : (
                                    <div className='wrongPhone'>Номер телефона должен содержать строго 11 цифр</div>
                                )}
                                <div className='fieldHeader'>Промокод</div>
                                <div className='promoLine'>
                                    <input className='textField' type="text" id='promo' onChange={() => promoUpd(document.getElementById('promo').value)}></input>
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
                                <textarea className='textFieldExt' type="text" id='comment' placeholder='Комментарий' defaultValue={fieldFill.get('comment')} onChange={() => commentUpd(document.getElementById('comment').value)}></textarea>
                                { isValidComment ? ( 
                                    <div></div> 
                                ) : (
                                    <div className='wrongPhone'>Комментарий должен содержать до 200 символов</div>
                                )}
                            </form>
                            <div className='payments'>
                                <div className='policyText'>
                                    Нажимая на кнопку "Подтвердить оформление" Вы даете согласие на обработку и хранение персональных данных в соответствии с Политикой конфиденциальности и условиями.
                                    <span className='policyLinkConfirm' onClick={() => navigate('PolicyPage', { replace: false })}> Подробнее</span>
                                </div>
                            </div>
                            <button className='shop-btn' onClick={() => confirm()}>Подтвердить оформление</button>
                        </div>
                    </div>
                </div>
            )}            
        </div>
    )
}

export default ConfirmOrder;