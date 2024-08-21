import React, { useState } from 'react';
import './OrderCard.css'
import { useNavigate } from 'react-router-dom';
import { item } from '../OrderPage/OrderPage.jsx'
import { userInfo } from '../../TestData/user';
import axios from 'axios';
import ReactLoading from "react-loading";
import { goodsAmount } from '../../Products/Products.jsx';

export var goodsOrder = new Map()
export var goodsGlobal = new Map()

const OrderCard = ({order}) => {

    let navigate = useNavigate();
    
    const [appState, setAppState] = useState();
    const [isLoading, setIsLoading] = useState(false);

    let statuses = new Map()

    statuses.set('new', 'Новый')
    statuses.set('at work', 'В процессе')
    statuses.set('in delivery', 'В пути')
    statuses.set('completed', 'Выполнен')
    statuses.set('cancelled', 'Отменен')

    const openOrder = async () => {
        while (item.length > 0) {
            item.pop()
        }
        item.push(order)

        async function getProducts() {
            var response  = await axios.get(`https://market-bot.org:8082/clients_api/clients_orders/get_orders?bot_id=${userInfo[0].bot_id}&client_id=${userInfo[0].id}&order_id=${item[0].id}`)
            goodsOrder = await getCart(response.data[0].cart_id);
            // var goodsInfo = await getProductInfo();
            for (let i = 0; i < goodsOrder.length; i++) {
                goodsOrder[i].review = await getReviews(goodsOrder[i].product_id)
                goodsOrder[i].photoFile = await getPhoto(goodsOrder[i].product_id)
                // let find = false;
                // for (let j = 0; j < goodsInfo.length && !find; j++) {
                //     if (goodsOrder[i].product_id === goodsInfo[j].id) {
                //         find = true;
                //         // goodsOrder[i].name = goodsInfo[j].name;
                //         // goodsOrder[i].price = goodsInfo[j].price;
                //         // goodsOrder[i].weight = goodsInfo[j].weight;
                //     }
                // }
            }
            setAppState(goodsOrder);
        }
    
        async function getCart(cartId) {
            var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_carts?client_id=${userInfo[0].id}&cart_id=${cartId}`)
            return response.data.data[0].products;
        }
    
        async function getReviews(prodId) {
            var review = []
            try {
                var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_reviews/?bot_id=${userInfo[0].bot_id}&client_id=${userInfo[0].id}&product_id=${prodId}`)
                if (response.status === 200) {
                    for (let i = 0; i < response.data.length; i++) {
                        if (response.data[i].reviewer_id === userInfo[0].id) {
                            review = response.data[i]
                        }
                    }
                }
                setAppState(response);
            } catch (e) {
                // console.log(e)
            }
            return review 
        }
    
        async function getPhoto(prodId) {
            var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_photo?bot_id=${userInfo[0].bot_id}&product_id=${prodId}`, {responseType: 'blob'})
            return URL.createObjectURL(response.data)
        }

        // async function getProductInfo() {
        //     var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_all_menu/?bot_id=${userInfo[0].bot_id}&client_id=${userInfo[0].id}`)
        //     return response.data;
        // }
      
        async function makeRequest() {
            setIsLoading(true);
            try {
                await getProducts();
            } catch (e) {
                // console.log(e)
            }
            setIsLoading(false);
        }

        await makeRequest()
        navigate('OrderPage', { replace: false })
    }

    const repeatOrder = () => {
        if (goodsAmount.size > 0) {
            goodsAmount.clear()
        }
        for (let i = 0; i < goods.length; i++) {
            if (goods[i].option.length > 0) {
                var key = `${goods[i].product_id}`;
                for (let j = 0; j < goods[i].option.length; j++) {
                    let find = false;
                    for (let k = 0; k < goods[i].product.options[j].options.length && !find; k++) {
                        if (goods[i].option[j].options[0].name === goods[i].product.options[j].options[k].name) {
                            key += `_${k}`;
                            find = true;
                        }
                    }
                }
                goodsAmount.set(key, goods[i].count);
            } else {
                goodsAmount.set(`${goods[i].product_id}`, goods[i].count);
            }
        }
        navigate('../../Cart', {replace: false})
    }

    var goods = goodsGlobal.get(order.id)

    console.log(goods)

    return (
        <div>
            {isLoading ? (
                <div className='loadScreen'>
                    <ReactLoading type="bubbles" color="#419FD9"
                        height={100} width={50} />
                </div>
            ) : (
                <div className='orderCard'>
                    <div className='firstOrderLine' onClick={() => openOrder()}>
                        <div className='orderDate'>{new Date(order.start_time+'Z').toLocaleDateString(undefined, {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'})}</div>
                            <div className='orderNum'>{'#' + order.id}</div>
                            <div className='orderStatus'>{statuses.get(order.status)}</div>
                        {/* <div className='orderCost'>{order.sum + '₽'}</div> */}
                    </div>
                    <div className='lightText' onClick={() => openOrder()}>{order.delivery_type === 'pickup' ? "Самовывоз" : "Доставка"}</div>
                    {
                        goods.map(item => (
                            <div onClick={() => openOrder()}>
                                <div className='promoLine'>
                                {typeof item.product !== 'undefined' && item.product !== null ? (
                                    <div className='prodValue'>{item.count} x {item.product.name}</div>
                                    ) : (
                                    <div className='prodValue'>{item.count} x</div>
                                )}
                                    <div className='priceValue'>{item.price}</div>
                                </div>
                                {typeof item.option !== 'undefined' ?
                                    item.option.length > 0 ? (
                                        item.option.map(prod => (
                                            <div className='optionText'>{prod.options[0].name}</div>
                                        ))
                                    ) : (
                                        <div></div>
                                    ) : (
                                        <div></div>
                                    )
                                }
                                <hr className="solidOrder"></hr>
                            </div>
                        ))
                    }
                    <button className='repeat-another' onClick={() => repeatOrder()}>Повторить заказ</button>
                </div>
            )}
        </div>
    );
};

export default OrderCard;