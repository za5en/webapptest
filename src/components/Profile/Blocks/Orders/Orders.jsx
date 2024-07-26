import React from 'react'
import '../Blocks.css'
import OtherHeader from '../../../OtherHeader/OtherHeader';
import { useNavigate } from 'react-router-dom';
import OrderCard from '../../OrderCard/OrderCard';

const Orders = () => {
    let navigate = useNavigate();
    let orders = []

    function Orders() {
        if (orders.length === 0)
            return  <div>
                        <div className='nullEdited'>Заказов пока нет</div>
                        <button className='shop-btn' onClick={() => navigate(-2)}>К списку товаров</button>
                    </div>;
        else
            return  <div>
                        {orders.map(item => (
                            <OrderCard />
                        ))}
                    </div>
    }

    return (
        <div>
            <OtherHeader />
            <div className='blocks'>
                <p className='name'>Заказы</p>
                <Orders />
            </div>
        </div>
    )
}

export default Orders;