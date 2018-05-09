Feature: ACC84

  Scenario: Existing user with Shipping Address, Bydate, Coupon, Gifting as UniqloBox and Payment using one Gift Card and Credit Card (ACC84)
    Given User goes to Cart
    When User goes to Login page
    When User logs in
      | email    | automation84@uniqlo.com |
      | password | test1234                 |

    Then User is successfully logged in
    When Prerequisites Reset user Cart data
    Given User adds products for "ACC84" to cart from mock page
    And User goes to Cart
    When User gets the order summary price details
    When User adds a uq coupon
    Then Coupon is applied in cart
    When User enables the gift option
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User selects and submits an existing address
    When User selects bydate shipping method
    When User confirms the shipping method
    When User edits the Gifting Option from Order Payment page
    When User selects the gifting type and adds message
      | type        | uniqlobox |
      | messageType | uniqlo    |
      | message     | がんばって！|

    When User select the giftcard payment method
    When User adds a gift card and proceed with part payment mode
      | type       | giftcard            |
      | cardNumber | 9999-1001-0000-0004 |
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
    Then Coupon amount is correct on minibag
    When User closes the MiniBag
    When User fills credit card CVV code "123"
    Then Validate applied coupons in review order page
