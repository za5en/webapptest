import { useEffect, useState } from 'react';
import './App.css';
import { useTelegram } from './hooks/useTelegram';
import {Route, Routes} from 'react-router-dom';
import Products from './components/Products/Products';
import Profile, { contacts } from './components/Profile/Profile';
import Orders from './components/Profile/Blocks/Orders/Orders';
import Promo from './components/Profile/Blocks/Promo/Promo';
import Favorites from './components/Profile/Blocks/Favorites/Favorites';
import ProdInfo from './components/ProdInfo/ProdInfo';
import Cart from './components/Cart/Cart';
import ConfirmOrder from './components/Cart/ConfirmOrder/ConfirmOrder';
import OrderPage from './components/Profile/OrderPage/OrderPage';
import Feedback from './components/Feedback/Feedback';
import Contacts from './components/Profile/Blocks/Contacts/Contacts';
import { userInfo } from './components/TestData/user.jsx';
import { products, categories, banners, catNames, stickerInfo, stickerContent } from './components/TestData/prod.jsx';
import axios from 'axios';
import OrderConfirmed from './components/Cart/ConfirmOrder/OrderConfirmed.jsx';
import ReactLoading from "react-loading";
import BannerPage from './components/BannerPage/BannerPage.jsx';
import Reviews from './components/Reviews/Reviews.jsx';
import EditReview from './components/EditReview/EditReview.jsx';
import SearchPage from './components/SearchPage/SearchPage.jsx';
import Support from './components/Support/Support.jsx';
import CreateRequest from './components/Support/CreateRequest.jsx';
import CheckRequest from './components/Support/CheckRequest.jsx';
import Info from './components/Profile/Blocks/Info/Info.jsx';
import PolicyPage from './components/Cart/ConfirmOrder/PolicyPage.jsx';

