Feature: ACC101

  Scenario: Existing user with Yupacket using Credit Card and Coupon (ACC101)
    Given User goes to Cart
    When User goes to Login page
    When User logs in
      | email    |  automation101@uniqlo.com |
      | password | test1234                |

    Then User is successfully logged in
    When Prerequisites Reset user Cart data
    Given User adds products for "ACC101" to cart from mock page
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
    When User select the creditCard payment method
    When User selects the existing credit card
    Then User is redirected to Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User fills credit card CVV code "123"
    When User opens MiniBag
    Then MiniBag price details are accurate
    Then Coupon amount is correct on minibag
    When User closes the MiniBag
    Then Validate applied coupons in review order page
