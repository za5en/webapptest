import React from 'react';
import './Banner.css'
import { useNavigate } from 'react-router-dom';
import BurgerIcon from '../../assets/images/burger.png';

const Banner = ({header, id}) => {
    let navigate = useNavigate();

    const {banners} = require('../TestData/prod.jsx');

    let banner = {};

    let find = false;
    for (let i = 0; i < Object.keys(banners).length && !find; i++) {
        if (banners[i].id === id) {
            banner = banners[i];
            find = true;
        }
    }
    
    return (
        <div className='bannerImg' onClick={() => navigate(`BannerPage/${id}`, { replace: false, state: {id: id} })}>
            <img
				src={BurgerIcon} //banner.image
				alt={header}
				className='bannerIcon'
			/>
        </div>
    );
};

export default Banner;