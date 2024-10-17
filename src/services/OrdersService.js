import axios from "axios";
import { config } from '../api.js';
import { userInfo } from "../components/TestData/user.jsx";
import { ordersTest } from "../components/TestData/prod.jsx";
import { goodsGlobal } from "../components/Profile/OrderCard/OrderCard.jsx";

export default class OrdersService {

    static async getOrders() {
        var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_orders/get_orders/${userInfo[0].bot_id}?client_id=${userInfo[0].id}`, config)
        ordersTest = response.data
        ordersTest.sort((a, b) => a.id < b.id ? 1 : -1);
        for (let i = 0; i < ordersTest.length; i++) {
            await OrdersService.getProducts(ordersTest[i].id);
        }
        
        return response;
    }

    static async getOrdersNoSort() {
        try {
            var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_orders/get_orders/${userInfo[0].bot_id}?client_id=${userInfo[0].id}`, config);
            return response;
        } catch (e) {
            // console.log(e)
        }
    }

    static async getOnlyProducts(id) {
        try {
            var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_orders/get_orders/${userInfo[0].bot_id}?client_id=${userInfo[0].id}&order_id=${id}`, config)
            return response;
        } catch (e) {
            // console.log(e)
        }
    }
    
    static async getProducts(id) {
        var response  = await axios.get(`https://market-bot.org:8082/clients_api/clients_orders/get_orders/${userInfo[0].bot_id}?client_id=${userInfo[0].id}&order_id=${id}`, config)
        var thisGoods = await OrdersService.getCart(response.data[0].cart_id);
        goodsGlobal.set(id, thisGoods);
    }

    static async getProductsWPhoto(id, first) {
        var response  = await axios.get(`https://market-bot.org:8082/clients_api/clients_orders/get_orders/${userInfo[0].bot_id}?client_id=${userInfo[0].id}&order_id=${id}`, config)
        var thisGoods = await OrdersService.getCart(response.data[0].cart_id);
        if (first) {
          if (typeof thisGoods !== 'undefined') {
            if (typeof thisGoods[0].product !== 'undefined') {
              if (thisGoods[0].product !== null) {
              var photo = await OrdersService.getPhoto(userInfo[0].bot_id, thisGoods[0].product.id, 0)
              thisGoods[0].product.photoFile = photo;
              } else {
                thisGoods[0].product = {
                  photoFile: '',
                };
              }
            }
          }
        }
        goodsGlobal.set(id, thisGoods);
    }
    
    static async getCart(cartId) {
        var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_carts/${userInfo[0].bot_id}?client_id=${userInfo[0].id}&cart_id=${cartId}`, config)
        return response.data.data[0].products;
    }

    static async getPhoto(prodId, photoNumber) {
        try {
          var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_photo/${userInfo[0].bot_id}?product_id=${prodId}&photo_number=${photoNumber}`, {
            headers: {
              'Authorization': tokenString,
            },
            responseType: 'blob'
          })
          if (response.status === 200) {
            return URL.createObjectURL(response.data)
          } else {
            return null;
          }
        } catch (e) {
          console.log(e)
        }
    }
}