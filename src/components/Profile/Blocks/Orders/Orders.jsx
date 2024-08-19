import React, { useEffect, useState } from 'react'
import '../Blocks.css'
import OtherHeader from '../../../OtherHeader/OtherHeader';
import { useNavigate } from 'react-router-dom';
import OrderCard from '../../OrderCard/OrderCard';
import { contacts, orders } from '../../Profile.jsx';
import axios from 'axios';
import { userInfo } from '../../../TestData/user.jsx';
import ReactLoading from "react-loading";
import { useTelegram } from '../../../../hooks/useTelegram.js';
import { categories, products } from '../../../TestData/prod.jsx';

var ordersTest = []

const Orders = () => {
    let navigate = useNavigate();

    const [appState, setAppState] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const {tg, user} = useTelegram(); 

    useEffect(() => {
      tg.ready();
    }, [])
  
    let botId = 0;
    botId = window.Telegram.WebApp.initDataUnsafe.start_param; //by direct link
    if (typeof botId === 'undefined') {
      let params = new URL(document.location.toString()).searchParams;
      botId = params.get("bot_id"); //by inline button
    }
  
    // botId = 60
    // let userId = 649105595

    useEffect(() => {
    
        async function getOrders() {
            var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_orders/get_orders?bot_id=${userInfo[0].bot_id}&client_id=${userInfo[0].id}`)
            ordersTest = response.data
            console.log(response.data)
            setAppState(response);
        }

        async function getUser() {
            var response  = await axios.get(`https://market-bot.org:8082/clients_api/user/get_user/?bot_id=${botId}&client_tg_id=${user.id}`)
            userInfo = response.data
            setAppState(response);
            if (response.status === 200) {
              await getMenu();
              await getContacts();
            }
        }

        async function getMenu() {
            var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_all_menu/?bot_id=${botId}&client_id=${userInfo[0].id}`)
            products = response.data
            categories = []
            for (let i = 0; i < products.length; i++) {
              if (!categories.includes(products[i].category) && !products[i].it_hidden) {
                categories.push(products[i].category)
              }
              var photo = await getPhoto(products[i].id)
              products[i].like = false;
              products[i].photoFile = photo;
            }
            setAppState(response);
        }
      
        async function getPhoto(prodId) {
            var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_photo?bot_id=${botId}&product_id=${prodId}`, {responseType: 'blob'})
            return URL.createObjectURL(response.data)
        }
      
        async function getContacts() {
            var response  = await axios.get(`https://market-bot.org:8082/clients_api/info/get_contacts/?bot_id=${botId}&client_id=${userInfo[0].id}`)
            while (contacts.length > 0) {
              contacts.pop()
            }
            contacts.push(response.data[0])
            setAppState(response);
        }
    
        async function makeRequest() {
          setIsLoading(true);
          try {
            if (userInfo[0].id === 1) {
                await getUser();
            }
            if (orders.length === 0) {
                await getOrders();
            }
          } catch (e) {
            // console.log(e)
          }          
          setIsLoading(false);
        }
    
        makeRequest()
    }, [setAppState]);

    function Orders() {
        if (orders.length !== 0)
            return  <div className='ordersBlock'>
                        {orders.map(item => (
                            <OrderCard
                             order={item}
                            />
                        ))}
                    </div>
        else if (ordersTest.length !== 0)
            return  <div className='ordersBlock'>
                        {ordersTest.map(item => (
                            <OrderCard
                             order={item}
                            />
                        ))}
                    </div>
        else
            return  <div>
                        <div className='nullEdited'>Заказов пока нет</div>
                        <button className='shop-btn' onClick={() => navigate(-2)}>К списку товаров</button>
                    </div>;
    }

    return (
        <div>
            <OtherHeader />
            {
            isLoading ? (
                    <div className='loadScreen'>
                        <ReactLoading type="bubbles" color="#419FD9"
                            height={100} width={50} />
                    </div>
                ) : (
                <div className='blocks'>
                    <p className='name'>Заказы</p>
                    <Orders />
                </div>
                )
            }
        </div>
    )
}

export default Orders;