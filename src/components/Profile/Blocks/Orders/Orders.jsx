import React, { useEffect, useState } from 'react'
import '../Blocks.css'
import OtherHeader from '../../../OtherHeader/OtherHeader';
import { useNavigate } from 'react-router-dom';
import OrderCard from '../../OrderCard/OrderCard';
import { orders } from '../../Profile.jsx';
import { userInfo } from '../../../TestData/user.jsx';
import ReactLoading from "react-loading";
import { useTelegram } from '../../../../hooks/useTelegram.js';
import { ordersTest } from '../../../TestData/prod.jsx';
import OrdersService from '../../../../services/OrdersService.js';
import StartService from '../../../../services/StartService.js';

const Orders = () => {
    let navigate = useNavigate();

    const [appState, setAppState] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const {tg} = useTelegram(); 

    useEffect(() => {
      tg.ready();
    }, [])
  
    let botId = 0;
    botId = window.Telegram.WebApp.initDataUnsafe.start_param; //by direct link
    if (typeof botId === 'undefined') {
      let params = new URL(document.location.toString()).searchParams;
      botId = params.get("bot_id"); //by inline button
    }

    useEffect(() => {    
        async function makeRequest() {
          setIsLoading(true);
          try {
            if (userInfo[0].id === 1) {
                await StartService.getUser(botId);
            }
            if (orders.length === 0) {
                var response = await OrdersService.getOrders();
                setAppState(response);
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
                             profile={false}
                            />
                        ))}
                    </div>
        else if (ordersTest.length !== 0)
            return  <div className='ordersBlock'>
                        {ordersTest.map(item => (
                            <OrderCard
                             order={item}
                             profile={false}
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