function App() {
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

  botId = 77
  let userId = 649105595

  const [appState, setAppState] = useState();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    async function getUser() {
      try {
        var response  = await axios.get(`https://market-bot.org:8082/clients_api/user/get_user/?bot_id=${botId}&client_tg_id=${userId}`)
        userInfo = response.data
        setAppState(response);
        if (response.status === 200) {
          await getMenu();
          await getContacts();
          await getBotInfo();
          await getBanners();
          // await createCart()
        }
      } catch (e) {
        // console.log(e)
      }
    }

    async function getMenu() {
      try {
        var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_all_menu/?bot_id=${botId}&client_id=${userInfo[0].id}`)
        products = response.data
        // console.log(1)
        categories = []
        catNames = new Map()
        await getCategories();
        var favList = await getFavoritesProducts();
        var stickers = await getStickerProducts();

        if (typeof stickers !== 'undefined' && typeof stickers.sticker_products !== 'undefined') {
          for (let i = 0; i < stickers.sticker_products.length; i++) {
            var tmp = stickerInfo.get(stickers.sticker_products[i].product_id);
            if (typeof tmp === 'undefined') {
              tmp = [stickers.sticker_products[i].sticker_id];
              await getSticker(stickers.sticker_products[i].sticker_id);
            } else {
              if (!tmp.includes(stickers.sticker_products[i].sticker_id)) {
                tmp.push(stickers.sticker_products[i].sticker_id);
                await getSticker(stickers.sticker_products[i].sticker_id);
              }
            }
            stickerInfo.set(stickers.sticker_products[i].product_id, tmp);
          }
        }

        for (let i = 0; i < products.length; i++) {
          if (typeof products[i].category_id === 'undefined' || products[i].category_id === null) {
            if (!categories.includes('Без категории')) {
              categories.push('Без категории')
            }
            products[i].category_name = 'Без категории'
          } else {
            products[i].category_name = catNames.get(products[i].category_id)
          }
          // else if (products[i].category_name !== null && !categories.includes(products[i].category_name) && !products[i].it_hidden) {
          //   categories.push(products[i].category_name)
          // }
          products[i].photoFile = [];
          var ok = true;
          for (var j = 0; j < 3 && ok; j++) {
            var photo = await getPhoto(products[i].id, j)
            if (typeof photo === 'undefined') {
              ok = false;
            } else {
              products[i].photoFile.push(photo);
            }
          }
          if (typeof favList !== 'undefined') {
            if (favList.includes(products[i].id)) {
              products[i].like = true;
            } else {
              products[i].like = false;
            }
          }
        }
        setAppState(response);
      } catch (e) {
        // console.log(e)
      }
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

    async function getCategories() {
      try {
        var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_category/${botId}`)
        // console.log(1)
        var tmp = new Map()
        if (response.status === 200) {
          for (let i = 0; i < response.data.categories.length; i++) {
            if (response.data.categories[i].position === i + 1) {
              if (!categories.includes(response.data.categories[i].name)) {
                categories.push(response.data.categories[i].name);
                catNames.set(response.data.categories[i].id, response.data.categories[i].name);
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
        if (response.status === 200) {
          return URL.createObjectURL(response.data)
        } else {
          return null;
        }
      } catch (e) {
        // console.log(e)
      }
    }

    async function getContacts() {
      try {
        var response  = await axios.get(`https://market-bot.org:8082/clients_api/info/get_contacts/?bot_id=${botId}&client_id=${userInfo[0].id}`)
        // console.log(1)
        while (contacts.length > 0) {
          contacts.pop()
        }
        contacts.push(response.data[0])
        if (typeof contacts[0].schedule !== "undefined" && contacts[0].schedule !== null && contacts[0].schedule !== "") {
          contacts[0].worktime = new Map()
          var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
          var dayNames = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"]
          for (let i = 0; i < days.length; i++) {
            if (contacts[0].schedule.indexOf(days[i]) !== -1) {
              contacts[0].schedule = contacts[0].schedule.substring(contacts[0].schedule.indexOf(days[i]) + 5)
              var start = contacts[0].schedule.substring(contacts[0].schedule.indexOf("start") + 8, contacts[0].schedule.indexOf("start") + 13)
              var finish = contacts[0].schedule.substring(contacts[0].schedule.indexOf("finish") + 9, contacts[0].schedule.indexOf("finish") + 14)
              contacts[0].worktime.set(dayNames[i], `${start} - ${finish}`)
            } else {
              contacts[0].worktime.set(dayNames[i], "Выходной")
            }
          }
        }
        setAppState(response);
      } catch (e) {
        // console.log(e)
      }
    }

    async function getStickerProducts() {
      try {
        var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_sticker_products_by_bot/${botId}`)
        // console.log(1)
        return response.data
      } catch (e) {
        // console.log(e)
      }
    }

    async function getSticker(id) {
      try {
        var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_sticker/${id}`)
        stickerContent.set(id, response.data);
        // console.log(1)
        return response.data
      } catch (e) {
        // console.log(e)
      }
    }

    async function getBotInfo() {
      try {
        var response  = await axios.get(`https://market-bot.org:8082/clients_api/info/get_bot_info?bot_id=${botId}`)
        // console.log(1)
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
        // console.log(1)
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
        // console.log(1)
        return URL.createObjectURL(response.data)
      } catch (e) {
        // console.log(e)
      }
    }

    async function makeRequest() {
      setIsLoading(true);
      await getUser();
      setIsLoading(false);
    }

    makeRequest()
  }, [setAppState]);
   
  return (
    <div className="MarketBot">
      {
        isLoading ? (
          <div className='loadScreen'>
            <ReactLoading type="bubbles" color="#419FD9"
                    height={100} width={50} />
          </div>
        ) : (
          <Routes>
            <Route index element={<Products />} />
            <Route path={'Profile'} element={<Profile />} />
            <Route path={'Search'} element={<SearchPage />} />
            <Route path={'Profile/Favorites'} element={<Favorites />} />
            <Route path={'Profile/Orders'} element={<Orders />} />
            <Route path={'Profile/Orders/OrderPage'} element={<OrderPage />} />
            <Route path={'Profile/OrderPage'} element={<OrderPage />} />
            <Route path={'Profile/Promo'} element={<Promo />} />
            <Route path={'Profile/Info'} element={<Info />} />
            <Route path={'Profile/Contacts'} element={<Contacts />} />
            <Route path={'Profile/Support'} element={<Support />} />
            <Route path={'Profile/Support/CreateRequest'} element={<CreateRequest />} />
            <Route path={'Profile/Support/CheckRequest/:id'} element={<CheckRequest />} />
            <Route path={'ProdInfo/:id/:type'} element={<ProdInfo />} />
            <Route path={'ProdInfo/:id/:type/EditReview/:prodId/:revId'} element={<EditReview />} />
            <Route path={'ProdInfo/:id/:type/Reviews'} element={<Reviews />} />
            <Route path={'Cart'} element={<Cart />} />
            <Route path={'BannerPage/:id'} element={<BannerPage />} />
            <Route path={'Cart/ConfirmOrder'} element={<ConfirmOrder />} />
            <Route path={'Cart/ConfirmOrder/PolicyPage'} element={<PolicyPage />} />
            <Route path={'Cart/ConfirmOrder/OrderConfirmed/:type'} element={<OrderConfirmed />} />
            <Route path={'Profile/OrderPage/Feedback'} element={<Feedback />} />
            <Route path={'Profile/Orders/OrderPage/Feedback'} element={<Feedback />} />
          </Routes>
        )
      }
      
    </div>
  );
}

export default App;
