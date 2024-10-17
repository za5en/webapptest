import { useTelegram } from '../hooks/useTelegram';
import { userInfo } from '../components/TestData/user.jsx';
import { products, categories, banners, catNames, stickerInfo, stickerContent } from "../components/TestData/prod";
import { useState } from "react";
import axios from "axios";
import { contacts } from "../components/Profile/Profile.jsx";
import { config } from "../api";

export default class StartService {
    static async getUser(botId) {
        const {user} = useTelegram();
        // let userId = 649105595
        
        try {
            console.log(botId)
            var response  = await axios.get(`https://market-bot.org:8082/clients_api/user/get_user/${botId}?client_tg_id=${user.id}`, config)
            userInfo = response.data
            if (response.status === 200) {
                await StartService.Start();
            }
        } catch (e) {
            console.log(e)
        }
    }

    static async Start() {        
        async function getMenu(botId) {
            const [appState, setAppState] = useState();
            try {
            var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_all_menu/${botId}?client_id=${userInfo[0].id}`, config)
            products = response.data
            categories = []
            catNames = new Map()
            await getCategories(botId);
            var favList = await getFavoritesProducts(botId);
            var stickers = await getStickerProducts(botId);
          
            if (typeof stickers !== 'undefined' && typeof stickers.sticker_products !== 'undefined') {
              for (let i = 0; i < stickers.sticker_products.length; i++) {
                var tmp = stickerInfo.get(stickers.sticker_products[i].product_id);
                if (typeof tmp === 'undefined') {
                  tmp = [stickers.sticker_products[i].sticker_id];
                  await getSticker(botId, stickers.sticker_products[i].sticker_id);
                } else {
                  if (!tmp.includes(stickers.sticker_products[i].sticker_id)) {
                    tmp.push(stickers.sticker_products[i].sticker_id);
                    await getSticker(botId, stickers.sticker_products[i].sticker_id);
                  }
                }
                stickerInfo.set(stickers.sticker_products[i].product_id, tmp);
              }
            }
          
            for (let i = 0; i < products.length; i++) {
              if (typeof products[i].category_id === 'undefined' || products[i].category_id === null) {
                if (!categories.includes('Без категории')) {
                  categories.push('Без категории')
                }
                products[i].category_name = 'Без категории'
              } else {
                products[i].category_name = catNames.get(products[i].category_id)
              }
              products[i].photoFile = [];
              var ok = true;
              for (var j = 0; j < 3 && ok; j++) {
                var photo = await getPhoto(botId, products[i].id, j)
                if (typeof photo === 'undefined') {
                  ok = false;
                } else {
                  products[i].photoFile.push(photo);
                }
              }
              if (typeof favList !== 'undefined') {
                if (favList.includes(products[i].id)) {
                  products[i].like = true;
                } else {
                  products[i].like = false;
                }
              }
            }
            setAppState(response);
          } catch (e) {
            // console.log(e)
          }
        }
        
        async function getFavoritesProducts(botId) {
          try {
            var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_favorite_products/${botId}?client_id=${userInfo[0].id}`, config)
            var favs = []
            for (let i = 0; i < response.data.favorite_products.length; i++) {
              favs.push(response.data.favorite_products[i].id);
            }
            return favs;
          } catch (e) {
            // console.log(e)
          }
        }
        
        async function getCategories(botId) {
          try {
            var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_category/${botId}`, config)
            var tmp = new Map()
            if (response.status === 200) {
              for (let i = 0; i < response.data.categories.length; i++) {
                if (response.data.categories[i].position === i + 1) {
                  if (!categories.includes(response.data.categories[i].name)) {
                    categories.push(response.data.categories[i].name);
                    catNames.set(response.data.categories[i].id, response.data.categories[i].name);
                  }
                } else {
                  tmp.set(response.data.categories[i].position, response.data.categories[i].name);
                  var current = tmp.get(i + 1)
                  if (typeof current !== "undefined" && current !== null && current !== "") {
                    if (!categories.includes(current)) {
                      categories.push(current);
                    }
                  }
                }
              }
          }
          } catch (e) {
            // console.log(e)
          }
        }
        
        async function getPhoto(botId, prodId, photoNumber) {
          const {tokenString} = useTelegram();
          try {
            var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_photo/${botId}?product_id=${prodId}&photo_number=${photoNumber}`, {
              headers: {
                'Authorization': tokenString,
              },
              responseType: 'blob'})
            if (response.status === 200) {
              return URL.createObjectURL(response.data)
            } else {
              return null;
            }
          } catch (e) {
            // console.log(e)
          }
        }
        
        async function getContacts(botId) {
          try {
            var response  = await axios.get(`https://market-bot.org:8082/clients_api/info/get_contacts/${botId}?client_id=${userInfo[0].id}`, config)
            while (contacts.length > 0) {
              contacts.pop()
            }
            contacts.push(response.data[0])
            if (typeof contacts[0].schedule !== "undefined" && contacts[0].schedule !== null && contacts[0].schedule !== "") {
              contacts[0].worktime = new Map()
              var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
              var dayNames = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"]
              for (let i = 0; i < days.length; i++) {
                if (contacts[0].schedule.indexOf(days[i]) !== -1) {
                  contacts[0].schedule = contacts[0].schedule.substring(contacts[0].schedule.indexOf(days[i]) + 5)
                  var start = contacts[0].schedule.substring(contacts[0].schedule.indexOf("start") + 8, contacts[0].schedule.indexOf("start") + 13)
                  var finish = contacts[0].schedule.substring(contacts[0].schedule.indexOf("finish") + 9, contacts[0].schedule.indexOf("finish") + 14)
                  contacts[0].worktime.set(dayNames[i], `${start} - ${finish}`)
                } else {
                  contacts[0].worktime.set(dayNames[i], "Выходной")
                }
              }
            }
          } catch (e) {
            // console.log(e)
          }
        }
        
        async function getStickerProducts(botId) {
          try {
            var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_sticker_products_by_bot/${botId}`, config)
            return response.data
          } catch (e) {
            // console.log(e)
          }
        }
        
        async function getSticker(botId, id) {
          try {
            var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_sticker/${id}&${botId}`, config)
            stickerContent.set(id, response.data);
            return response.data
          } catch (e) {
            // console.log(e)
          }
        }
        
        async function getBotInfo(botId) {
          try {
            var response  = await axios.get(`https://market-bot.org:8082/clients_api/info/get_bot_info/${botId}`, config)
            userInfo[0].haveDelivery = response.data.have_delivery;
            userInfo[0].limit_bonuses = response.data.limit_bonuses;
            userInfo[0].cashback = response.data.cashback;
            userInfo[0].delivery_cost = response.data.delivery_cost;
          } catch (e) {
            // console.log(e)
          }
        }
        
        async function getBanners(botId) {
          try {
            var response  = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_banners/${botId}?client_id=${userInfo[0].id}`, config)
            banners = response.data.banners;
            for (let i = 0; i < banners.length; i++) {
              var photo = await getBannerPhoto(botId, banners[i].banner_id)
              banners[i].photoFile = photo;
            }
          } catch (e) {
            // console.log(e)
          }
        }
        
        async function getBannerPhoto(botId, bannerId) {
          const {tokenString} = useTelegram();
          try {
            var response  = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_banner_photo/${botId}?banner_id=${bannerId}`, {
              headers: {
                'Authorization': tokenString,
              },
              responseType: 'blob'})
            return URL.createObjectURL(response.data)
          } catch (e) {
            // console.log(e)
          }
        }
        
        await getMenu(botId);
        await getContacts(botId);
        await getBotInfo(botId);
        await getBanners(botId);
    }
}