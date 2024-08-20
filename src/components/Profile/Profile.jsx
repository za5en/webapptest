import React, { useEffect, useState } from 'react'
import { useTelegram } from '../../hooks/useTelegram';
import './Profile.css'
import OtherHeader from '../OtherHeader/OtherHeader';
import { useNavigate } from 'react-router-dom';
import { userInfo } from '../TestData/user.jsx';
import axios from 'axios';
import ReactLoading from "react-loading";
import { categories, products } from '../TestData/prod.jsx';

export var orders = []
export var contacts = []

const Profile = () => {
    const {tg, user} = useTelegram();
    let navigate = useNavigate();

    const [appState, setAppState] = useState();
    const [isLoading, setIsLoading] = useState(false);

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
          orders = response.data
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
                    <div className='block' onClick={() => navigate('Info', { replace: false })}>Мой профиль &gt;</div>
                    <div className='block' onClick={() => navigate('Orders', { replace: false })}>Заказы &gt;</div>
                    {/* <div className='block' onClick={() => navigate('Promo', { replace: false })}>Акции &gt;</div> */}
                    <div className='block' onClick={() => navigate('Contacts', { replace: false })}>Контакты продавца &gt;</div>
                    {/* <div className='block' onClick={() => navigate('Favorites', { replace: false })}>Избранное &gt;</div> */}
                    <div className='block' onClick={() => navigate('Support', { replace: false })}>Техническая поддержка &gt;</div>
                </div>
                )
            }
        </div>
    )
}

export default Profile;