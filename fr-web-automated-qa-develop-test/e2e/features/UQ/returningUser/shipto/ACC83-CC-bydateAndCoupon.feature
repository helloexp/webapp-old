Feature: ACC83

  Scenario: Existing user with Shipping Address, bydate, coupon and Payment using Credit Card (ACC83)
    Given User goes to Cart
    When User goes to Login page
    When User logs in
      | email    | automation83@uniqlo.com |
      | password | test1234                 |

    Then User is successfully logged in
    When Prerequisites Reset user Cart data
    Given User adds products for "ACC83" to cart from mock page
    And User goes to Cart
    When User gets the order summary price details
    When User adds a uq coupon
    Then Coupon is applied in cart
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User selects and submits an existing address
    When User selects bydate shipping method
    When User confirms the shipping method
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
