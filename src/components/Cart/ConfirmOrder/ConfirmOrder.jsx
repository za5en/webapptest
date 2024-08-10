import React, { useEffect, useState } from 'react'
import './ConfirmOrder.css'
import OtherHeader from '../../OtherHeader/OtherHeader';
// import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../../hooks/useTelegram';
import { goodsAmount } from '../../Products/Products';
import axios from 'axios';
import { userInfo } from '../../TestData/user';
import { promo } from '../Cart.jsx';
import { deliveryAddress } from '../Cart.jsx';
import { deliveryType } from '../Cart.jsx';

export var cartId = []

const ConfirmOrder = () => {
    // let navigate = useNavigate();
    const {onClose} = useTelegram(); 

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
        async function addToCart(product, amount) {
            var response  = await axios.post('https://market-bot.org:8082/clients_api/clients_menu/add_to_cart', {
              cart_id: cartId,
              product_id: product.id,
              count: amount,
              price: product.price * amount,
              // option: [
              //   {
              //     group_name: groupName,
              //     options: [
              //       {
              //         name: optionName,
              //         article_number: article,
              //         price: optionPrice,
              //         weight: optionWeight,
              //         max_count: optionMax
              //       }
              //     ]
              //   }
              // ]
            }, {
              headers: {
                  'Content-Type': 'application/json'
              }
            })
            console.log(response.data)
            setAppState(response);
          }
      
          async function createOrder() {
            var response = await axios.post('https://market-bot.org:8082/clients_api/clients_orders/create_order', {
              "client_id": userInfo[0].id,
              "bot_id": userInfo[0].bot_id,
              "cart_id": cartId,
              "pay_type": paymentMethod[activeButton],
              "delivery_type": deliveryType[0],
              "delivery_address": deliveryAddress[0],
              "comment": document.getElementById('comment').value,
              "phone": document.getElementById('phone').value
            }, {
              headers: {
                  'Content-Type': 'application/json'
              }
            })
            console.log(response.data)
            setAppState(response);
          }
  
          async function payForCart() {
              if (promo[0] !== null && promo[0] !== "" && typeof promo[0] !== "undefined") {
                var response = await axios.post(`https://market-bot.org:8082/clients_api/clients_menu/get_all_menu?bot_id=${userInfo[0].bot_id}&client_id=${userInfo[0].id}&cart_id=${cartId[0]}&promo_code=${promo[0]}`)
              } else {
                var response = await axios.post(`https://market-bot.org:8082/clients_api/clients_menu/get_all_menu?bot_id=${userInfo[0].bot_id}&client_id=${userInfo[0].id}&cart_id=${cartId[0]}`)
              }
              console.log(response.data)
              json = response.data
              setAppState(response);
          }
      
          async function makeRequest() {
            setIsLoading(true);
            for (let i = 0; i < goods.length; i++) {
              await addToCart(goods[i], goodsAmount.get(goods[i].id))
            }
            if (paymentMethod[activeButton] === "Онлайн") {
                await payForCart()
            }
            await createOrder()
            setIsLoading(false);
          }

        await makeRequest();
        onClose;
    }

    const changeType = (type) => {
        setActiveButton(type)
    }
    
    return (
        <div>
            <OtherHeader />
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
                        <input className='textFieldExt' type="text" id='comment'></input>
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