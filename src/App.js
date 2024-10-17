import { useEffect, useState } from 'react';
import './App.css';
import { useTelegram } from './hooks/useTelegram';
import ReactLoading from "react-loading";
import { AppRouter } from './router/AppRouter.jsx';
import StartService from './services/StartService.js';

function App() {
  const {tg} = useTelegram(); 

  useEffect(() => {
    tg.ready();
  }, [])

  let botId = 0;
  botId = window.Telegram.WebApp.initDataUnsafe.start_param; //by direct link
  if (typeof botId === 'undefined') {
    let params = new URL(document.location.toString()).searchParams;
    botId = params.get("bot_id"); //by inline button
  }

  // botId = 77

  const [appState, setAppState] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function makeRequest() {
      setIsLoading(true);
      await StartService.getUser(botId);
      setIsLoading(false);
    }

    makeRequest()
  }, [setAppState]);
   
  return (
    <div className="MarketBot">
      {
        isLoading ? (
          <div className='loadScreen'>
            <ReactLoading type="bubbles" color="#419FD9"
                    height={100} width={50} />
          </div>
        ) : (
          <AppRouter></AppRouter>
        )
      }
      
    </div>
  );
}

export default App;
