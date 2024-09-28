import React, { useEffect, useState } from 'react'
import { useTelegram } from '../../hooks/useTelegram';
import './Profile.css'
import OtherHeader from '../OtherHeader/OtherHeader';
import { useNavigate } from 'react-router-dom';
import { userInfo } from '../TestData/user.jsx';
import axios from 'axios';
import ReactLoading from "react-loading";
import { categories, products } from '../TestData/prod.jsx';
import OrderCard, { goodsGlobal } from './OrderCard/OrderCard.jsx';

export var orders = []
export var contacts = []
var newOrderId1 = -1

const Profile = () => {
    const {tg, user} = useTelegram();
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
  
    // botId = 60
    // let userId = 649105595

    useEffect(() => {
    
        async function getOrders() {
          var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_orders/get_orders?bot_id=${userInfo[0].bot_id}&client_id=${userInfo[0].id}`)
          // console.log(1)
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
            await getProducts(orders[i].id, first);
          }
          setAppState(response);
        }

        async function getProducts(id, first) {
          var response  = await axios.get(`https://market-bot.org:8082/clients_api/clients_orders/get_orders?bot_id=${userInfo[0].bot_id}&client_id=${userInfo[0].id}&order_id=${id}`)
          // console.log(1)
          var thisGoods = await getCart(response.data[0].cart_id);
          // for (let i = 0; i < thisGoods.length; i++) {
          //     thisGoods[i].review = await getReviews(thisGoods[i].product_id)
          //     thisGoods[i].photoFile = await getPhoto(thisGoods[i].product_id)
          // }
          if (first) {
            if (typeof thisGoods[0].product !== 'undefined') {
              var photo = await getPhoto(userInfo[0].bot_id, thisGoods[0].product.id, 0)
              thisGoods[0].product.photoFile = photo;
            }
          }
          goodsGlobal.set(id, thisGoods);
        }
  
        async function getCart(cartId) {
            var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_carts?client_id=${userInfo[0].id}&cart_id=${cartId}`)
            // console.log(1)
            return response.data.data[0].products;
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
                var photo = await getPhoto(botId, products[i].id, j)
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
      
        async function getPhoto(botId, prodId, photoNumber) {
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
            while (contacts.length > 0) {
              contacts.pop()
            }
            contacts.push(response.data[0])
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
            await getOrders();
          } catch (e) {
            console.log(e)
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