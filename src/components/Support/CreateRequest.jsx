import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userInfo } from '../TestData/user';
import ReactLoading from "react-loading";
import OtherHeader from '../OtherHeader/OtherHeader.jsx';

const CreateRequest = () => {
    let navigate = useNavigate();

    const [appState, setAppState] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isValidTitle, setIsValidTitle] = useState(true);
    const [isValidComment, setIsValidComment] = useState(true);

    const confirm = async () => {
        var title = document.getElementById("title").value
        var email = document.getElementById("email").value
        var comment = document.getElementById("comment").value
      
        async function createRequest() {
            var response = await axios.post(`https://market-bot.org:8082/clients_api/technical_support/create_request/${userInfo[0].bot_id}?client_id=${userInfo[0].id}&title=${title}&content=${comment}&email=${email}`)
            setAppState(response);
            return response.status
        }


        if (document.getElementById('email').value.length > 0 && document.getElementById('email').value.length < 100) {
            setIsValidEmail(true);
            if (document.getElementById('title').value.length > 0 && document.getElementById('title').value.length < 200) {
                setIsValidTitle(true);
                if (document.getElementById('comment').value.length > 0 && document.getElementById('comment').value.length < 1000) {
                    setIsValidComment(true);
                    setIsLoading(true);
                    var code = 400
                    try {
                        code = await createRequest();
                    } catch (e) {
                        // console.log(e)
                        alert('Произошла ошибка')
                    }
                    setIsLoading(false);
                    if (code === 200) {
                        navigate(-1)
                    }
                    // else {
                    //     alert('Произошла ошибка')
                    // }
                } else {
                    setIsValidComment(false);
                }
            } else {
                setIsValidTitle(false);
            }
        } else {
            setIsValidEmail(false);
        }
    }

    return (
        <div>
            {isLoading ? (
                <div className='loadScreen'>
                    <ReactLoading type="bubbles" color="#419FD9"
                        height={100} width={50} />
                </div>
            ) : (
                <div>
                    <OtherHeader />
                    <div className='cart'>
                        <p className='name'>Создать обращение</p>
                        <div>
                            <form className='payments'>
                                <div className='fieldHeader'>Тема</div>
                                <div className='promoLine'>
                                    <input className='textField' type="text" id='title' required></input>
                                </div>
                                { isValidTitle ? ( 
                                    <div></div> 
                                ) : (
                                    <div className='wrongPhone'>Тема должна быть заполнена (не более 200 символов)</div>
                                )}
                                <div className='fieldHeader'>Email</div>
                                <div className='promoLine'>
                                    <input className='textField' type="email" id='email' required></input>
                                </div>
                                <div className='fieldHeader'>Комментарий</div>
                                <textarea className='textFieldExt' type="text" id='comment' placeholder='Комментарий' required></textarea>
                                { isValidComment ? ( 
                                    <div></div> 
                                ) : (
                                    <div className='wrongPhone'>Комментарий должен содержать до 1000 символов</div>
                                )}
                            </form>
                            <button className='shop-btn' onClick={() => confirm()}>Отправить обращение</button>
                        </div>
                    </div>
                </div>
            )}            
        </div>
    )
}

export default CreateRequest;