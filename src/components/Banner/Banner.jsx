import React from 'react';
import './Banner.css'
import { useNavigate } from 'react-router-dom';

const Banner = ({header, id}) => {
    let navigate = useNavigate();

    const {banners} = require('../TestData/prod.jsx');

    let banner = {};

    let find = false;
    for (let i = 0; i < Object.keys(banners).length && !find; i++) {
        if (banners[i].banner_id === id) {
            banner = banners[i];
            find = true;
        }
    }
    
    return (
        <div className='bannerImg' onClick={() => navigate(`BannerPage/${id}`, { replace: false, state: {id: id} })}>
            <img
				src={banner.photoFile}
				alt={header}
				className='bannerIcon'
			/>
        </div>
    );
};

export default Banner;