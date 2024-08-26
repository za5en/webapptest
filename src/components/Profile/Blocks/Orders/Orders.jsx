import React, { useEffect, useState } from 'react'
import '../Blocks.css'
import OtherHeader from '../../../OtherHeader/OtherHeader';
import { useNavigate } from 'react-router-dom';
import OrderCard, { goodsGlobal } from '../../OrderCard/OrderCard';
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
            ordersTest.sort((a, b) => a.id < b.id ? 1 : -1);
            for (let i = 0; i < ordersTest.length; i++) {
                await getProducts(ordersTest[i].id);
            }
            setAppState(response);
        }

        async function getProducts(id) {
            var response  = await axios.get(`https://market-bot.org:8082/clients_api/clients_orders/get_orders?bot_id=${userInfo[0].bot_id}&client_id=${userInfo[0].id}&order_id=${id}`)
            var thisGoods = await getCart(response.data[0].cart_id);
            // for (let i = 0; i < thisGoods.length; i++) {
            //     thisGoods[i].review = await getReviews(thisGoods[i].product_id)
            //     thisGoods[i].photoFile = await getPhoto(thisGoods[i].product_id)
            // }
            goodsGlobal.set(id, thisGoods);
        }
    
        async function getCart(cartId) {
            var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_carts?client_id=${userInfo[0].id}&cart_id=${cartId}`)
            return response.data.data[0].products;
        }
    
        // async function getReviews(prodId) {
        //     var review = []
        //     try {
        //         var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_reviews/?bot_id=${userInfo[0].bot_id}&client_id=${userInfo[0].id}&product_id=${prodId}`)
        //         if (response.status === 200) {
        //             for (let i = 0; i < response.data.length; i++) {
        //                 if (response.data[i].reviewer_id === userInfo[0].id) {
        //                     review = response.data[i]
        //                 }
        //             }
        //         }
        //         setAppState(response);
        //     } catch (e) {
        //         // console.log(e)
        //     }
        //     return review 
        // }
    
        // async function getPhoto(prodId) {
        //     var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_photo?bot_id=${userInfo[0].bot_id}&product_id=${prodId}`, {responseType: 'blob'})
        //     return URL.createObjectURL(response.data)
        // }

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
            for (let i = 0; i < products.length; i++) {
              if (products[i].category_name === null) {
                if (!categories.includes('Без категории')) {
                  categories.push('Без категории')
                }
                products[i].category_name = 'Без категории'
              } 
              var photo = await getPhoto(products[i].id)
              products[i].like = false;
              products[i].photoFile = photo;
            }
            setAppState(response);
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