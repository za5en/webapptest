import React, { useEffect, useState } from 'react'
import { useTelegram } from '../../hooks/useTelegram';
import './Profile.css'
// import Avatar from '../../assets/icons/avatar.svg';
import OtherHeader from '../OtherHeader/OtherHeader';
import { useNavigate } from 'react-router-dom';
import { userInfo } from '../TestData/user.jsx';
import axios from 'axios';

export var orders = []
export var contacts = []

const Profile = () => {
    const {user} = useTelegram();
    let navigate = useNavigate();

    const [appState, setAppState] = useState();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function getContacts() {
          var response  = await axios.get(`https://market-bot.org:8082/clients_api/info/get_contacts/?bot_id=${userInfo[0].bot_id}&client_id=${userInfo[0].id}`)
          contacts = response.data
          setAppState(response);
        }
    
        async function getOrders() {
          var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_orders/get_orders?bot_id=${userInfo[0].bot_id}&client_id=${userInfo[0].id}`)
          orders = response.data
          setAppState(response);
        }
    
        async function makeRequest() {
          setIsLoading(true);
          await getContacts();
          await getOrders();
          setIsLoading(false);
        }
    
        makeRequest()
    }, [setAppState]);
      
    return (
        <div>
            {
            isLoading ? (
                <div></div>
            ) : (
                <div>
                    <OtherHeader />
                    <div className='user'>
                        {/* <img src={user?.photo_url ?? Avatar} className='avatar' /> */}
                        <span className='usernameProfile'>
                            {user?.username ?? 'Username'}
                        </span>
                    </div>
                    <div className='block' onClick={() => navigate('Orders', { replace: false })}>Заказы &gt;</div>
                    {/* <div className='block' onClick={() => navigate('Promo', { replace: false })}>Акции &gt;</div> */}
                    <div className='block' onClick={() => navigate('Contacts', { replace: false })}>Контактная информация &gt;</div>
                    {/* <div className='block' onClick={() => navigate('Favorites', { replace: false })}>Избранное &gt;</div> */}
                </div>
                )
            }
        </div>
    )
}

export default Profile;