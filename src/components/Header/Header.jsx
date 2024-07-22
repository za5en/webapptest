import React from 'react'
import Button from '../Button/Button';
import { useTelegram } from '../../hooks/useTelegram';
import './Header.css'
import Avatar from '../../assets/icons/avatar.svg';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const {user, onClose} = useTelegram(); 
    let navigate = useNavigate();
    const {categories} = require('../TestData/prod.jsx');

    const onClick = (id) => {
        const getElement = document.getElementById(id);
        getElement.scrollIntoView({behavior: "smooth"});
    }

    return (
        <div className='header'>
            <div className='firstLine'>
                <Button className='cancelButton' onClick={onClose}><b className='cancel'>Закрыть</b></Button>
                <button className='menuButton' onClick={() => navigate('Profile', { replace: false })}>
                    <img src={user?.photo_url ?? Avatar} className='menuIcon' />
                    <span className='username'>
                        {user?.username ?? 'Username'}
                    </span>
                </button>
            </div>
            <div className='secondLine'>
                {categories.map(item => (
                        <div className='scroll'>
                            <span onClick={() => onClick(item)}>{item}</span>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default Header;