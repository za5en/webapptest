import { useTelegram } from "./hooks/useTelegram";

const {tokenString} = useTelegram();

export var config = {
    headers: {
      'Authorization': tokenString,
    }
}