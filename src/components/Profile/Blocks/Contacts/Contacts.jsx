import React from 'react'
import '../Blocks.css'
import './Contacts.css'
import OtherHeader from '../../../OtherHeader/OtherHeader';
import { contacts } from '../../Profile.jsx';

const Contacts = () => {
    return (
        <div>
            <OtherHeader />
            <div className='blocks'>
                <p className='name'>Контактная информация</p>
                <div className='contactsCard'>
                    { contacts[0].shop_address === null || contacts[0].shop_address === "" ? (
                        <div></div>
                        ) : (
                            <div className='firstOrderLine'>
                                <div className='orderNum'>{'Адрес:'}</div>
                                <div className='contactInfo'>{contacts[0].shop_address}</div>
                            </div>
                        )
                    }
                    { contacts[0].shop_phone === null || contacts[0].shop_phone === "" ? (
                        <div></div>
                        ) : (
                            <div className='firstOrderLine'>
                                <div className='orderNum'>{'Телефон:'}</div>
                                <div className='contactInfo'>{contacts[0].shop_phone}</div>
                            </div>
                        )
                    }
                    { contacts[0].shop_email === null || contacts[0].shop_email === "" ? (
                        <div></div>
                        ) : (
                            <div className='firstOrderLine'>
                                <div className='orderNum'>{'Email:'}</div>
                                <a className='contactLink' href={"mailto:" + contacts[0].shop_email} target="_blank" rel="noopener">{contacts[0].shop_email}</a>
                            </div>
                        )
                    }
                    { contacts[0].shop_tg === null || contacts[0].shop_tg === "" ? (
                        <div></div>
                        ) : (
                            <div className='firstOrderLine'>
                                <div className='orderNum'>{'Telegram:'}</div>
                                <a className='contactLink' href={"https://telegram.org/" + contacts[0].shop_tg} target="_blank" rel="noopener">@{contacts[0].shop_tg}</a>
                            </div>
                        )
                    }
                    {/* <div className='firstOrderLine'>
                        <div className='orderNum'>{'IG:'}</div>
                        <a className='contactLink' href="https://www.instagram.com/" target="_blank" rel="noopener">{'@shop'}</a>
                    </div> */}
                    { contacts[0].shop_vk === null || contacts[0].shop_vk === "" ? (
                        <div></div>
                        ) : (
                            <div className='firstOrderLine'>
                                <div className='orderNum'>{'Вконтакте:'}</div>
                                <a className='contactLink' href={"https://vk.com/" + contacts[0].shop_vk} target="_blank" rel="noopener">@{contacts[0].shop_vk}</a>
                            </div>
                        )
                    }
                    { contacts[0].shop_site === null || contacts[0].shop_site === "" ? (
                        <div></div>
                        ) : (
                            <div className='firstOrderLine'>
                                <div className='orderNum'>{'Веб-сайт:'}</div>
                                <a className='contactLink' href={contacts[0].shop_site} target="_blank" rel="noopener">{contacts[0].shop_site}</a>
                            </div>
                        )
                    }
                    {/* <div className='firstOrderLine'>
                        <a className='policyLink' href="http://market-bot.org/" target="_blank" rel="noopener">{'Политика конфиденциальности'}</a>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default Contacts;