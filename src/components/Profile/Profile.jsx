import React from 'react'
import { useTelegram } from '../../hooks/useTelegram';
import './Profile.css'
import Avatar from '../../assets/icons/avatar.svg';
import OtherHeader from '../OtherHeader/OtherHeader';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const {user} = useTelegram();
    let navigate = useNavigate();

    return (
        <div>
            <OtherHeader />
            <div className='user'>
                {/* <img src={user?.photo_url ?? Avatar} className='avatar' /> */}
                <span className='usernameProfile'>
                    {user?.username ?? 'Username'}
                </span>
            </div>
            <div className='block' onClick={() => navigate('Orders', { replace: false })}>Заказы &gt;</div>
            <div className='block' onClick={() => navigate('Promo', { replace: false })}>Акции &gt;</div>
            {/* <div className='block' onClick={() => navigate('Favorites', { replace: false })}>Избранное &gt;</div> */}
        </div>
    )
}

export default Profile;