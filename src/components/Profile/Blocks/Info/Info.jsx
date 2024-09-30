import React, { useEffect, useState } from 'react'
import '../Blocks.css'
import './Info.css'
import OtherHeader from '../../../OtherHeader/OtherHeader';
import { contacts, orders } from '../../Profile.jsx';
import ReactLoading from "react-loading";
import { userInfo } from '../../../TestData/user.jsx';

const Info = () => {

    const [isLoading, setIsLoading] = useState(false);

    return (
        <div>
            <OtherHeader />
            {
            isLoading ? (
                <div className='loadScreen'>
                    <ReactLoading type="bubbles" color="#419FD9"
                        height={100} width={50} />
                </div>
            ) : (
                <div className='blocks'>
                    <p className='name'>Мой профиль</p>
                    <div className='profileCard'>
                        { userInfo.length > 0 ?
                            userInfo[0].name === null || userInfo[0].name === "" ? (
                            <div></div>
                            ) : (
                                <div>
                                    <div className='profileLine'>
                                        <div className='profileTitle'>{'Имя'}</div>
                                        <div className='profileInfo'>{userInfo[0].name}</div>
                                    </div>
                                    <hr className="solid"></hr>
                                </div>
                            ) : (
                                <div></div>
                            )
                        }
                        { userInfo.length > 0 ?
                            userInfo[0].id === null || userInfo[0].id === "" ? (
                            <div></div>
                            ) : (
                                <div>
                                    <div className='profileLine'>
                                        <div className='profileTitle'>{'ID'}</div>
                                        <div className='profileInfo'>{userInfo[0].id}</div>
                                    </div>
                                    <hr className="solid"></hr>
                                </div>
                            ) : (
                                <div></div>
                            )
                        }
                        { userInfo.length > 0 ?
                            userInfo[0].phone === null || userInfo[0].phone === "" ? (
                            <div></div>
                            ) : (
                                <div>
                                <div className='profileLine'>
                                    <div className='profileTitle'>{'Телефон'}</div>
                                    <div className='profileInfo'>{userInfo[0].phone}</div>
                                </div>
                                <hr className="solid"></hr>
                                </div>
                            ) : (
                                <div></div>
                            )
                        }
                        { userInfo.length > 0 ?
                            userInfo[0].invites_num === null || userInfo[0].invites_num === "" ? (
                            <div></div>
                            ) : (
                                <div>
                                    <div className='profileLine'>
                                        <div className='profileTitle'>{'Приглашено друзей'}</div>
                                        <div className='profileInfo'>{userInfo[0].invites_num}</div>
                                    </div>
                                    <hr className="solid"></hr>
                                </div>
                            ) : (
                                <div></div>
                            )
                        }
                        { userInfo.length > 0 ?
                            userInfo[0].orders_count === null || userInfo[0].orders_count === "" ? (
                            <div></div>
                            ) : (
                                <div>
                                    <div className='profileLine'>
                                        <div className='profileTitle'>{'Количество заказов'}</div>
                                        <div className='profileInfo'>{orders.length}</div>
                                    </div>
                                    <hr className="solid"></hr>
                                </div>
                            ) : (
                                <div></div>
                            )
                        }
                        { userInfo.length > 0 ?
                            userInfo[0].bonus_points === null || userInfo[0].bonus_points === "" ? (
                            <div></div>
                            ) : (
                                <div>
                                <div className='profileLine'>
                                    <div className='profileTitle'>{'Бонусные баллы'}</div>
                                    <div className='profileInfo'>{userInfo[0].bonus_points.toFixed(0)}</div>
                                </div>
                                    <hr className="solid"></hr>
                                    </div>
                            ) : (
                                <div></div>
                            )
                        }
                        { userInfo.length > 0 ?
                            userInfo[0].register_date === null || userInfo[0].register_date === "" ? (
                            <div></div>
                            ) : (
                                <div className='profileLine'>
                                    <div className='profileTitle'>{'Дата регистрации'}</div>
                                    <div className='profileInfo'>{new Date(userInfo[0].register_date+'Z').toLocaleDateString(undefined, {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'})}</div>
                                </div>
                            ) : (
                                <div></div>
                            )
                        }
                    </div>
                </div>
                )
            }
        </div>
    )
}

export default Info;