import { Route, Routes } from "react-router-dom"
import Products from "../components/Products/Products"
import Profile from "../components/Profile/Profile"
import SearchPage from "../components/SearchPage/SearchPage"
import Favorites from "../components/Profile/Blocks/Favorites/Favorites"
import Orders from "../components/Profile/Blocks/Orders/Orders"
import OrderPage from "../components/Profile/OrderPage/OrderPage"
import Promo from "../components/Profile/Blocks/Promo/Promo"
import Info from "../components/Profile/Blocks/Info/Info"
import Contacts from "../components/Profile/Blocks/Contacts/Contacts"
import Support from "../components/Support/Support"
import CreateRequest from "../components/Support/CreateRequest"
import CheckRequest from "../components/Support/CheckRequest"
import ProdInfo from "../components/ProdInfo/ProdInfo"
import EditReview from "../components/EditReview/EditReview"
import Reviews from "../components/Reviews/Reviews"
import Cart from "../components/Cart/Cart"
import BannerPage from "../components/BannerPage/BannerPage"
import ConfirmOrder from "../components/Cart/ConfirmOrder/ConfirmOrder"
import PolicyPage from "../components/Cart/ConfirmOrder/PolicyPage"
import OrderConfirmed from "../components/Cart/ConfirmOrder/OrderConfirmed"
import Feedback from "../components/Feedback/Feedback"

export const AppRouter = () => {
    return (
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