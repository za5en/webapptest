import React, { useEffect, useState } from 'react'
import './ConfirmOrder.css'
// import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../../hooks/useTelegram';
import { goodsAmount } from '../../Products/Products';
import axios from 'axios';
import { userInfo } from '../../TestData/user';
import SecondOtherHeader from '../../OtherHeader/OtherHeader2.jsx';
import { cartId } from '../Cart.jsx';

export var promo = []
export var deliveryAddress = []
export var deliveryType = []

const ConfirmOrder = () => {
    // let navigate = useNavigate();
    const {queryId, onClose} = useTelegram(); 

    const [appState, setAppState] = useState();
    const [isLoading, setIsLoading] = useState(false);

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
            console.log(response)
            console.log(response.data)
            setAppState(response);
          }
  
          async function payForCart() {
              var response = ''
              if (promo[0] !== null && promo[0] !== "" && typeof promo[0] !== "undefined") {
                response = await axios.post(`https://market-bot.org:8082/clients_api/clients_menu/get_all_menu?bot_id=${userInfo[0].bot_id}&client_id=${userInfo[0].id}&cart_id=${cartId[0]}&promo_code=${promo[0]}`, {
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
              } else {
                response = await axios.post(`https://market-bot.org:8082/clients_api/clients_menu/get_all_menu?bot_id=${userInfo[0].bot_id}&client_id=${userInfo[0].id}&cart_id=${cartId[0]}`, {
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
              }
              console.log(response)
              console.log(response.data)
              json = response.data
              json.query_id = queryId
              console.log(json)
              setAppState(response);
          }
      
          async function makeRequest() {
            setIsLoading(true);
            if (paymentMethod[activeButton] === "Онлайн") {
                await payForCart()
            } else {
                await createOrder()
            }
            setIsLoading(false);
            onClose
          }

        await makeRequest();
        onClose
    }

    const changeType = (type) => {
        setActiveButton(type)
    }
    
    return (
        <div>
            <SecondOtherHeader />
            <div className='cart'>
                <p className='name'>Оформление заказа</p>
                <div>
                    <form className='payments'>
                        {/* <div className='fieldHeader'>ФИО</div>
                        <input className='textField' type="text" id='name'></input> */}
                        <div className='fieldHeader'>Номер телефона</div>
                        <input className='textField' type="text" id='phone'></input>
                        {/* <div className='fieldHeader'>Ник в Telegram</div>
                        <input className='textField' type="text" id='tg'></input> */}
                        {/* <div className='fieldHeader'>Адрес доставки</div>
                        <input className='textField' type="text" id='address'></input> */}
                        <div className='fieldHeader'>Комментарий</div>
                        <textarea className='textFieldExt' type="text" id='comment' placeholder='Комментарий'></textarea>
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
                        {/* <form className='radioButtons'>
                            <div>
                                <input className='radioField' type="radio" name="payment" id="remittance" value="remittance"></input>
                                <label className='radioText' for="remittance">Онлайн</label><br />
                            </div>
                            <div>
                                <input className='radioField' type="radio" name="payment" id="card" value="card"></input>
                                <label className='radioText' for="card">Банковской картой</label><br />
                            </div>
                            <div>
                                <input className='radioField' type="radio" name="payment" id="cash" value="cash"></input>
                                <label className='radioText' for="cash">Наличными курьеру</label><br />
                            </div>
                        </form> */}
                    </div>
                    <button className='shop-btn' onClick={() => confirm()}>Подтвердить оформление</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmOrder;