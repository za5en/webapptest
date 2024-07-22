import React from 'react'
import '../Blocks.css'
import OtherHeader from '../../../OtherHeader/OtherHeader';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
    let navigate = useNavigate();
    return (
        <div>
            <OtherHeader />
            <div className='blocks'>
                <p className='name'>Избранное</p>
                <div className='null'>Избранных товаров пока нет</div>
                <button className='shop-btn' onClick={() => navigate(-2)}>К списку товаров</button>
            </div>
        </div>
    )
}

export default Favorites;