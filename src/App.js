import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { useTelegram } from './hooks/useTelegram';
import {Route, Routes} from 'react-router-dom';
import Products from './components/Products/Products';
import Profile from './components/Profile/Profile';
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
import { cartId } from './components/Cart/ConfirmOrder/ConfirmOrder.jsx';
import { products, categories } from './components/TestData/prod.jsx';
import axios from 'axios';

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

  botId = 44
  let userId = 649105595

  const [appState, setAppState] = useState();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    async function getUser() {
      var response  = await axios.get(`https://market-bot.org:8082/clients_api/user/get_user/?bot_id=${botId}&client_tg_id=${userId}`)
      userInfo = response.data
      setAppState(response);
      if (response.status === 200) {
        await getMenu()
        await createCart()
      }
    }

    async function getMenu() {
      var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_all_menu/?bot_id=${botId}&client_id=${userInfo[0].id}`)
      products = response.data
      categories = []
      for (let i = 0; i < products.length; i++) {
        if (!categories.includes(products[i].category)) {
          categories.push(products[i].category)
          var photo = await getPhoto(products[i].id)
          products[i].photoFile = photo;
        }
      }
      setAppState(response);
    }

    async function getPhoto(prodId) {
      var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_photo?bot_id=${botId}&product_id=${prodId}`, {responseType: 'blob'})
      return URL.createObjectURL(response.data)
    }

    async function createCart() {
      var response  = await axios.post(`https://market-bot.org:8082/clients_api/clients_menu/create_cart?client_id=${userInfo[0].id}`)
      cartId.length = 0
      cartId.push(response.data.data)
      setAppState(response);
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
          <div></div>
        ) : (
          <Routes>
            <Route index element={<Products />} />
            <Route path={'Profile'} element={<Profile />} />
            <Route path={'Profile/Favorites'} element={<Favorites />} />
            <Route path={'Profile/Orders'} element={<Orders />} />
            <Route path={'Profile/Orders/OrderPage'} element={<OrderPage />} />
            <Route path={'Profile/Promo'} element={<Promo />} />
            <Route path={'Profile/Contacts'} element={<Contacts />} />
            <Route path={'ProdInfo/:id/:type'} element={<ProdInfo />} />
            <Route path={'Cart'} element={<Cart />} />
            <Route path={'Cart/ConfirmOrder'} element={<ConfirmOrder />} />
            <Route path={'Feedback'} element={<Feedback />} />
          </Routes>
        )
      }
      
    </div>
  );
}

export default App;
