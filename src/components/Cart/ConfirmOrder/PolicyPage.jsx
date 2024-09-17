import React from 'react'
import { useNavigate } from 'react-router-dom';
import OtherHeader from '../../OtherHeader/OtherHeader.jsx';

const PolicyPage = () => {
    let navigate = useNavigate();

    return (
        <div>
            <OtherHeader />
            <div className='cart'>
                <p className='name'>Политика конфиденциальности</p>
                <div>
                    <div className='payments'>
                    <p className='policyPageText'>Настоящая Политика конфиденциальности персональных данных (далее – Политика конфиденциальности) действует в отношении всей информации, которую Интернет - Сайт MarketBot, расположенный на доменном имени market-bot.org, может получить о Пользователе во время использования сайта.</p>
                    </div>
                    <p className='name'>Определения терминов</p>
                    <div className='payments'>
                    <p className='policyPageText'>1.1. В настоящей Политике конфиденциальности используются следующие термины:</p>
                    </div>
                    <button className='shop-btn' onClick={() => navigate(-1)}>Назад</button>
                </div>
            </div>
        </div>
    )
}

export default PolicyPage;