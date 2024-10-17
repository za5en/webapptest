import React, { useEffect, useState } from 'react'
import { useTelegram } from '../../hooks/useTelegram';
import './Profile.css'
import OtherHeader from '../OtherHeader/OtherHeader';
import { useNavigate } from 'react-router-dom';
import { userInfo } from '../TestData/user.jsx';
import axios from 'axios';
import ReactLoading from "react-loading";
import OrderCard, { goodsGlobal } from './OrderCard/OrderCard.jsx';
import { config } from '../../api.js';
import StartService from '../../services/StartService.js';
import OrdersService from '../../services/OrdersService.js';

export var orders = []
export var contacts = []
var newOrderId1 = -1

const Profile = () => {
    const {tg, user, tokenString} = useTelegram();
    let navigate = useNavigate();

    const [appState, setAppState] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [newOrderId, setNewOrderId] = useState(-1);
    const [newOrderIndex, setNewOrderIndex] = useState(-1);

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
    
        async function getOrders() {
          var response = await OrdersService.getOrdersNoSort();
          orders = response.data
          orders.sort((a, b) => a.id < b.id ? 1 : -1);
          newOrderId1 = -1
          var first = true;
          for (let i = 0; i < orders.length; i++) {
            if (first && i > 0) {
              first = false;
            }
            if (orders[i].status === 'new' && orders[i].id > newOrderId1) {
              setNewOrderId(orders[i].id);
              newOrderId1 = orders[i].id;
              setNewOrderIndex(i);
            }
            await OrdersService.getProductsWPhoto(orders[i].id, first);
          }
          setAppState(response);
        }
    
        async function makeRequest() {
          setIsLoading(true);
          try {
            if (userInfo[0].id === 1) {
                await StartService.getUser(botId);
            }
            await getOrders();
          } catch (e) {
            // console.log(e)
          }          
          setIsLoading(false);
        }
    
        makeRequest()
    }, [setAppState]);
      
    return (
        <div>
            {
            isLoading ? (
                <div className='loadScreen'>
                    <ReactLoading type="bubbles" color="#419FD9"
                        height={100} width={50} />
                </div>
            ) : (
                <div>
                    <OtherHeader />
                    <div className='user'>
                        {/* <img src={user?.photo_url ?? Avatar} className='avatar' /> */}
                        <span className='usernameProfile'>
                            {user?.first_name ?? 'Username'} {user?.last_name}
                        </span>
                    </div>
                    {
                      newOrderId !== -1 && newOrderIndex !== -1 ? (
                        <OrderCard
                          order={orders[newOrderIndex]}
                          profile={true}
                        />
                      ) : (
                        <div></div>
                      )
                    }
                    <div className='block' onClick={() => navigate('Info', { replace: false })}>Мой профиль &gt;</div>
                    <div className='block' onClick={() => navigate('Orders', { replace: false })}>Заказы &gt;</div>
                    {/* <div className='block' onClick={() => navigate('Promo', { replace: false })}>Акции &gt;</div> */}
                    <div className='block' onClick={() => navigate('Favorites', { replace: false })}>Избранное &gt;</div>
                    <div className='block' onClick={() => navigate('Contacts', { replace: false })}>Контакты продавца &gt;</div>
                    <div className='block' onClick={() => navigate('Support', { replace: false })}>Техническая поддержка &gt;</div>
                </div>
                )
            }
        </div>
    )
}

export default Profile;