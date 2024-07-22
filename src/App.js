import { useEffect } from 'react';
import './App.css';
import { useTelegram } from './hooks/useTelegram';
// import Header from './components/Header/Header';
import {Route, Routes} from 'react-router-dom';
import Products from './components/Products/Products';
import Profile from './components/Profile/Profile';
import Orders from './components/Profile/Blocks/Orders/Orders';
import Promo from './components/Profile/Blocks/Promo/Promo';
import Favorites from './components/Profile/Blocks/Favorites/Favorites';
import ProdInfo from './components/ProdInfo/ProdInfo';
import Cart from './components/Cart/Cart';
import ConfirmOrder from './components/Cart/ConfirmOrder/ConfirmOrder';

function App() {
  const {tg} = useTelegram(); 

  useEffect(() => {
    tg.ready();
  }, [])

  return (
    <div className="MarketBot">
            {/* <Header /> */}
      <Routes>
        <Route index element={<Products />} />
        <Route path={'Profile'} element={<Profile />} />
        <Route path={'Profile/Favorites'} element={<Favorites />} />
        <Route path={'Profile/Orders'} element={<Orders />} />
        {/* <Route path={'Profile/Orders/OrderInfo/:id'} element={<OrderInfo />} /> */}
        <Route path={'Profile/Promo'} element={<Promo />} />
        <Route path={'ProdInfo/:id/:type'} element={<ProdInfo />} />
        <Route path={'Cart'} element={<Cart />} />
        <Route path={'Cart/ConfirmOrder'} element={<ConfirmOrder />} />
      </Routes>
      <footer>
        {/* <button>Купить</button> */}
      </footer>
    </div>
  );
}

export default App;
