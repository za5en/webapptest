import React, { useEffect, useState } from 'react'
import '../Blocks.css'
import './Info.css'
import OtherHeader from '../../../OtherHeader/OtherHeader';
import { contacts } from '../../Profile.jsx';
// import axios from 'axios';
// import { userInfo } from '../../../TestData/user.jsx';
import ReactLoading from "react-loading";
import { userInfo } from '../../../TestData/user.jsx';
// import { useTelegram } from '../../../../hooks/useTelegram.js';
// import { categories, products } from '../../../TestData/prod.jsx';

const Info = () => {

    // const [appState, setAppState] = useState();
    const [isLoading, setIsLoading] = useState(false);

    // const {tg, user} = useTelegram(); 

    // useEffect(() => {
    //   tg.ready();
    // }, [])
  
    // let botId = 0;
    // botId = window.Telegram.WebApp.initDataUnsafe.start_param; //by direct link
    // if (typeof botId === 'undefined') {
    //   let params = new URL(document.location.toString()).searchParams;
    //   botId = params.get("bot_id"); //by inline button
    // }
  
    // botId = 60
    // let userId = 649105595

    // useEffect(() => {

    //     async function getUser() {
    //         var response  = await axios.get(`https://market-bot.org:8082/clients_api/user/get_user/?bot_id=${botId}&client_tg_id=${user.id}`)
    //         userInfo = response.data
    //         setAppState(response);
    //         if (response.status === 200) {
    //           await getMenu();
    //           await getContacts();
    //         }
    //     }

    //     async function getMenu() {
    //         var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_all_menu/?bot_id=${botId}&client_id=${userInfo[0].id}`)
    //         products = response.data
    //         categories = []
    //         for (let i = 0; i < products.length; i++) {
    //           if (!categories.includes(products[i].category) && !products[i].it_hidden) {
    //             categories.push(products[i].category)
    //           }
    //           var photo = await getPhoto(products[i].id)
    //           products[i].like = false;
    //           products[i].photoFile = photo;
    //         }
    //         setAppState(response);
    //     }
      
    //     async function getPhoto(prodId) {
    //         var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_photo?bot_id=${botId}&product_id=${prodId}`, {responseType: 'blob'})
    //         return URL.createObjectURL(response.data)
    //     }
      
    //     async function getContacts() {
    //         var response  = await axios.get(`https://market-bot.org:8082/clients_api/info/get_contacts/?bot_id=${botId}&client_id=${userInfo[0].id}`)
    //         contacts = response.data[0]
    //         setAppState(response);
    //     }
    
    //     async function makeRequest() {
    //       setIsLoading(true);
    //       try {
    //         if (userInfo[0].id === 1) {
    //             await getUser();
    //         }
    //       } catch (e) {
    //         // console.log(e)
    //       }          
    //       setIsLoading(false);
    //     }
    
    //     makeRequest()
    // }, [setAppState]);

    // if (contacts.length > 0 && contacts[0].shop_vk.includes("/")) {
    //     contacts[0].shop_vk = contacts[0].shop_vk.substring(contacts[0].shop_vk.lastIndexOf("/") + 1)
    // }

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
                    <p className='name'>Мой профиль</p>
                    <div className='profileCard'>
                        { userInfo.length > 0 ?
                            userInfo[0].name === null || userInfo[0].name === "" ? (
                            <div></div>
                            ) : (
                                <div>
                                    <div className='profileLine'>
                                        <div className='profileTitle'>{'Имя'}</div>
                                        <div className='profileInfo'>{userInfo[0].name}</div>
                                    </div>
                                    <hr class="solid"></hr>
                                </div>
                            ) : (
                                <div></div>
                            )
                        }
                        { userInfo.length > 0 ?
                            userInfo[0].id === null || userInfo[0].id === "" ? (
                            <div></div>
                            ) : (
                                <div>
                                    <div className='profileLine'>
                                        <div className='profileTitle'>{'ID'}</div>
                                        <div className='profileInfo'>{userInfo[0].id}</div>
                                    </div>
                                    <hr class="solid"></hr>
                                </div>
                            ) : (
                                <div></div>
                            )
                        }
                        { userInfo.length > 0 ?
                            userInfo[0].phone === null || userInfo[0].phone === "" ? (
                            <div></div>
                            ) : (
                                <div>
                                <div className='profileLine'>
                                    <div className='profileTitle'>{'Телефон'}</div>
                                    <div className='profileInfo'>{userInfo[0].phone}</div>
                                </div>
                                <hr class="solid"></hr>
                                </div>
                            ) : (
                                <div></div>
                            )
                        }
                        { userInfo.length > 0 ?
                            userInfo[0].invites_num === null || userInfo[0].invites_num === "" ? (
                            <div></div>
                            ) : (
                                <div>
                                    <div className='profileLine'>
                                        <div className='profileTitle'>{'Приглашено друзей'}</div>
                                        <div className='profileInfo'>{userInfo[0].invites_num}</div>
                                    </div>
                                    <hr class="solid"></hr>
                                </div>
                            ) : (
                                <div></div>
                            )
                        }
                        { userInfo.length > 0 ?
                            userInfo[0].orders_count === null || userInfo[0].orders_count === "" ? (
                            <div></div>
                            ) : (
                                <div>
                                    <div className='profileLine'>
                                        <div className='profileTitle'>{'Количество заказов'}</div>
                                        <div className='profileInfo'>{userInfo[0].orders_count}</div>
                                    </div>
                                    <hr class="solid"></hr>
                                </div>
                            ) : (
                                <div></div>
                            )
                        }
                        { userInfo.length > 0 ?
                            userInfo[0].bonus_points === null || userInfo[0].bonus_points === "" ? (
                            <div></div>
                            ) : (
                                <div>
                                <div className='profileLine'>
                                    <div className='profileTitle'>{'Бонусные баллы'}</div>
                                    <div className='profileInfo'>{userInfo[0].bonus_points}</div>
                                </div>
                                    <hr class="solid"></hr>
                                    </div>
                            ) : (
                                <div></div>
                            )
                        }
                        { userInfo.length > 0 ?
                            userInfo[0].register_date === null || userInfo[0].register_date === "" ? (
                            <div></div>
                            ) : (
                                <div className='profileLine'>
                                    <div className='profileTitle'>{'Дата регистрации'}</div>
                                    <div className='profileInfo'>{new Date(userInfo[0].register_date+'Z').toLocaleDateString(undefined, {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'})}</div>
                                </div>
                            ) : (
                                <div></div>
                            )
                        }
                    </div>
                </div>
                )
            }
        </div>
    )
}

export default Info;