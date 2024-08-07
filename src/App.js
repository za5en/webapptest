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

function App() {
  const {tg} = useTelegram(); 

  useEffect(() => {
    tg.ready();
  }, [])

  console.log(tg)
  console.log(tg.initDataUnsafe)
  console.log(window.Telegram.WebApp.initDataUnsafe.start_param)
  let params = new URL(document.location.toString()).searchParams;
  console.log(params)
  // console.log(params.get("name"))
  
  return (
    <div className="MarketBot">
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
