Feature: ACC141

  Scenario: Existing user with Shipping Address and bydate, Coupon and payment using Credit Card(ACC141)
    Given User goes to gu Cart
    When User goes to Login page
    When User logs in
      | email    | automation141@uniqlo.com |
      | password | test1234                 |

    Then User is successfully logged in
    When Prerequisites Reset user Cart data
    Given User adds products for "ACC141" to cart from mock page
    And User goes to gu Cart
    When User adds a gu coupon from Cart page
    When User gets the order summary price details
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
