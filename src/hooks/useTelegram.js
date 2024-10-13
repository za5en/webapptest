const tg = window.Telegram.WebApp;

export function useTelegram() {

    const onClose = () => {
        tg.close();
    }

    const onToggleButton = () => {
        if (tg.MainButton.isVisible) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }

    var tokenString = '';
    if (tg.initDataUnsafe !== null) {
      if (typeof tg.initDataUnsafe.query_id !== 'undefined' && tg.initDataUnsafe.query_id !== null) {
        tokenString += `query_id=${tg.initDataUnsafe.query_id}&`
      }
      if (typeof tg.initDataUnsafe.auth_date !== 'undefined' && tg.initDataUnsafe.auth_date !== null) {
        tokenString += `auth_date=${tg.initDataUnsafe.auth_date}&`
      }
      if (typeof tg.initDataUnsafe.hash !== 'undefined' && tg.initDataUnsafe.hash !== null) {
        tokenString += `hash=${tg.initDataUnsafe.hash}&`
      }
      if (typeof tg.initDataUnsafe.user !== 'undefined' && tg.initDataUnsafe.user !== null) {
        tokenString += `user=${JSON.stringify(tg.initDataUnsafe.user)}&`
      }
      if (typeof tg.initDataUnsafe.receiver !== 'undefined' && tg.initDataUnsafe.receiver !== null) {
        tokenString += `receiver=${JSON.stringify(tg.initDataUnsafe.receiver)}&`
      }
      if (typeof tg.initDataUnsafe.chat !== 'undefined' && tg.initDataUnsafe.chat !== null) {
        tokenString += `chat=${JSON.stringify(tg.initDataUnsafe.chat)}&`
      }
      if (typeof tg.initDataUnsafe.chat_type !== 'undefined' && tg.initDataUnsafe.chat_type !== null) {
        tokenString += `chat_type=${tg.initDataUnsafe.chat_type}&`
      }
      if (typeof tg.initDataUnsafe.chat_instance !== 'undefined' && tg.initDataUnsafe.chat_instance !== null) {
        tokenString += `chat_instance=${tg.initDataUnsafe.chat_instance}&`
      }
      if (typeof tg.initDataUnsafe.start_param !== 'undefined' && tg.initDataUnsafe.start_param !== null) {
        tokenString += `start_param=${tg.initDataUnsafe.start_param}&`
      }
      if (typeof tg.initDataUnsafe.can_send_after !== 'undefined' && tg.initDataUnsafe.can_send_after !== null) {
        tokenString += `can_send_after=${tg.initDataUnsafe.can_send_after}`
      }
      if (tokenString[tokenString.length - 1] === '&') {
        tokenString = tokenString.slice(0, -1);
      }
        console.log(encodeURI(tokenString))
    }
    
    return {
        onClose,
        onToggleButton,
        tg,
        user: tg.initDataUnsafe?.user,
        receiver: tg.initDataUnsafe?.receiver,
        queryId: tg.initDataUnsafe?.query_id,
        tokenString,
    }
}