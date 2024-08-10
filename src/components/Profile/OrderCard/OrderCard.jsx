import React, { useState } from 'react';
import './OrderCard.css'
import { useNavigate } from 'react-router-dom';
import { item } from '../OrderPage/OrderPage.jsx'
import { userInfo } from '../../TestData/user';
import axios from 'axios';

export var goodsOrder = new Map()

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
        item.length = 0
        item.push(order)
        
        async function getProducts() {
            var response  = await axios.get(`https://market-bot.org:8082/clients_api/clients_orders/delivery/get_variants?order_id=${item[0].id}`)
            goodsOrder = response.data
            for (let i = 0; i < goodsOrder.length; i++) {
              goodsOrder[i].review = await getReviews(goodsOrder[i].id)
              goodsOrder[i].photoFile = await getPhoto(goodsOrder[i].id)
            }
            setAppState(goodsOrder);
          }
      
          async function getReviews(prodId) {
            var review = []
            try {
                var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_reviews/?bot_id=${userInfo[0].bot_id}&client_id=${userInfo[0].id}&product_id=${prodId}`)
                if (response.status === 200) {
                  review = response.data[0]
                }
                setAppState(response);
            } catch (e) {
                console.log(e)
            }
            return review 
          }

          async function getPhoto(prodId) {
            var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_photo?bot_id=${userInfo[0].bot_id}&product_id=${prodId}`, {responseType: 'blob'})
            return URL.createObjectURL(response.data)
          }
      
          async function makeRequest() {
            setIsLoading(true);
            await getProducts();
            setIsLoading(false);
          }

        await makeRequest()
        navigate('OrderPage', { replace: false })
    }
    
    return (
        <div className='orderCard' onClick={() => openOrder()}>
            <div className='firstOrderLine'>
                <div className='orderNum'>{'Заказ №' + order.id}</div>
                <div className='orderCost'>{order.sum + '₽'}</div>
            </div>
            <div className='orderStatus'>{statuses.get(order.status)}</div>
            <div className='orderDate'>{new Date(order.start_time).toLocaleDateString(undefined, {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})}</div>
        </div>
    );
};

export default OrderCard;