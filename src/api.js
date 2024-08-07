function Api() {
    let clientId = 1
    //get contacts
      useEffect(() => {
          response = fetch(`http://togethergame:8001/info/get_contacts/?bot_id=${botId}&client_id=${clientId}`)
              .then(response => response.json())
              .then(data => setTotalReactPackages(data.total));
      }, []);
    
      let orderId = 1
    //хз что это
      useEffect(() => {
          response = fetch(`http://togethergame:8001/clients_orders/delivery/get_variants?order_id=${orderId}`)
              .then(response => response.json())
              .then(data => setTotalReactPackages(data.total));
      }, []);
    
    //get orders
      useEffect(() => {
          response = fetch(`http://togethergame:8001/clients_orders/get_orders?bot_id=${botId}&client_id=${clientId}`)
              .then(response => response.json())
              .then(data => setTotalReactPackages(data.total));
      }, []);
    
    //get single order
      useEffect(() => {
          response = fetch(`http://togethergame:8001/clients_orders/get_orders?bot_id=${botId}&client_id=${clientId}&order_id=${orderId}`)
              .then(response => response.json())
              .then(data => setTotalReactPackages(data.total));
      }, []);
    
    //get past orders
      useEffect(() => {
          response = fetch(`http://togethergame:8001/clients_orders/get_past_orders/?bot_id=${botId}&client_id=${clientId}`)
              .then(response => response.json())
              .then(data => setTotalReactPackages(data.total));
      }, []);
    
    //get carts
      useEffect(() => {
        response = fetch(`http://togethergame:8001/clients_menu/get_carts?client_id=${clientId}`)
            .then(response => response.json())
            .then(data => setTotalReactPackages(data.total));
      }, []);
    
      let cartId = 1  
    //get single cart
      useEffect(() => {
        response = fetch(`http://togethergame:8001/clients_menu/get_carts?client_id=${clientId}&cart_id=${cartId}`)
            .then(response => response.json())
            .then(data => setTotalReactPackages(data.total));
      }, []);
    
      let prodId = 1
    //get prod photo
      useEffect(() => {
        response = fetch(`http://togethergame:8001/clients_menu/get_photo?bot_id=${botId}&product_id=${prodId}`)
            .then(response => response.json())
            .then(data => setTotalReactPackages(data.total));
      }, []);
    
    //get menu
      useEffect(() => {
        response = fetch(`http://togethergame:8001/clients_menu/get_all_menu/?bot_id=${botId}&client_id=${clientId}`)
            .then(response => response.json())
            .then(data => setTotalReactPackages(data.total));
      }, []);
    
      let name = ''
    //get prod by name
      useEffect(() => {
        response = fetch(`http://togethergame:8001/clients_menu/get_all_menu/?bot_id=${botId}&client_id=${clientId}&name=${name}`)
            .then(response => response.json())
            .then(data => setTotalReactPackages(data.total));
      }, []);
    
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
        fetch('http://togethergame:8001/clients_menu/add_to_cart', requestOptions)
            .then(response => response.json())
            .then(data => setPostId(data.id));
      }, []);
    
    //create cart
      useEffect(() => {
        const requestOptions = {
            method: 'POST'
        };
        fetch(`http://togethergame:8001/clients_menu/create_cart?client_id=${clientId}`, requestOptions)
            .then(response => response.json())
            .then(data => setPostId(data.id));
      }, []);
    
    //pay for cart (with cart id)
      useEffect(() => {
        const requestOptions = {
            method: 'POST'
        };
        fetch(`http://togethergame:8001/clients_menu/get_all_menu?bot_id=${botId}&client_id=${clientId}&cart_id=${cartId}`, requestOptions)
            .then(response => response.json())
            .then(data => setPostId(data.id));
      }, []);
    
    //pay for cart (without cart id)
      useEffect(() => {
        const requestOptions = {
            method: 'POST'
        };
        fetch(`http://togethergame:8001/clients_menu/get_all_menu?bot_id=${botId}&client_id=${clientId}`, requestOptions)
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
        fetch('http://togethergame:8001/clients_orders/create_order', requestOptions)
            .then(response => response.json())
            .then(data => setPostId(data.id));
      }, []);
}