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
import { GeoObject, Map, YMaps } from '@pbe/react-yandex-maps'

const Contacts = () => {

    const [appState, setAppState] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [coordinates, setCoordinates] = useState([55.751574, 37.573856])

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

        async function contactsAddress() {
            try {
                const response = await axios.get(
                    `https://geocode-maps.yandex.ru/1.x/?apikey=97e17441-c27d-4020-9b23-0b815499d385&geocode=${contacts[0].shop_address}&format=json`,
                    { withCredentials: false }
                )
    
                if (
                    response.data &&
                    response.data.response.GeoObjectCollection.featureMember.length > 0
                ) {
                    const coords =
                        response.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
                            .split(' ')
                            .map(Number)
                    setCoordinates([coords[1], coords[0]])
                }
            } catch (error) {
                console.error('Failed to fetch coordinates:', error)
            }
        }

        async function getUser() {
            var response  = await axios.get(`https://market-bot.org:8082/clients_api/user/get_user/?bot_id=${botId}&client_tg_id=${user.id}`)
            userInfo = response.data
            setAppState(response);
            if (response.status === 200) {
              await getMenu();
              await getContacts();
              await getBotInfo();
              await getBanners();
            }
        }

        async function getMenu() {
            var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_all_menu/?bot_id=${botId}&client_id=${userInfo[0].id}`)
            products = response.data
            categories = []
            await getCategories();
            var favList = await getFavoritesProducts();
            var stickers = await getStickers();
            for (let i = 0; i < products.length; i++) {
              if (products[i].category_name === null) {
                if (!categories.includes('Без категории')) {
                categories.push('Без категории')
                }
                products[i].category_name = 'Без категории'
              } 
              for (var j = 0; j < 3 && message === ""; j++) {
                var photo = await getPhoto(products[i].id, j)
                products[i].photoFile.push(photo);
              }
              if (favList.includes(products[i].id)) {
                products[i].like = true;
              } else {
                products[i].like = false;
              }
              if (stickers.includes(products[i].id)) {
                products[i].stickers = stickers.get(products[i].id);
              }
              products[i].photoFile = photo;
            }
            setAppState(response);
        }

        async function getFavoritesProducts() {
          try {
            var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_favorite_products/?client_id=${userInfo[0].id}&bot_id=${botId}`)
            // console.log(1)
            var favs = []
            for (let i = 0; i < response.data.favorite_products.length; i++) {
              favs.push(response.data.favorite_products[i].id);
            }
            return favs;
          } catch (e) {
            // console.log(e)
          }
        }

        async function getStickers() {
            try {
              var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_sticker_products_by_bot/${botId}`)
              // console.log(1)
              return response.data
            } catch (e) {
              // console.log(e)
            }
        }

        async function getCategories() {
          try {
            var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_category/${botId}`)
            var tmp = new Map()
            if (response.status === 200) {
              for (let i = 0; i < response.data.categories.length; i++) {
                if (response.data.categories[i].position === i + 1) {
                  if (!categories.includes(response.data.categories[i].name)) {
                    categories.push(response.data.categories[i].name);
                  }
                } else {
                  tmp.set(response.data.categories[i].position, response.data.categories[i].name);
                  var current = tmp.get(i + 1)
                  if (typeof current !== "undefined" && current !== null && current !== "") {
                    if (!categories.includes(current)) {
                      categories.push(current);
                    }
                  }
                }
              }
          }
          } catch (e) {
            // console.log(e)
          }
        }
      
        async function getPhoto(prodId, photoNumber) {
          try {
            var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_photo?bot_id=${botId}&product_id=${prodId}&photo_number=${photoNumber}`, {responseType: 'blob'})
            // console.log(1)
            return URL.createObjectURL(response.data)
          } catch (e) {
            // console.log(e)
          }
        }
      
        async function getContacts() {
            var response  = await axios.get(`https://market-bot.org:8082/clients_api/info/get_contacts/?bot_id=${botId}&client_id=${userInfo[0].id}`)
            contacts = response.data[0]
            setAppState(response);
        }

        async function getBotInfo() {
          try {
            var response  = await axios.get(`https://market-bot.org:8082/clients_api/info/get_bot_info?bot_id=${botId}`)
            userInfo[0].haveDelivery = response.data.have_delivery;
            userInfo[0].limit_bonuses = response.data.limit_bonuses;
            userInfo[0].cashback = response.data.cashback;
            userInfo[0].delivery_cost = response.data.delivery_cost;
          } catch (e) {
            // console.log(e)
          }
        }
    
        async function getBanners() {
          try {
            var response  = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_banners/?bot_id=${botId}&client_id=${userInfo[0].id}`)
            banners = response.data.banners;
            for (let i = 0; i < banners.length; i++) {
              var photo = await getBannerPhoto(banners[i].banner_id)
              banners[i].photoFile = photo;
            }
          } catch (e) {
            // console.log(e)
          }
        }
    
        async function getBannerPhoto(bannerId) {
          try {
            var response  = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_banner_photo?banner_id=${bannerId}`, {responseType: 'blob'})
            return URL.createObjectURL(response.data)
          } catch (e) {
            // console.log(e)
          }
        }
    
        async function makeRequest() {
          setIsLoading(true);
          try {
            if (userInfo[0].id === 1) {
                await getUser();
            }
            await contactsAddress();
          } catch (e) {
            // console.log(e)
          }          
          setIsLoading(false);
        }
    
        makeRequest()
    }, [setAppState]);

    const isValidCoordinates =
        coordinates.length === 2 && !isNaN(coordinates[0]) && !isNaN(coordinates[1])

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
                    <div className='mapShop'>
                    {
                      contacts.length > 0 ?
                            contacts[0].shop_address === null || contacts[0].shop_address === "" ? (
                            <div></div>
                            ) : (
                              <YMaps query={{ apikey: '30a63ef2-9728-4aa2-b1f8-c8b716d577a8' }}>
                                <Map
                                  state={{
                                    center: isValidCoordinates ? coordinates : [55.751574, 37.573856],
                                    zoom: 14
                                  }}
                                  width='99%'
                                  height='300px'
                                >
                                            {isValidCoordinates && (
                                    <GeoObject
                                      geometry={{
                                                        type: "Point",
                                                        coordinates: coordinates
                                                    }}
                                    />
                                  )}
                                </Map>
                              </YMaps>
                            ) : (
                              <div></div>
                            )
                    }
                        
                    </div>
                    {
                        contacts.length > 0 ?
                            contacts[0].shop_address === null || contacts[0].shop_address === "" ? (
                                <div></div>
                            ) : (
                                <div className='contactsMainHeader'>{contacts[0].shop_address}</div>
                            ) : (
                                <div></div>
                            )
                    }
                    <p className='contactsSubHeader'>Контактная информация</p>
                    <div className='profileCard'>
                        { contacts.length > 0 ?
                            contacts[0].shop_phone === null || contacts[0].shop_phone === "" ? (
                            <div></div>
                            ) : (
                                <div>
                                    <div className='profileLine'>
                                        <div className='profileTitle'>{'Телефон'}</div>
                                        <div className='profileInfo'>{contacts[0].shop_phone}</div>
                                    </div>
                                    {contacts[0].shop_email === null || contacts[0].shop_email === "" ? (
                                        <div></div>
                                    ): (
                                        <hr className="solid"></hr>
                                    )}   
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
                                    <div className='profileLine'>
                                        <div className='profileTitle'>{'Email'}</div>
                                        <a className='contactLink' href={"mailto:" + contacts[0].shop_email} target="_blank" rel="noopener">{contacts[0].shop_email}</a>
                                    </div>
                                    {contacts[0].shop_tg === null || contacts[0].shop_tg === "" ? (
                                        <div></div>
                                    ): (
                                        <hr className="solid"></hr>
                                    )}   
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
                                    <div className='profileLine'>
                                        <div className='profileTitle'>{'Telegram'}</div>
                                        <a className='contactLink' href={"https://telegram.org/" + contacts[0].shop_tg} target="_blank" rel="noopener">@{contacts[0].shop_tg}</a>
                                    </div>
                                    {contacts[0].shop_vk === null || contacts[0].shop_vk === "" ? (
                                        <div></div>
                                    ): (
                                        <hr className="solid"></hr>
                                    )}     
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
                                    <div className='profileLine'>
                                        <div className='profileTitle'>{'Вконтакте'}</div>
                                        <a className='contactLink' href={"https://vk.com/" + contacts[0].shop_vk} target="_blank" rel="noopener">@{contacts[0].shop_vk}</a>
                                    </div>
                                    {contacts[0].shop_site === null || contacts[0].shop_site === "" ? (
                                        <div></div>
                                    ): (
                                        <hr className="solid"></hr>
                                    )}                                    
                                </div>
                            ) : (
                                <div></div>
                            )
                        }
                        { contacts.length > 0 ?
                            contacts[0].shop_site === null || contacts[0].shop_site === "" ? (
                            <div></div>
                            ) : (
                                <div className='profileLine'>
                                    <div className='profileTitle'>{'Веб-сайт'}</div>
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
                    <p className='contactsSubHeader'>Приём заказов осуществляется</p>
                    { contacts.length > 0 ? (
                        <div className='profileCard'>
                            {
                                [...Array.from(contacts[0].worktime.keys())].map(key => (
                                    <div>
                                        <div className='profileLine'>
                                            <div className='profileTitle'>{key}</div>
                                            <div className='profileInfo'>{contacts[0].worktime.get(key)}</div>
                                        </div>
                                        {key === "Воскресенье" ? (
                                            <div></div>
                                        ): (
                                            <hr className="solid"></hr>
                                        )}
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
                )
            }
        </div>
    )
}

export default Contacts;