import React from 'react';
import './OrderCard.css'
import { useNavigate } from 'react-router-dom';

const ProductCard = () => {

    let navigate = useNavigate();
    
    return (
        <div className='orderCard' onClick={() => navigate('OrderInfo', { replace: false })}>
            <div className='firstOrderLine'>
                <div className='orderNum'>{'Заказ №1'}</div>
                <div className='orderCost'>{'444 ₽'}</div>
            </div>
            <div className='orderStatus'>{'Новый'}</div>
            <div className='orderDate'>{'22.07.2024 / 01:12'}</div>
        </div>
    );
};

export default ProductCard;