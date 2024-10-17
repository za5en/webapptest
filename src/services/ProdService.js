import axios from "axios";
import { userInfo } from "../components/TestData/user";
import { config } from "../api";

export default class ProdService {
    static async addToFav(id) {
        try {
            await axios.post(`https://market-bot.org:8082/clients_api/clients_menu/add_to_favorites/${userInfo[0].bot_id}?product_id=${id}&client_id=${userInfo[0].id}`, config)
        } catch (e) {
            console.log(e)
        }
    }

    static async removeFromFav(id) {
        try {
            await axios.delete(`https://market-bot.org:8082/clients_api/clients_menu/remove_from_favorites/${userInfo[0].bot_id}?product_id=${id}&client_id=${userInfo[0].id}`, config)
        } catch (e) {
            // console.log(e)
        }
    }

    static async createReview(id, content, mark) {
        try {
            await axios.post(`https://market-bot.org:8082/clients_api/reviews/create_review/${userInfo[0].bot_id}?client_id=${userInfo[0].id}&product_id=${id}&content=${content}&rate=${mark}`, config)
        } catch (e) {
            // console.log(e)
        }
    }

    static async editReview(id, content, mark) {
        try {
            var response = await axios.post(`https://market-bot.org:8082/clients_api/reviews/change_review/${userInfo[0].bot_id}?client_id=${userInfo[0].id}&review_id=${id}&content=${content}&rate=${mark}`, config)
            return response;
        } catch (e) {
            // console.log(e)
        }
    }

    static async deleteReview(reviewId) {
        try {
            var response = await axios.post(`https://market-bot.org:8082/clients_api/reviews/delete_review/${userInfo[0].bot_id}?client_id=${userInfo[0].id}&review_id=${reviewId}`, config)
            return response;
        } catch (e) {
            // console.log(e)
        }
    }

    static async getReviews(id) {
        try {
            var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_reviews/${userInfo[0].bot_id}?client_id=${userInfo[0].id}&product_id=${id}`, config)
            return response;
        } catch (e) {
            // console.log(e)
        }
    }
}