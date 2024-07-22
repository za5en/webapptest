import React from 'react'
import { useTelegram } from '../../hooks/useTelegram';
import './Profile.css'
import Avatar from '../../assets/icons/avatar.svg';
import OtherHeader from '../OtherHeader/OtherHeader';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const {tg, user, receiver} = useTelegram();
    let navigate = useNavigate();

    return (
        <div>
            <OtherHeader />
            <div className='user'>
                <img src={user?.photo_url} className='avatar' />
                <span className='usernameProfile'>
                    {user?.username ?? 'Username'}
                </span>
            </div>
            <div className='block' onClick={() => navigate('Orders', { replace: false })}>{receiver?.id}</div>
            <div className='block' onClick={() => navigate('Promo', { replace: false })}>{tg.initDataUnsafe}</div>
            <div className='block' onClick={() => navigate('Favorites', { replace: false })}>Избранное &gt;</div>
        </div>
    )
}

export default Profile;