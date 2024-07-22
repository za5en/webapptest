import React from 'react'
import Button from '../Button/Button';
import './OtherHeader.css'
import { useNavigate } from "react-router-dom";

const OtherHeader = () => {
    let navigate = useNavigate();
    return (
        <div className='otherHeader'>
            <Button className='cancelButton' onClick={() => navigate(-1)}><b className='cancel'>Назад</b></Button>
        </div>
    )
}

export default OtherHeader;