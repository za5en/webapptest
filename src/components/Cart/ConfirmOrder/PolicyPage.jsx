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
                        <p className='policyPageText'>1.1.1. «Администрация сайта (далее – Администрация сайта)» – уполномоченные сотрудники на управления сайтом, действующие от имени MarketBot, которые организуют и (или) осуществляет обработку персональных данных, а также определяет цели обработки персональных данных, состав персональных данных, подлежащих обработке, действия (операции), совершаемые с персональными данными.</p>
                        <p className='policyPageText'>1.1.2. «Персональные данные» — любая информация, относящаяся к прямо или косвенно определенному или определяемому физическому лицу (субъекту персональных данных).</p>
                        <p className='policyPageText'>1.1.3. «Обработка персональных данных» — любое действие (операция) или совокупность действий (операций), совершаемых с использованием средств автоматизации или без использования таких средств с персональными данными, включая сбор, запись, систематизацию, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, передачу (распространение, предоставление, доступ), обезличивание, блокирование, удаление, уничтожение персональных данных.</p>
                        <p className='policyPageText'>1.1.4. «Конфиденциальность персональных данных» — обязательное для соблюдения Оператором или иным получившим доступ к персональным данным лицом требование не допускать их распространения без согласия субъекта персональных данных или наличия иного законного основания.</p>
                        <p className='policyPageText'>1.1.5. «Пользователь сайта (далее   Пользователь)» – лицо, имеющее доступ к Сайту, посредством сети Интернет и использующее Сайт.</p>
                        <p className='policyPageText'>1.1.6. «Cookies» — небольшой фрагмент данных, отправленный веб-сервером и хранимый на компьютере пользователя, который веб-клиент или веб-браузер каждый раз пересылает веб-серверу в HTTP-запросе при попытке открыть страницу соответствующего сайта.</p>
                        <p className='policyPageText'>1.1.7. «IP-адрес» — уникальный сетевой адрес узла в компьютерной сети, построенной по протоколу IP.</p>
                    </div>
                    <p className='name'>Общие положения</p>
                    <div className='payments'>
                        <p className='policyPageText'>2.1. Использование Пользователем сайта означает согласие с настоящей Политикой конфиденциальности и условиями обработки персональных данных Пользователя.</p>
                        <p className='policyPageText'>2.2. В случае несогласия с условиями Политики конфиденциальности Пользователь должен прекратить использование сайта.</p>
                        <p className='policyPageText'>2.3. Настоящая Политика конфиденциальности применяется только к сайту MarketBot. Сайт не контролирует и не несет ответственность за сайты третьих лиц, на которые Пользователь может перейти по ссылкам, доступным на сайте.</p>
                        <p className='policyPageText'>2.4. Администрация сайта не проверяет достоверность персональных данных, предоставляемых Пользователем сайта.</p>
                    </div>
                    <p className='name'>Предмет политики конфиденциальности</p>
                    <div className='payments'>
                        <p className='policyPageText'>3.1. Настоящая Политика конфиденциальности устанавливает обязательства Администрации сайта по неразглашению и обеспечению режима защиты конфиденциальности персональных данных, которые Пользователь предоставляет по запросу Администрации сайта при регистрации на сайте или при оформлении заказа для приобретения Товара.</p>
                        <p className='policyPageText'>3.2. Персональные данные, разрешённые к обработке в рамках настоящей Политики конфиденциальности, предоставляются Пользователем путём заполнения регистрационной формы на и включают в себя следующую информацию:</p>
                        <p className='policyPageText'>3.2.1. фамилию, имя, отчество Пользователя;</p>
                        <p className='policyPageText'>3.2.2. контактный телефон Пользователя;</p>
                        <p className='policyPageText'>3.2.3. адрес электронной почты (e-mail);</p>
                        <p className='policyPageText'>3.2.4. адрес доставки Товара;</p>
                        <p className='policyPageText'>3.2.5. место жительства Пользователя.</p>
                        <p className='policyPageText'>3.3. Сайт защищает Данные, которые автоматически передаются в процессе просмотра рекламных блоков и при посещении страниц, на которых установлен статистический скрипт системы («пиксель»):</p>
                        <p className='policyPageText'>
                            <ul className='listPolicy'>
                                <li>IP адрес;</li>
                                <li>информация из cookies;</li>
                                <li>информация о браузере (или иной программе, которая осуществляет доступ к показу рекламы);</li>
                                <li>время доступа;</li>
                                <li>адрес страницы, на которой расположен рекламный блок;</li>
                                <li>реферер (адрес предыдущей страницы).</li>
                            </ul>
                        </p>
                        <p className='policyPageText'>3.3.1. Отключение cookies может повлечь невозможность доступа к частям сайта, требующим авторизации.</p>
                        <p className='policyPageText'>3.3.2. Сайт осуществляет сбор статистики об IP-адресах своих посетителей. Данная информация используется с целью выявления и решения технических проблем, для контроля законности проводимых финансовых платежей.</p>
                        <p className='policyPageText'>3.4. Любая иная персональная информация неоговоренная выше (история покупок, используемые браузеры и операционные системы и т.д.) подлежит надежному хранению и нераспространению, за исключением случаев, предусмотренных в п.п. 5.2. и 5.3. настоящей Политики конфиденциальности.</p>
                    </div>
                    <p className='name'>Цели сбора персональной информации пользователя</p>
                    <div className='payments'>
                        <p className='policyPageText'>4.1. Персональные данные Пользователя Администрация сайта может использовать в целях:</p>
                        <p className='policyPageText'>4.1.1. Идентификации Пользователя, зарегистрированного на сайте, для оформления заказа и (или) заключения Договора купли-продажи товара дистанционным способом.</p>
                        <p className='policyPageText'>4.1.2. Предоставления Пользователю доступа к персонализированным ресурсам Сайта.</p>
                        <p className='policyPageText'>4.1.3. Установления с Пользователем обратной связи, включая направление уведомлений, запросов, касающихся использования Сайта, оказания услуг, обработка запросов и заявок от Пользователя.</p>
                        <p className='policyPageText'>4.1.4. Определения места нахождения Пользователя для обеспечения безопасности, предотвращения мошенничества.</p>
                        <p className='policyPageText'>4.1.5. Подтверждения достоверности и полноты персональных данных, предоставленных Пользователем.</p>
                        <p className='policyPageText'>4.1.6. Создания учетной записи для совершения покупок, если Пользователь дал согласие на создание учетной записи.</p>
                        <p className='policyPageText'>4.1.7. Уведомления Пользователя Сайта о состоянии Заказа.</p>
                        <p className='policyPageText'>4.1.8. Обработки и получения платежей, подтверждения налога или налоговых льгот, оспаривания платежа, определения права на получение кредитной линии Пользователем.</p>
                        <p className='policyPageText'>4.1.9. Предоставления Пользователю эффективной клиентской и технической поддержки при возникновении проблем, связанных с использованием Сайта.</p>
                        <p className='policyPageText'>4.1.10. Предоставления Пользователю с его согласия, обновлений продукции, специальных предложений, информации о ценах, новостной рассылки и иных сведений от имени сайта или от имени партнеров сайта.</p>
                        <p className='policyPageText'>4.1.11. Осуществления рекламной деятельности с согласия Пользователя.</p>
                        <p className='policyPageText'>4.1.12. Предоставления доступа Пользователю на сайты или сервисы партнеров Сайта с целью получения продуктов, обновлений и услуг.</p>
                    </div>
                    <p className='name'>Способы и сроки обработки персональной информации</p>
                    <div className='payments'>
                        <p className='policyPageText'>5.1. Обработка персональных данных Пользователя осуществляется без ограничения срока, любым законным способом, в том числе в информационных системах персональных данных с использованием средств автоматизации или без использования таких средств.</p>
                        <p className='policyPageText'>5.2. Пользователь соглашается с тем, что Администрация сайта вправе передавать персональные данные третьим лицам, в частности, курьерским службам, организациями почтовой связи, операторам электросвязи, исключительно в целях выполнения заказа Пользователя, оформленного на Сайте MarketBot, включая доставку Товара.</p>
                        <p className='policyPageText'>5.3. Персональные данные Пользователя могут быть переданы уполномоченным органам государственной власти Российской Федерации только по основаниям и в порядке, установленным законодательством Российской Федерации.</p>
                        <p className='policyPageText'>5.4. При утрате или разглашении персональных данных Администрация сайта информирует Пользователя об утрате или разглашении персональных данных.</p>
                        <p className='policyPageText'>5.5. Администрация сайта принимает необходимые организационные и технические меры для защиты персональной информации Пользователя от неправомерного или случайного доступа, уничтожения, изменения, блокирования, копирования, распространения, а также от иных неправомерных действий третьих лиц.</p>
                        <p className='policyPageText'>5.6. Администрация сайта совместно с Пользователем принимает все необходимые меры по предотвращению убытков или иных отрицательных последствий, вызванных утратой или разглашением персональных данных Пользователя.</p>
                    </div>
                    <p className='name'>Обязательства сторон</p>
                    <div className='payments'>
                        <p className='policyPageText'>6.1. Пользователь обязан:</p>
                        <p className='policyPageText'>6.1.1. Предоставить информацию о персональных данных, необходимую для пользования Сайтом.</p>
                        <p className='policyPageText'>6.1.2. Обновить, дополнить предоставленную информацию о персональных данных в случае изменения данной информации.</p>
                        <p className='policyPageText'>6.2. Администрация сайта обязана:</p>
                        <p className='policyPageText'>6.2.1. Использовать полученную информацию исключительно для целей, указанных в п. 4 настоящей Политики конфиденциальности.</p>
                        <p className='policyPageText'>6.2.2. Обеспечить хранение конфиденциальной информации в тайне, не разглашать без предварительного письменного разрешения Пользователя, а также не осуществлять продажу, обмен, опубликование, либо разглашение иными возможными способами переданных персональных данных Пользователя, за исключением п.п. 5.2. и 5.3. настоящей Политики Конфиденциальности.</p>
                        <p className='policyPageText'>6.2.3. Принимать меры предосторожности для защиты конфиденциальности персональных данных Пользователя согласно порядку, обычно используемого для защиты такого рода информации в существующем деловом обороте.</p>
                        <p className='policyPageText'>6.2.4. Осуществить блокирование персональных данных, относящихся к соответствующему Пользователю, с момента обращения или запроса Пользователя или его законного представителя либо уполномоченного органа по защите прав субъектов персональных данных на период проверки, в случае выявления недостоверных персональных данных или неправомерных действий.</p>
                    </div>
                    <p className='name'>Ответственность сторон</p>
                    <div className='payments'>
                        <p className='policyPageText'>7.1. Администрация сайта, не исполнившая свои обязательства, несёт ответственность за убытки, понесённые Пользователем в связи с неправомерным использованием персональных данных, в соответствии с законодательством Российской Федерации, за исключением случаев, предусмотренных п.п. 5.2., 5.3. и 7.2. настоящей Политики Конфиденциальности.</p>
                        <p className='policyPageText'>7.2. В случае утраты или разглашения Конфиденциальной информации Администрация сайта не несёт ответственность, если данная конфиденциальная информация:</p>
                        <p className='policyPageText'>7.2.1. Стала публичным достоянием до её утраты или разглашения.</p>
                        <p className='policyPageText'>7.2.2. Была получена от третьей стороны до момента её получения Администрацией сайта.</p>
                        <p className='policyPageText'>7.2.3. Была разглашена с согласия Пользователя.</p>
                    </div>
                    <p className='name'>Разрешение споров</p>
                    <div className='payments'>
                        <p className='policyPageText'>8.1. До обращения в суд с иском по спорам, возникающим из отношений между Пользователем сайта и Администрацией сайта, обязательным является предъявление претензии (письменного предложения о добровольном урегулировании спора).</p>
                        <p className='policyPageText'>8.2. Получатель претензии в течение 30 календарных дней со дня получения претензии, письменно уведомляет заявителя претензии о результатах рассмотрения претензии.</p>
                        <p className='policyPageText'>8.3. При не достижении соглашения спор будет передан на рассмотрение в судебный орган в соответствии с действующим законодательством Российской Федерации.</p>
                        <p className='policyPageText'>8.4. К настоящей Политике конфиденциальности и отношениям между Пользователем и Администрацией сайта применяется действующее законодательство Российской Федерации.</p>
                    </div>
                    <p className='name'>Дополнительные условия</p>
                    <div className='payments'>
                        <p className='policyPageText'>9.1. Администрация сайта вправе вносить изменения в настоящую Политику конфиденциальности без согласия Пользователя.</p>
                        <p className='policyPageText'>9.2. Новая Политика конфиденциальности вступает в силу с момента ее размещения на Сайте, если иное не предусмотрено новой редакцией Политики конфиденциальности.</p>
                        <p className='policyPageText'>9.3. Все предложения или вопросы по настоящей Политике конфиденциальности следует сообщать по адресу электронной почты <a className='contactLink' href="mailto:marketbotoffice@gmail.com" target="_blank" rel="noopener">marketbotoffice@gmail.com</a>.</p>
                    </div>
                    <button className='shop-btn' onClick={() => navigate(-1)}>Назад</button>
                </div>
            </div>
        </div>
    )
}

export default PolicyPage;