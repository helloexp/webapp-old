Feature: ACC139

  Scenario: Existing user with Shipping Address, gifting as GU Material and Payment using Credit Card(ACC139)
    Given User goes to gu Cart
    When User goes to Login page
    When User logs in
      | email    | automation139@uniqlo.com |
      | password | test1234                 |

    Then User is successfully logged in
    When Prerequisites Reset user Cart data
    Given User adds products for "ACC139" to cart from mock page
    And User goes to gu Cart
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User selects and submits an existing address
    When User selects standard shipping method
    When User confirms the shipping method
    When User select the creditCard payment method
    When User selects the existing credit card
    Then User is redirected to Order Review page
    When User edits the Gifting Option from Order Review page
    When User selects the gifting type and adds message
      | type        | gumaterial |
      | messageType | gu         |
      | message     | がんばって！ |

    When User adds a gu coupon from Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User opens MiniBag
    Then MiniBag price details are accurate
    Then Coupon amount is correct on minibag
    When User closes the MiniBag
    When User fills credit card CVV code "123"
