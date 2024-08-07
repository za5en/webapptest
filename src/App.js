import { useEffect } from 'react';
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
import { Helmet } from 'react-helmet';

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

  // useCallback(() => {
  //   fetch(`http://togethergame:8001/user/get_user?bot_id=${botId}&client_tg_id=${tg.user.id}`, {
  //       method: 'GET'
  //   })
  // }, [])

  let response = ''
//get user
  useEffect(() => {
      response = fetch(`http://togethergame:8001/user/get_user/?bot_id=${botId}&client_tg_id=${user.id}`)
          .then(response => response.json())
          .then(data => setTotalReactPackages(data.total));
  }, []);

  console.log(response);
   
  return (
    <div className="MarketBot">
      <Helmet>
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </Helmet>
            {/* <Header /> */}
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
      <footer>
        {/* <button>Купить</button> */}
      </footer>
    </div>
  );
}

export default App;
