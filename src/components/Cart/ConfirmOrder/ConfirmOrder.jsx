import React, { useEffect, useState } from 'react'
import './ConfirmOrder.css'
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../../hooks/useTelegram';
import { goodsAmount } from '../../Products/Products';
import axios from 'axios';
import { userInfo } from '../../TestData/user';
import { cartId } from '../Cart.jsx';
import ReactLoading from "react-loading";

export var promo = []
export var deliveryAddress = []
export var deliveryType = []

const ConfirmOrder = () => {
    let navigate = useNavigate();
    const {queryId, onClose} = useTelegram(); 

    const [appState, setAppState] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [isValidPhone, setIsValidPhone] = useState(true);
    const [isValidName, setIsValidName] = useState(true);
    const [isValidComment, setIsValidComment] = useState(true);

    const {products} = require('../../TestData/prod.jsx');

    const paymentMethod = [
        {method: 'Онлайн'},
        {method: 'Банковской картой'},
        {method: 'Наличными'}
    ];

    const [activeButton, setActiveButton] = useState(0);

    let goods = []

    let json = {}

    for (let i = 0; i < Object.keys(products).length && !find; i++) {
        if (goodsAmount.has(products[i].id)) {
            goods.push(products[i])
        }
    }

    // useEffect(() => {

    // }, [setAppState]);

    const confirm = async () => {
        var paymentType = paymentMethod[activeButton] === 'Банковской картой' ? 'card' : 'cash';
        var delType = deliveryType[0] === 'Самовывоз' ? 'pickup': 'delivery';
      
          async function createOrder() {
            var response = await axios.post('https://market-bot.org:8082/clients_api/clients_orders/create_order', {
              "client_id": userInfo[0].id,
              "bot_id": userInfo[0].bot_id,
              "cart_id": cartId[0],
              "pay_type": paymentType,
              "delivery_type": delType,
              "delivery_address": deliveryAddress[0],
              "comment": document.getElementById('comment').value,
              "phone": document.getElementById('phone').value
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
                var response = await axios.post(`https://market-bot.org:8082/clients_api/clients_menu/pay_for_cart/?bot_id=${userInfo[0].bot_id}&client_id=${userInfo[0].id}&cart_id=${cartId[0]}&promo_code=${promo[0]}`, {
                    "client_id": userInfo[0].id,
                    "bot_id": userInfo[0].bot_id,
                    "cart_id": cartId,
                    "pay_type": paymentType,
                    "delivery_type": delType,
                    "delivery_address": deliveryAddress[0],
                    "comment": document.getElementById('comment').value,
                    "phone": document.getElementById('phone').value
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
                response = await axios.post(`https://market-bot.org:8082/clients_api/clients_menu/pay_for_cart/?bot_id=${userInfo[0].bot_id}&client_id=${userInfo[0].id}&cart_id=${cartId[0]}`, {
                  "client_id": userInfo[0].id,
                  "bot_id": userInfo[0].bot_id,
                  "cart_id": cartId,
                  "pay_type": paymentType,
                  "delivery_type": delType,
                  "delivery_address": deliveryAddress[0],
                  "comment": document.getElementById('comment').value,
                  "phone": document.getElementById('phone').value
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
            if (paymentMethod[activeButton] === "Онлайн") {
                return await payForCart()
            } else {
                return await createOrder()
            }
          }

        if (document.getElementById('phone').value.length === 11) {
            setIsValidPhone(true);
            if (document.getElementById('name').value.length > 0 && document.getElementById('name').value.length < 100) {
                setIsValidName(true);
                if (document.getElementById('comment').value.length < 200) {
                    setIsValidComment(true);
                    setIsLoading(true);
                    var code = 400
                    try {
                        code = await makeRequest();
                    } catch (e) {
                        console.log(e)
                    }
                    setIsLoading(false);
                    if (code === 200) {
                        navigate('OrderConfirmed', { replace: false })
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

    const changeType = (type) => {
        setActiveButton(type)
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
                    {/* <SecondOtherHeader /> */}
                    <div className='cart'>
                        <p className='name'>Оформление заказа</p>
                        <div>
                            <form className='payments'>
                                <div className='fieldHeader'>ФИО</div>
                                <div className='promoLine'>
                                    <input className='textField' type="text" id='name'></input>
                                </div>
                                { isValidName ? ( 
                                    <div></div> 
                                ) : (
                                    <div className='wrongPhone'>ФИО должно быть заполнено (не более 100 символов)</div>
                                )}
                                <div className='fieldHeader'>Номер телефона</div>
                                <div className='promoLine'>
                                    <input className='textField' type="text" id='phone'></input>
                                </div>
                                { isValidPhone ? ( 
                                    <div></div> 
                                ) : (
                                    <div className='wrongPhone'>Номер телефона должен содержать строго 11 цифр</div>
                                )}
                                {/* <div className='fieldHeader'>Ник в Telegram</div>
                                <input className='textField' type="text" id='tg'></input> */}
                                {/* <div className='fieldHeader'>Адрес доставки</div>
                                <input className='textField' type="text" id='address'></input> */}
                                <div className='fieldHeader'>Комментарий</div>
                                <textarea className='textFieldExt' type="text" id='comment' placeholder='Комментарий'></textarea>
                                { isValidComment ? ( 
                                    <div></div> 
                                ) : (
                                    <div className='wrongPhone'>Комментарий должен содержать до 200 символов</div>
                                )}
                            </form>
                            <div className='payments'>
                                <div className='fieldHeader'>Выберите способ оплаты:</div>
                                <div className='paymentBlock'>
                                        {paymentMethod.map((method, index) =>
                                            <div className='paymentButton'>
                                                <button className={`method${activeButton === index ? 'active' : ''}`} label={activeButton === index ? 'ACTIVE' : 'inactive'} onClick={() => changeType(index)}>
                                                    {method.method}
                                                </button>
                                            </div>
                                        )}
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