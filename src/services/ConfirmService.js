import axios from "axios";
import { userInfo } from "../components/TestData/user";
import { config } from "../api";
import { useTelegram } from "../hooks/useTelegram";
import { goodsAmount } from "../components/Products/Products";

export default class ConfirmService {
    static async createCart(goods) {
        var response  = await axios.post(`https://market-bot.org:8082/clients_api/clients_menu/create_cart/${userInfo[0].bot_id}?client_id=${userInfo[0].id}`, null, config)
        userInfo[0].cartId = response.data.data
        await ConfirmService.addToCart(goods);
    }

    static async addToCart(goods) {
        const {tokenString} = useTelegram();
        var response = ''
        for (let i = 0; i < goods.length; i++) {
            if (typeof goods[i]?.options !== "undefined" && goods[i]?.options.length > 0) {
                let find = false;
                var options = []
                for (let j = 0; j < products.length && !find; j++) {
                    if (parseInt(goods[i].id.substring(0, goods[i].id.indexOf("_"))) === products[j].id) {
                        find = true;
                        var prodKey = goods[i].id.substring(goods[i].id.indexOf("_") + 1);
                        var k = 0;
                        while (prodKey.length > 0) {
                            var index = 0
                            if (prodKey.includes("_")) {
                                index = prodKey.substring(0, prodKey.indexOf("_"));
                            } else {
                                index = prodKey
                            }

                            var option = {
                                "group_name": products[j].options[k].group_name,
                                options: [
                                    products[j].options[k].options[index]
                                ]
                            }
                            options.push(option)

                            if (prodKey.includes("_")) {
                                prodKey = prodKey.substring(prodKey.indexOf("_") + 1)
                            } else {
                                prodKey = ""
                            }
                            k++;
                        }
                    }
                }
                if (typeof goods[i].boostPrice === 'undefined') {
                    goods[i].boostPrice = goods[i].price;
                }
                response = await axios.post(`https://market-bot.org:8082/clients_api/clients_menu/add_to_cart/${userInfo[0].bot_id}`, {
                        cart_id: userInfo[0].cartId,
                        product_id: parseInt(goods[i].id.substring(0, goods[i].id.indexOf("_"))),
                        count: goodsAmount.get(goods[i].id),
                        price: goods[i].boostPrice * goodsAmount.get(goods[i].id),
                        option: options
                    }, {
                        headers: {
                            'Authorization': tokenString,
                            'Content-Type': 'application/json'
                        }
                })
            } else {
                response = await axios.post(`https://market-bot.org:8082/clients_api/clients_menu/add_to_cart/${userInfo[0].bot_id}`, {
                        cart_id: userInfo[0].cartId,
                        product_id: parseInt(goods[i].id),
                        count: goodsAmount.get(`${goods[i].id}`),
                        price: goods[i].price * goodsAmount.get(`${goods[i].id}`),
                        option: []
                    }, {
                        headers: {
                            'Authorization': tokenString,
                            'Content-Type': 'application/json'
                        }
                })
            }
        }
    }

    static async createOrder(paymentType, delType, deliveryAddress, comment, phone, promo, bonusPoints, name) {
        const {tokenString} = useTelegram();
        var response = await axios.post(`https://market-bot.org:8082/clients_api/clients_orders/create_order/${userInfo[0].bot_id}`, {
            "client_id": userInfo[0].id,
            "bot_id": userInfo[0].bot_id,
            "cart_id": userInfo[0].cartId,
            "pay_type": paymentType,
            "delivery_type": delType,
            "delivery_address": deliveryAddress,
            "comment": comment,
            "phone": phone,
            "promo_code": promo[0],
            "bonus_points": bonusPoints,
            "latitude": userInfo[0].latitude,
            "longitude": userInfo[0].longitude,
            "name": name,
        }, {
          headers: {
                'Authorization': tokenString,
                'Content-Type': 'application/json'
          }
        })
        return response;
    }

    static async payForCart(paymentType, delType, deliveryAddress, comment, phone, promo, bonusPoints, name) {
        const {queryId, tokenString} = useTelegram();
        if (promo[0] !== null && promo[0] !== "" && typeof promo[0] !== "undefined") {
            var response = await axios.post(`https://market-bot.org:8082/clients_api/clients_menu/pay_for_cart/${userInfo[0].bot_id}?client_id=${userInfo[0].id}&cart_id=${userInfo[0].cartId}&promo_code=${promo[0]}&bonus_points=${bonusPoints}`, {
                "client_id": userInfo[0].id,
                "bot_id": userInfo[0].bot_id,
                "cart_id": userInfo[0].cartId,
                "pay_type": paymentType,
                "delivery_type": delType,
                "delivery_address": deliveryAddress,
                "comment": comment,
                "phone": phone,
                "promo_code": promo[0],
                "latitude": userInfo[0].latitude,
                "longitude": userInfo[0].longitude,
                "name": name
                }, {
                headers: {
                    'Authorization': tokenString,
                    'Content-Type': 'application/json'
                }
            })
            var json = response.data
            json.query_id = queryId
            return response;
        } else {
            var response = await axios.post(`https://market-bot.org:8082/clients_api/clients_menu/pay_for_cart/${userInfo[0].bot_id}?client_id=${userInfo[0].id}&cart_id=${userInfo[0].cartId}&bonus_points=${bonusPoints}`, {
              "client_id": userInfo[0].id,
              "bot_id": userInfo[0].bot_id,
              "cart_id": userInfo[0].cartId,
              "pay_type": paymentType,
              "delivery_type": delType,
              "delivery_address": deliveryAddress,
              "comment": comment,
              "phone": phone,
              "latitude": userInfo[0].latitude,
              "longitude": userInfo[0].longitude,
              "name": name
            }, {
              headers: {
                'Authorization': tokenString,
                'Content-Type': 'application/json'
              }
            })
            var json = response.data
            json.query_id = queryId
            return response;
        }
    }
}