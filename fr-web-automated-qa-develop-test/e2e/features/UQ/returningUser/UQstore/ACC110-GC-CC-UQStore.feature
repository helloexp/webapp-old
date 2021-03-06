Feature: ACC110

  Scenario: Existing user with Pick up at Uniqlo store, Hemming and Payment with One Gift Card and Credit Card(ACC110)

    Given User goes to Cart
    When User goes to Login page
    When User logs in
      | email    | automation110@uniqlo.com |
      | password | test1234                 |

    Then User is successfully logged in
    When User goes to Cart
    When Prerequisites Reset user Cart data
    Given User adds products for "ACC110" to cart from mock page
    Given User goes to Cart
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the uniqlo delivery method
    When User select a Uniqlo Store to deliver
    When User select the giftcard payment method
    When User adds a gift card and proceed with part payment mode
      | type       | giftcard            |
      | cardNumber | 9999-1001-0000-0001 |
      | pin        | 1234                |
      | amount     | 100                 |
      | message    | Good day!!!         |

    When User select the creditCard payment method
    When User selects the existing credit card
    Then User is redirected to Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User opens MiniBag
    Then MiniBag price details are accurate
    When User closes the MiniBag
    When User fills credit card CVV code "123"
    