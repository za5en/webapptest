import axios from "axios";
import { userInfo } from "../components/TestData/user";
import { config } from "../api";

export default class SupportService {
    static async getRequests() {
        var response = await axios.get(`https://market-bot.org:8082/clients_api/technical_support/get_my_request/${userInfo[0].bot_id}?client_id=${userInfo[0].id}`, config);
        return response;
    }

    static async createRequest(title, comment, email) {
        var response = await axios.post(`https://market-bot.org:8082/clients_api/technical_support/create_request/${userInfo[0].bot_id}?client_id=${userInfo[0].id}&title=${title}&content=${comment}&email=${email}`, config);
        return response;
    }
}