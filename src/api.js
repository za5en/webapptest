function Api() {
//GET
    let clientId = 1
    //get contacts
      useEffect(() => {
          response = fetch(`https://market-bot.org:8082/clients_api/info/get_contacts/?bot_id=${botId}&client_id=${clientId}`)
              .then(response => response.json())
              .then(data => setTotalReactPackages(data.total));
      }, []);
    
      let orderId = 1
    //хз что это
      useEffect(() => {
          response = fetch(`https://market-bot.org:8082/clients_api/clients_orders/delivery/get_variants?order_id=${orderId}`)
              .then(response => response.json())
              .then(data => setTotalReactPackages(data.total));
      }, []);
    
    //get orders
      useEffect(() => {
          response = fetch(`https://market-bot.org:8082/clients_api/clients_orders/get_orders?bot_id=${botId}&client_id=${clientId}`)
              .then(response => response.json())
              .then(data => setTotalReactPackages(data.total));
      }, []);
    
    //get single order
      useEffect(() => {
          response = fetch(`https://market-bot.org:8082/clients_api/clients_orders/get_orders?bot_id=${botId}&client_id=${clientId}&order_id=${orderId}`)
              .then(response => response.json())
              .then(data => setTotalReactPackages(data.total));
      }, []);
    
    //get past orders
      useEffect(() => {
          response = fetch(`https://market-bot.org:8082/clients_api/clients_orders/get_past_orders/?bot_id=${botId}&client_id=${clientId}`)
              .then(response => response.json())
              .then(data => setTotalReactPackages(data.total));
      }, []);
    
    //get carts
      useEffect(() => {
        response = fetch(`https://market-bot.org:8082/clients_api/clients_menu/get_carts?client_id=${clientId}`)
            .then(response => response.json())
            .then(data => setTotalReactPackages(data.total));
      }, []);
    
      let cartId = 1  
    //get single cart
      useEffect(() => {
        response = fetch(`https://market-bot.org:8082/clients_api/clients_menu/get_carts?client_id=${clientId}&cart_id=${cartId}`)
            .then(response => response.json())
            .then(data => setTotalReactPackages(data.total));
      }, []);
    
      let prodId = 1
    //get prod photo
      useEffect(() => {
        response = fetch(`https://market-bot.org:8082/clients_api/clients_menu/get_photo?bot_id=${botId}&product_id=${prodId}`)
            .then(response => response.json())
            .then(data => setTotalReactPackages(data.total));
      }, []);
    
    //get menu
      useEffect(() => {
        response = fetch(`https://market-bot.org:8082/clients_api/clients_menu/get_all_menu/?bot_id=${botId}&client_id=${clientId}`)
            .then(response => response.json())
            .then(data => setTotalReactPackages(data.total));
      }, []);
    
      let name = ''
    //get prod by name
      useEffect(() => {
        response = fetch(`https://market-bot.org:8082/clients_api/clients_menu/get_all_menu/?bot_id=${botId}&client_id=${clientId}&name=${name}`)
            .then(response => response.json())
            .then(data => setTotalReactPackages(data.total));
      }, []);

    //get tech support request
      useEffect(() => {
        response = fetch(`https://market-bot.org:8082/clients_api/technical_support/get_my_request/?bot_id=${botId}&client_id=${clientId}`)
            .then(response => response.json())
            .then(data => setTotalReactPackages(data.total));
      }, []);

    //get review
      useEffect(() => {
        response = fetch(`https://market-bot.org:8082/clients_api/reviews/get_review/?bot_id=${botId}&client_id=${clientId}&review_id=${reviewId}`)
            .then(response => response.json())
            .then(data => setTotalReactPackages(data.total));
      }, []);

    //get reviews
    useEffect(() => {
      response = fetch(`https://market-bot.org:8082/clients_api/clients_menu/get_reviews/?bot_id=${botId}&client_id=${clientId}&product_id=${prodId}`)
          .then(response => response.json())
          .then(data => setTotalReactPackages(data.total));
    }, []);
    
//POST
      let count = 1
      let price = 0
      let groupName = ''
      let optionName = ''
      let article = ''
      let optionPrice = 0
      let optionWeight = 0
      let optionMax = 0
    //add to cart
      useEffect(() => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cart_id: cartId,
              product_id: prodId,
              count: count,
              price: price,
              option: [
                {
                  group_name: groupName,
                  options: [
                    {
                      name: optionName,
                      article_number: article,
                      price: optionPrice,
                      weight: optionWeight,
                      max_count: optionMax
                    }
                  ]
                }
              ]
            })
        };
        fetch('https://market-bot.org:8082/clients_api/clients_menu/add_to_cart', requestOptions)
            .then(response => response.json())
            .then(data => setPostId(data.id));
      }, []);
    
    //create cart
      useEffect(() => {
        const requestOptions = {
            method: 'POST'
        };
        fetch(`https://market-bot.org:8082/clients_api/clients_menu/create_cart?client_id=${clientId}`, requestOptions)
            .then(response => response.json())
            .then(data => setPostId(data.id));
      }, []);

    //update rate
      useEffect(() => {
        const requestOptions = {
            method: 'POST'
        };
        fetch(`https://market-bot.org:8082/clients_api/clients_menu/update_rate/?product_id=${prodId}`, requestOptions)
            .then(response => response.json())
            .then(data => setPostId(data.id));
      }, []);
    
    //pay for cart (with cart id)
      useEffect(() => {
        const requestOptions = {
            method: 'POST'
        };
        fetch(`https://market-bot.org:8082/clients_api/clients_menu/get_all_menu?bot_id=${botId}&client_id=${clientId}&cart_id=${cartId}`, requestOptions)
            .then(response => response.json())
            .then(data => setPostId(data.id));
      }, []);
    
    //pay for cart (without cart id)
      useEffect(() => {
        const requestOptions = {
            method: 'POST'
        };
        fetch(`https://market-bot.org:8082/clients_api/clients_menu/get_all_menu?bot_id=${botId}&client_id=${clientId}`, requestOptions)
            .then(response => response.json())
            .then(data => setPostId(data.id));
      }, []);
    
      let payment = ''
      let deliveryType = ''
      let deliveryAddress = ''
      let comment = ''
      let phone = ''
      let promo = ''
    //create order
      useEffect(() => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              "client_id": clientId,
              "bot_id": botId,
              "cart_id": cartId,
              "pay_type": payment,
              "delivery_type": deliveryType,
              "delivery_address": deliveryAddress,
              "comment": comment,
              "phone": phone,
              "promo_code": promo
            })
        };
        fetch('https://market-bot.org:8082/clients_api/clients_orders/create_order', requestOptions)
            .then(response => response.json())
            .then(data => setPostId(data.id));
      }, []);

      let title = ''
      let content = ''
      let email = ''
      let photo = ''
    //tech support create request
      useEffect(() => {
        const requestOptions = {
            method: 'POST'
        };
        fetch(`https://market-bot.org:8082/clients_api/technical_support/create_request/?bot_id=${botId}&client_id=${clientId}&title=${title}&content=${content}&email=${email}&photo=${photo}`, requestOptions)
            .then(response => response.json())
            .then(data => setPostId(data.id));
      }, []);

    //tech support create request without photo
      useEffect(() => {
        const requestOptions = {
            method: 'POST'
        };
        fetch(`https://market-bot.org:8082/clients_api/technical_support/create_request/?bot_id=${botId}&client_id=${clientId}&title=${title}&content=${content}&email=${email}`, requestOptions)
            .then(response => response.json())
            .then(data => setPostId(data.id));
      }, []);

      let reviewId = 1
      let rate = 1
    //create review
      useEffect(() => {
        const requestOptions = {
            method: 'POST'
        };
        fetch(`https://market-bot.org:8082/clients_api/reviews/create_review/?bot_id=${botId}&client_id=${clientId}&product_id=${prodId}&content=${content}&rate=${rate}&photo=${photo}`, requestOptions)
            .then(response => response.json())
            .then(data => setPostId(data.id));
      }, []);

    //create review without photo
      useEffect(() => {
        const requestOptions = {
            method: 'POST'
        };
        fetch(`https://market-bot.org:8082/clients_api/reviews/create_review/?bot_id=${botId}&client_id=${clientId}&product_id=${prodId}&content=${content}&rate=${rate}`, requestOptions)
            .then(response => response.json())
            .then(data => setPostId(data.id));
      }, []);

    //change review
      useEffect(() => {
        const requestOptions = {
            method: 'POST'
        };
        fetch(`https://market-bot.org:8082/clients_api/reviews/change_review/?bot_id=${botId}&client_id=${clientId}&review_id=${reviewId}&content=${content}&rate=${rate}`, requestOptions)
            .then(response => response.json())
            .then(data => setPostId(data.id));
      }, []);

    //delete review
      useEffect(() => {
        const requestOptions = {
            method: 'POST'
        };
        fetch(`https://market-bot.org:8082/clients_api/reviews/delete_review/?bot_id=${botId}&client_id=${clientId}&review_id=${reviewId}`, requestOptions)
            .then(response => response.json())
            .then(data => setPostId(data.id));
      }, []);
}