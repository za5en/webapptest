import React, { useEffect, useState } from 'react'
import '../Blocks.css'
import './Contacts.css'
import OtherHeader from '../../../OtherHeader/OtherHeader';
import { contacts } from '../../Profile.jsx';
import axios from 'axios';
import { userInfo } from '../../../TestData/user.jsx';
import ReactLoading from "react-loading";
import { useTelegram } from '../../../../hooks/useTelegram.js';
import { categories, products } from '../../../TestData/prod.jsx';

const Contacts = () => {

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
            contacts = response.data[0]
            setAppState(response);
        }
    
        async function makeRequest() {
          setIsLoading(true);
          try {
            if (userInfo[0].id === 1) {
                await getUser();
            }
          } catch (e) {
            // console.log(e)
          }          
          setIsLoading(false);
        }
    
        makeRequest()
    }, [setAppState]);

    if (contacts.length > 0 && contacts[0].shop_vk.includes("/")) {
        contacts[0].shop_vk = contacts[0].shop_vk.substring(contacts[0].shop_vk.lastIndexOf("/") + 1)
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
                    <p className='name'>Контактная информация</p>
                    <div className='contactsCard'>
                        { contacts.length > 0 ?
                            contacts[0].shop_address === null || contacts[0].shop_address === "" ? (
                            <div></div>
                            ) : (
                                <div>
                                    <div className='contactsTitle'>{'Адрес:'}</div>
                                    <div className='contactInfo'>{contacts[0].shop_address}</div>
                                </div>
                            ) : (
                                <div></div>
                            )
                        }
                        { contacts.length > 0 ?
                            contacts[0].shop_phone === null || contacts[0].shop_phone === "" ? (
                            <div></div>
                            ) : (
                                <div>
                                    <div className='contactsTitle'>{'Телефон:'}</div>
                                    <div className='contactInfo'>{contacts[0].shop_phone}</div>
                                </div>
                            ) : (
                                <div></div>
                            )
                        }
                        { contacts.length > 0 ?
                            contacts[0].shop_email === null || contacts[0].shop_email === "" ? (
                            <div></div>
                            ) : (
                                <div>
                                    <div className='contactsTitle'>{'Email:'}</div>
                                    <a className='contactLink' href={"mailto:" + contacts[0].shop_email} target="_blank" rel="noopener">{contacts[0].shop_email}</a>
                                </div>
                            ) : (
                                <div></div>
                            )
                        }
                        { contacts.length > 0 ?
                            contacts[0].shop_tg === null || contacts[0].shop_tg === "" ? (
                            <div></div>
                            ) : (
                                <div>
                                    <div className='contactsTitle'>{'Telegram:'}</div>
                                    <a className='contactLink' href={"https://telegram.org/" + contacts[0].shop_tg} target="_blank" rel="noopener">@{contacts[0].shop_tg}</a>
                                </div>
                            ) : (
                                <div></div>
                            )
                        }
                        {/* <div>
                            <div className='orderNum'>{'IG:'}</div>
                            <a className='contactLink' href="https://www.instagram.com/" target="_blank" rel="noopener">{'@shop'}</a>
                        </div> */}
                        { contacts.length > 0 ?
                            contacts[0].shop_vk === null || contacts[0].shop_vk === "" ? (
                            <div></div>
                            ) : (
                                <div>
                                    <div className='contactsTitle'>{'Вконтакте:'}</div>
                                    <a className='contactLink' href={"https://vk.com/" + contacts[0].shop_vk} target="_blank" rel="noopener">@{contacts[0].shop_vk}</a>
                                </div>
                            ) : (
                                <div></div>
                            )
                        }
                        { contacts.length > 0 ?
                            contacts[0].shop_site === null || contacts[0].shop_site === "" ? (
                            <div></div>
                            ) : (
                                <div>
                                    <div className='contactsTitle'>{'Веб-сайт:'}</div>
                                    <a className='contactLink' href={contacts[0].shop_site} target="_blank" rel="noopener">{contacts[0].shop_site}</a>
                                </div>
                            ) : (
                                <div></div>
                            )
                        }
                        {/* <div className='firstOrderLine'>
                            <a className='policyLink' href="http://market-bot.org/" target="_blank" rel="noopener">{'Политика конфиденциальности'}</a>
                        </div> */}
                    </div>
                </div>
                )
            }
        </div>
    )
}

export default Contacts;