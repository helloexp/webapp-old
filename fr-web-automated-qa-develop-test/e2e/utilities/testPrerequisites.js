/*
 Utility module for creating test prerequisites
 */
let request = require('request');
let apiUrls = require('../data/apiUrls');

module.exports = {

  /**
   * Set OP.LGN to make user login across the app
   *
   */
  getLoginCookiesBeforeLogin: function () {
    if(!browser.getUrl().includes('test')) {
      browser.url(browser.params.testUrl+"cart");
    }
    browser.params.OP_LGN = browser.getCookie('OP.LGN');
    browser.params.OP_LGN.domain = '.uniqlo.com';
    browser.setCookie(browser.params.OP_LGN);
  },

  /**
   * Set OP.LGN to make user login across the app
   *
   */
  setLoginCookiesBeforeLogin: function () {
    // this.getLoginCookiesBeforeLogin();      // test3 cart page is taking more time to load hence we are using timestamp
    browser.params.OP_LGN = {
      name: 'OP.LGN',
      value : new Date().getTime().toString(),
    };
    browser.pause(500);
    browser.setCookie(browser.params.OP_LGN);
    browser.pause(500);    
  },

  /**
   * Delete OP.LGN to make user logout the app
   */
  deleteLoginCookies: function () {
    browser.deleteCookie('OP.LGN');
  },

  /**
   * Gets application JSESSIONID and uniqlo-token cookies and sets them as browser params
   *
   * {Object} JSESSIONIDCookie
   * {Object} uniqloTokenCookie
   */
  setLoginCookies: function () {
     browser.params.JSESSIONIDCookie = browser.getCookie('JSESSIONID') || {};
    browser.params.uniqloTokenCookie = JSON.parse(browser.localStorage('GET', 'uniqloToken').value);
  },

  /**
   * Gets application mcnu cookies and tvu and sets them as browser params
   *
   * {Object} mcnuCookie
   * {Object} tvuCookie
   */
  setCartCookies: function () {
    browser.params.mcnuCookie = browser.getCookie('mcnu') || {};
    browser.params.tvuCookie = browser.getCookie('tvu') || {};
    browser.params.mcngCookie = browser.getCookie('mcng') || {};
    browser.params.tvgCookie = browser.getCookie('tvg') || {};
  },

  /**
   * Gets application uniqlo-order cookie and sets it as browser params
   *
   * {Object} uniqlo-order
   */
  setOrderCookies: function () {
    browser.waitUntil(() => {
      return browser.getCookie('uniqlo-order');
    }, 8000, `Expected cookie uniqlo-order to be defined but was ${browser.getCookie('uniqlo-order')} `);

    browser.params.orderCookie = JSON.parse(this.base64Decode(browser.getCookie('uniqlo-order') || {}) || {});
  },

  /**
   * Deleted cart related cookies: mcnu and tvu
   */
  deleteUqCartCookies: function () {
    browser.deleteCookie('mcnu');
    browser.deleteCookie('tvu');
  },

  /**
   * Deleted cart related cookies: mcng and tvg
   */
  deleteGuCartCookies: function () {
    browser.deleteCookie('mcng');
    browser.deleteCookie('tvg');
  },

  /**
   * Gets user credit card information
   *
   * @param {Object} JSESSIONIDCookie
   *
   * @return {Object} creditCardData || undefined (if no credit card data is available)
   */
  getUserCreditCard: function (JSESSIONIDCookie) {
    let URL = apiUrls.getUserCreditCard;

    let jar = request.jar();
    let cookie = request.cookie('JSESSIONID=' + JSESSIONIDCookie.value);
    jar.setCookie(cookie, URL);

    return new Promise(function (resolve) {
      request({
        url: URL, //URL to hit
        qs: {client_id: 'cms_sp_id'}, //Query string data
        method: 'GET', //Specify the method
        headers: { //Define headers
          'Content-Type': 'application/json;charset=UTF-8'
        },
        jar: jar //Add cookies
      }, function (error, response, body) {
        if (error) {
          console.log(error);
          resolve(undefined);
        } else {
          resolve(JSON.parse(body));
        }
      });
    });
  },

  /**
   * Deletes user credit card information
   *
   * @param {Object} JSESSIONIDCookie
   * @param {Object} creditCardData
   */
  deleteUserCreditCard: function (JSESSIONIDCookie, creditCardData, uniqloTokenCookie) {
    let URL = apiUrls.deleteUserCreditCard;

    let jar = request.jar();
    let cookie = request.cookie('JSESSIONID=' + JSESSIONIDCookie.value);
    jar.setCookie(cookie, URL);

    return new Promise(function (resolve) {
      request({
        url: URL, //URL to hit
        qs: {
          client_id: 'cms_sp_id',
          db_key: creditCardData.db_key,
          accesstoken: 'uniqloTokenCookie.accessToken',
          access_token: 'uniqloTokenCookie.accessToken'
        }, //Query string data
        method: 'GET', //Specify the method
        headers: { //Define headers
          'Content-Type': 'application/json;charset=UTF-8'
        },
        jar: jar //Add cookies
      }, function (error, response, body) {
        if (error) {
          console.log(error);
          resolve(undefined);
        } else {
          resolve(JSON.parse(body));
        }
      });
    });
  },

  /**
   * Deletes user addressinformation
   *
   * @param {Object} uniqloTokenCookie
   *
   * @return {Object} deleteAddressResponse || undefined
   */
  resetUserAddress: function (uniqloTokenCookie) {
    let URL = apiUrls.resetUserAddress;

    let defaultAddress = {
      'MOBILE_IDENT_FLG': '0',
      'CUST_NO': null,
      'COMPANY_NAME': null,
      'DEPARTMENT_NAME': null,
      'CUST_NOTE': null,
      'HASHED_CUST_NO': null,
      'ADDR_NM_LAST': null,
      'ADDR_NM_FIRST': null,
      'ADDR_NM_KANA_LAST': null,
      'ADDR_NM_KANA_FIRST': null,
      'ADDR_STATE': null,
      'ADDR_CITY': null,
      'ADDR1': null,
      'ADDR2': null,
      'ZIPCODE': '1076231',
      'TEL_NO': null,
      'MOBILE_NO': null
    };

    return new Promise(function (resolve) {
      if (uniqloTokenCookie && uniqloTokenCookie.accessToken) {
        request({
          url: URL, //URL to hit
          qs: {
            accesstoken: uniqloTokenCookie.accessToken,
          }, //Query string data
          method: 'POST', //Specify the method
          headers: { //Define headers
            'Content-Type': 'application/json;charset=UTF-8'
          },
          json: true,
          body: defaultAddress
        }, function (error, response, body) {
          if (error) {
            console.log(error);
            resolve(undefined);
          } else {
            resolve(true);
          }
        });
      } else {
        resolve(undefined);
      }
    });
  },

  /**
   * Deletes user UQ cart information
   *
   * @param {Object} mcnuCookie
   * @param {Object} tvuCookie
   *
   * @return {Object} deleteCartResponse || undefined
   */
  deleteUserUqCart: function (mcnuCookie, tvuCookie) {
    let URL = apiUrls.deleteUserUqCart;

    return new Promise(function (resolve) {
      if (mcnuCookie && tvuCookie) {
        request({
          url: URL, //URL to hit
          qs: {
            client_id: 'cms_sp_id',
            cart_no: mcnuCookie.value,
            token: tvuCookie.value
          }, //Query string data
          method: 'GET', //Specify the method
          headers: { //Define headers
            'Content-Type': 'application/json;charset=UTF-8'
          },
        }, function (error/*, response, body*/) {
          if (error) {
            console.log(error);
            resolve(undefined);
          } else {
            resolve(true);
          }
        });
      } else {
        resolve(undefined);
      }
    });
  },

  /**
   * Deletes user GU cart information
   *
   * @param {Object} mcnuCookie
   * @param {Object} tvuCookie
   *
   * @return {Object} deleteCartResponse || undefined
   */
  deleteUserGuCart: function (mcngCookie, tvgCookie) {
    let URL = apiUrls.deleteUserGuCart;

    return new Promise(function (resolve) {
      if (mcngCookie && tvgCookie) {
        request({
          url: URL, //URL to hit
          qs: {
            client_id: 'cms_sp_id',
            cart_no: mcngCookie.value,
            token: tvgCookie.value
          }, //Query string data
          method: 'GET', //Specify the method
          headers: { //Define headers
            'Content-Type': 'application/json;charset=UTF-8'
          },
        }, function (error/*, response, body*/) {
          if (error) {
            console.log(error);
            resolve(undefined);
          } else {
            resolve(true);
          }
        });
      } else {
        resolve(undefined);
      }
    });
  },

  /**
   * Get memberID based on email and password
   *
   * @param user
   * @return {Promise}
   */
  getMemberId: function (user) {
    let URL = apiUrls.getMemberId;

    return new Promise(function (resolve) {
      request({
        url: URL, //URL to hit
        qs: {
          clientid: 'sample-client',
          loginid: user.email,
          password: user.password,
          clientsecret: 'sample-secret'
        }, //Query string data
        method: 'POST', //Specify the method
        headers: { //Define headers
          'Accept': 'application/json;charset=UTF-8',
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }, function (error, response) {
        if (error) {
          console.log(error);
          resolve(undefined);
        } else {
          resolve(response);
        }
      });
    });
  },

  /**
   * Get login token based on memberID
   *
   * @param memberId
   * @return {Promise}
   */
  getToken: function (memberId) {
    let URL = apiUrls.getToken;

    return new Promise(function (resolve) {
      request({
        url: URL, //URL to hit
        qs: {
          clientid: 'sample-client',
          original_clientid: 'sample-client',
          memberid: memberId,
          clientsecret: 'sample-secret',
          rscopes: 'loginid',
          rwscopes: 'loginid'
        }, //Query string data
        method: 'POST', //Specify the method
        headers: { //Define headers
          'Accept': 'application/json;charset=UTF-8',
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }, function (error, response) {
        if (error) {
          console.log(error);
          resolve(undefined);
        } else {
          resolve(response);
        }
      });
    });
  },

  /**
   * Get JSESSIONID based on user accessToken
   *
   * @param accessToken
   * @return {Promise}
   */
  getSessionId: function (accessToken) {
    let URL = apiUrls.getSessionId;

    return new Promise(function (resolve) {
      request({
        url: URL, //URL to hit
        qs: {
          client_id: 'cms_sp_id',
          client_secret: 'cms_sp_secret',
          callback: 'callback',
          accesstoken: accessToken,
          access_token: accessToken,
          redirect_url_afterlogin: `http://dev.uniqlo.com:3000/jp/login`
        }, //Query string data
        method: 'PUT', //Specify the method
        headers: { //Define headers
          'Accept': 'application/json;charset=UTF-8',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }, function (error, response) {
        if (error) {
          console.log(error);
          resolve(undefined);
        } else {
          resolve(response);
        }
      });
    });
  },

  /**
   * Create new UQ coupon for user
   *
   * @param {int} amount, amount to be applied for the coupon
   * @return {Promise}
   */
  createNewUqCoupon: function (amount) {
    const URL = apiUrls.createNewUqCoupon;
    const startTime = browser.execute(() => new Date().getTime()).value;
    const endTime = browser.execute((startTime) => new Date(startTime + 864000000).getTime(), startTime).value;

    let couponData = {
      amount: amount,
      coupon_name: startTime.toString().substr(1),
      end_time: endTime,
      lowest_price: 100,
      start_time: startTime,
      has_barcode: 1,
      status: 1,
      gds_id: startTime.toString().substr(1),
      max_n_per_customer: -1,
      max_usage_per_customer: 50,
      environments: ['ec', 'store'],
    };

    return new Promise(function (resolve) {
      request({
        url: URL,           // URL to hit
        qs: {                   // Query string data
          no_hmac: 1
        },
        method: 'POST',        // Specify the method
        json: true,
        form: couponData,
        headers: {                       // Define headers
          'date': endTime,
          'Accept': 'application/json;charset=UTF-8',
          'authorization': 'FR-COUPON',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-md5': '205d64ff9b580aadbf4829ec41dd4ef0',
          'x-fr-clientid': 'cms_sp_id',
          'x-fr-phumac-algo': '103'
        },
      }, function (error, response, body) {
        if (error) {
          console.log(error);
          resolve(undefined);
        } else {
          resolve(body);
        }
      });
    });
  },

  /**
   * Adds UQ coupon to particular user
   *
   * @param {String} couponId, couponId to be linked
   * @param {String} memberId, Member to link the coupon
   * @return {Promise}
   */
  addUqCouponToUser: function (couponId, memberId) {
    try {
      const URL = apiUrls.giveUqCouponToUser.replace('[[[cid]]]', couponId);
      const startTime = browser.execute(() => new Date().getTime()).value;

      let formData = {
        user_ids: memberId
      };

      return new Promise(function (resolve) {
        request({
          url: URL,           // URL to hit
          qs: {                   // Query string data
            no_hmac: 1
          },
          method: 'PUT',        // Specify the method
          json: true,
          form: formData,
          headers: {                       // Define headers
            'date': startTime,
            'Accept': 'application/json;charset=UTF-8',
            'authorization': 'FR-COUPON',
            'Content-Type': 'application/x-www-form-urlencoded',
            'content-md5': '205d64ff9b580aadbf4829ec41dd4ef0',
            'x-fr-clientid': 'cms_sp_id',
            'x-fr-phumac-algo': '103'
          },
        }, function (error, response, body) {
          if (error) {
            console.log(error);
            resolve(undefined);
          } else {
            resolve(body);
          }
        });
      });
    } catch (e) {
      console.log(e);
    }
  },

  /**
   * Adds GU coupon to particular user
   *
   * @param {String} couponId, couponId to be linked
   * @param {String} memberId, Member to link the coupon
   * @return {Promise}
   */
  addGuCouponToUser: function (couponId, memberId) {
    try {
      const URL = apiUrls.giveGuCouponToUser.replace('[[[cid]]]', couponId);
      const startTime = browser.execute(() => new Date().getTime()).value;

      let formData = {
        user_ids: memberId
      };

      return new Promise(function (resolve) {
        request({
          url: URL,           // URL to hit
          qs: {                   // Query string data
            no_hmac: 1
          },
          method: 'PUT',        // Specify the method
          json: true,
          form: formData,
          headers: {                       // Define headers
            'date': startTime,
            'Accept': 'application/json;charset=UTF-8',
            'authorization': 'FR-COUPON',
            'Content-Type': 'application/x-www-form-urlencoded',
            'content-md5': '205d64ff9b580aadbf4829ec41dd4ef0',
            'x-fr-clientid': 'cms_sp_id',
            'x-fr-phumac-algo': '103'
          },
        }, function (error, response, body) {
          if (error) {
            console.log(error);
            resolve(undefined);
          } else {
            console.log(body);
            resolve(body);
          }
        });
      });
    } catch (e) {
      console.log(e);
    }
  },

  /**
   * Prototype function to fetch cookie and decode base64
   * @param {String} value cookie key to be parsed
   */
  base64Decode: function (cookie) {
    const encodedString = (cookie.value || '').replace(/(%3D)/g, ''); //Avoid extra characters, which is not there while checking it in browser
    return (browser.execute((encoded) => atob(encoded), encodedString) || {}).value; //To convert from base64 to String Object
  },

  /**
   * Add A NEW ADDRESS
   */
  addNewUserAddress: function (uniqloTokenCookie, JSESSIONIDCookie, shippingAddress) {
    const URL = apiUrls.memberInfo;

    const jar = request.jar();
    const cookie = request.cookie('JSESSIONID=' + JSESSIONIDCookie.value);
    jar.setCookie(cookie, URL);

    const addressInfo = {
      "givenName": shippingAddress.firstName,
      "phoneticGivenName": shippingAddress.firstNameKatakana,
      "familyName": shippingAddress.lastName,
      "phoneticFamilyName": shippingAddress.lastNameKatakana,
      "prefecture": shippingAddress.prefecture,
      "roomNumber": shippingAddress.streetNumber,
      "address": shippingAddress.aptName,
      "zipCode": shippingAddress.postalCode,
      "city": shippingAddress.city,
    };

    return new Promise(function (resolve) {
      if (uniqloTokenCookie && uniqloTokenCookie.accessToken) {
        request({
          url: URL, //URL to hit
          method: 'PATCH', //Specify the method
          headers: { //Define headers
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${uniqloTokenCookie.accessToken}`
          },
          json: true,
          body: addressInfo
        }, function (error, response, body) {
          if (error) {
            console.log(error);
            resolve(undefined);
          } else {
            resolve(true);
          }
        });
      } else {
        resolve(undefined);
      }
    });

  },

  /**
   * Get billTo details
   */
  billTo: function (JSESSIONIDCookie, mcnuCookie, tvuCookie) {
    let URL = apiUrls.billTo;
    const jar = request.jar();
    const cookie = request.cookie('JSESSIONID=' + JSESSIONIDCookie.value);
    jar.setCookie(cookie, URL);

    return new Promise(function (resolve) {
      if (mcnuCookie && tvuCookie) {
        request({
          url: URL, //URL to hit
          qs: {
            client_id: 'cms_sp_id',
            cart_no: mcnuCookie.value,
            token: tvuCookie.value
          }, //Query string data
          method: 'GET', //Specify the method
          headers: { //Define headers
            'Content-Type': 'application/json;charset=UTF-8'
          },
          jar: jar //Add cookies
        }, function (error, response, body) {
          if (error) {
            console.log(error);
            resolve(undefined);
          } else {
            resolve(JSON.parse(body));
          }
        });
      } else {
        resolve(undefined);
      }
    });
  },

  /**
   * Get cart details
   */
  cart_id: function (JSESSIONIDCookie, mcnuCookie, tvuCookie) {
    let URL = apiUrls.cart_id;
    const jar = request.jar();
    const cookie = request.cookie('JSESSIONID=' + JSESSIONIDCookie.value);
    jar.setCookie(cookie, URL);

    return new Promise(function (resolve) {
      if (mcnuCookie && tvuCookie) {
        request({
          url: URL, //URL to hit
          qs: {
            client_id: 'cms_sp_id',
            cart_no: mcnuCookie.value,
            token: tvuCookie.value
          }, //Query string data
          method: 'GET', //Specify the method
          headers: { //Define headers
            'Content-Type': 'application/json;charset=UTF-8'
          },
          jar: jar //Add cookies
        }, function (error, response, body) {
          if (error) {
            console.log(error);
            resolve(undefined);
          } else {
            resolve(JSON.parse(body));
          }
        });
      } else {
        resolve(undefined);
      }
    });
  },

  /**
   * Post order details
   */
  order: function (JSESSIONIDCookie, mcnuCookie, tvuCookie, update) {
    let URL = apiUrls.order;
    const jar = request.jar();
    const cookie = request.cookie('JSESSIONID=' + JSESSIONIDCookie.value);
    jar.setCookie(cookie, URL);

    return new Promise(function (resolve) {
      if (mcnuCookie && tvuCookie) {
        request({
          url: URL, //URL to hit
          qs: {
            client_id: 'cms_sp_id',
            cart_no: mcnuCookie.value,
            token: tvuCookie.value,
            last_upd_date: update,
            receipt_flg: '0'
          }, //Query string data
          method: 'POST', //Specify the method
          headers: { //Define headers
            'Content-Type': 'application/json;charset=UTF-8'
          },
          jar: jar //Add cookies
        }, function (error, response, body) {
          if (error) {
            console.log(error);
            resolve(undefined);
          } else {
            resolve(JSON.parse(body));
          }
        });
      } else {
        resolve(undefined);
      }
    });
  },

  /**
   * Get order details
   */
  order_id: function (JSESSIONIDCookie, ordno, hash) {
    let URL = apiUrls.order_id;
    const jar = request.jar();
    const cookie = request.cookie('JSESSIONID=' + JSESSIONIDCookie.value);
    jar.setCookie(cookie, URL);

    return new Promise(function (resolve) {
      if (ordno && hash) {
        request({
          url: URL, //URL to hit
          qs: {
            client_id: 'cms_sp_id',
            ord_no: ordno,
            hash_key: hash,
            native_app: 'uqapp'
          }, //Query string data
          method: 'GET', //Specify the method
          headers: { //Define headers
            'Content-Type': 'application/json;charset=UTF-8'
          },
          jar: jar //Add cookies
        }, function (error, response, body) {
          if (error) {
            console.log(error);
            resolve(undefined);
          } else {
            resolve(JSON.parse(body));
          }
        });
      } else {
        resolve(undefined);
      }
    });
  },
  /**
   * Get order history details
   */
  orderHistory: function (JSESSIONIDCookie) {
    let URL = apiUrls.getUserOrders;
    const jar = request.jar();
    const cookie = request.cookie('JSESSIONID=' + JSESSIONIDCookie.value);
    jar.setCookie(cookie, URL);

    return new Promise(function (resolve) {
      request({
        url: URL,           // URL to hit
        qs: {
          client_id: 'sp',
          page_no: '1',
          disp_count: '5'
        }, //Query string data
        method: 'GET',        // Specify the method
        headers: {                       // Define headers
          'Content-Type': 'application/json;charset=UTF-8'
        },
        jar: jar //Add cookies        
      }, function (error, response, body) {
        if (error) {
          console.log(error);
          resolve(undefined);
        } else {
          resolve(JSON.parse(body));
        }
      });
    });
  },  

};