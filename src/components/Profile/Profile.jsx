import React, { useEffect, useState } from 'react'
import { useTelegram } from '../../hooks/useTelegram';
import './Profile.css'
import OtherHeader from '../OtherHeader/OtherHeader';
import { useNavigate } from 'react-router-dom';
import { userInfo } from '../TestData/user.jsx';
import axios from 'axios';
import ReactLoading from "react-loading";

export var orders = []
export var contacts = []

const Profile = () => {
    const {user} = useTelegram();
    let navigate = useNavigate();

    const [appState, setAppState] = useState();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
    
        async function getOrders() {
          var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_orders/get_orders?bot_id=${userInfo[0].bot_id}&client_id=${userInfo[0].id}`)
          orders = response.data
          setAppState(response);
        }
    
        async function makeRequest() {
          setIsLoading(true);
          try {
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
                            {user?.first_name ?? 'Username'}
                        </span>
                    </div>
                    <div className='block' onClick={() => navigate('Orders', { replace: false })}>Заказы &gt;</div>
                    {/* <div className='block' onClick={() => navigate('Promo', { replace: false })}>Акции &gt;</div> */}
                    <div className='block' onClick={() => navigate('Contacts', { replace: false })}>Контакты продавца &gt;</div>
                    {/* <div className='block' onClick={() => navigate('Favorites', { replace: false })}>Избранное &gt;</div> */}
                </div>
                )
            }
        </div>
    )
}

export default Profile;