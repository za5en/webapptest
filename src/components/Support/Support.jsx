import React, { useEffect, useState } from 'react'
import './Support.css'
import OtherHeader from '../OtherHeader/OtherHeader';
import { useNavigate } from 'react-router-dom';
import { userInfo } from '../TestData/user.jsx';
import axios from 'axios';
import ReactLoading from "react-loading";

export var requests = []

const Support = () => {
    let navigate = useNavigate();

    const [appState, setAppState] = useState();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
    
        async function getRequests() {
          var response = await axios.get(`https://market-bot.org:8082/clients_api/technical_support/get_my_request/?bot_id=${userInfo[0].bot_id}&client_id=${userInfo[0].id}`)
          if (response.status === 200) {
            while (response.length > 0) {
                requests.pop()
            }
            requests = response.data
            setAppState(response);
          }
        }
    
        async function makeRequest() {
          setIsLoading(true);
          try {
            await getRequests();
          } catch (e) {
            // console.log(e)
          }          
          setIsLoading(false);
        }
    
        makeRequest()
    }, [setAppState]);
      
    return (
        <div>
            {
            isLoading ? (
                <div className='loadScreen'>
                    <ReactLoading type="bubbles" color="#419FD9"
                        height={100} width={50} />
                </div>
            ) : (
                <div>
                    <OtherHeader />
                    <div className='blocks'>
                        <p className='name'>Техническая поддержка</p>
                    </div>
                    <div className='block' onClick={() => navigate('CreateRequest', { replace: false })}>Создать обращение &gt;</div>
                    <div className='ordersBlock'>
                        {requests.map(item => (
                            <div className='supportCard' onClick={() => navigate(`CheckRequest/${item.id}`, {replace: false, state: {id: item.id}})}>
                                <div className='firstOrderLine'>
                                    <div className='orderNum'>{'Обращение №' + item.id}</div>
                                    {item.completed ? (
                                        <div className='supportCompleted'>{'✔'}</div>
                                    ) : (
                                        <div></div>
                                    )}                                    
                                </div>
                                <div className='orderStatus'>{item.title}</div>
                                <div className='orderDate'>{new Date(item.create_date+'Z').toLocaleDateString(undefined, {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})}</div>
                            </div>
                        ))}
                    </div>                    
                </div>
                )
            }
        </div>
    )
}

export default Support;