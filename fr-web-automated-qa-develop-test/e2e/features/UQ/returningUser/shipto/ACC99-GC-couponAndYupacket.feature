Feature: ACC99

  Scenario: Existing user with Yupacket using two Gift Card and Coupon (ACC99)
    Given User goes to Cart
    When User goes to Login page
    When User logs in
      | email    | automation99@uniqlo.com |
      | password | test1234                |

    Then User is successfully logged in
    When Prerequisites Reset user Cart data
    Given User adds products for "ACC99" to cart from mock page
    Given User goes to Cart
    When User gets the order summary price details
    When User adds a uq coupon from Cart page
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User selects and submits an existing address
    When User selects yupacket shipping method
    When User confirms the shipping method
    Then User is redirected to Order Payment page
    When User select the giftcard payment method
    When User adds a gift card and proceed with part payment mode
      | type       | giftcard            |
      | cardNumber | 9999-1001-0000-0001 |
      | pin        | 1234                |
      | amount     | 100                 |
      | message    | Good day!!!         |

    When User select the giftcard payment method
    When User adds a gift card and proceed with full payment mode
      | type       | giftcard            |
      | cardNumber | 9999-1001-0000-0002 |
      | pin        | 1234                |
      | message    | Good day!!!         |

   Then User is redirected to Order Review page
   Then Delivery method information is accurate
   Then Payment method information is accurate
   When User opens MiniBag
   Then MiniBag price details are accurate
   Then Coupon amount is correct on minibag
   When User closes the MiniBag
   Then Validate applied coupons in review order page
