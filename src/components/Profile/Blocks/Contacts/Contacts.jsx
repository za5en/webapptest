import React from 'react'
import '../Blocks.css'
import './Contacts.css'
import OtherHeader from '../../../OtherHeader/OtherHeader';

const Contacts = () => {
    return (
        <div>
            <OtherHeader />
            <div className='blocks'>
                <p className='name'>Контактная информация</p>
                <div className='contactsCard'>
                    <div className='firstOrderLine'>
                        <div className='orderNum'>{'Адрес:'}</div>
                        <div className='contactInfo'>{'г. Ижевск, ул. Удмуртская 205'}</div>
                    </div>
                    <div className='firstOrderLine'>
                        <div className='orderNum'>{'Телефон:'}</div>
                        <div className='contactInfo'>{'+79128123456'}</div>
                    </div>
                    <div className='firstOrderLine'>
                        <div className='orderNum'>{'Email:'}</div>
                        <a className='contactLink' href="mailto:mail@mail.ru" target="_blank" rel="noopener">{'mail@mail.ru'}</a>
                    </div>
                    <div className='firstOrderLine'>
                        <div className='orderNum'>{'Telegram:'}</div>
                        <a className='contactLink' href="https://telegram.org/" target="_blank" rel="noopener">{'@shop'}</a>
                    </div>
                    <div className='firstOrderLine'>
                        <div className='orderNum'>{'IG:'}</div>
                        <a className='contactLink' href="https://www.instagram.com/" target="_blank" rel="noopener">{'@shop'}</a>
                    </div>
                    <div className='firstOrderLine'>
                        <div className='orderNum'>{'Вконтакте:'}</div>
                        <a className='contactLink' href="https://vk.com/" target="_blank" rel="noopener">{'@shop'}</a>
                    </div>
                    <div className='firstOrderLine'>
                        <div className='orderNum'>{'Веб-сайт:'}</div>
                        <a className='contactLink' href="http://market-bot.org/" target="_blank" rel="noopener">{'market-bot.org'}</a>
                    </div>
                    {/* <div className='firstOrderLine'>
                        <a className='policyLink' href="http://market-bot.org/" target="_blank" rel="noopener">{'Политика конфиденциальности'}</a>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default Contacts;