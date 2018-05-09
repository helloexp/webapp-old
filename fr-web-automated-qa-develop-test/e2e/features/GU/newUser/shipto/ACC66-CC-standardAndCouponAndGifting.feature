Feature: ACC66

  Scenario: New user with new Shipping Address, gifting as GU Material and Payment using Credit Card(ACC66)
    Given User goes to gu Cart
    When  User goes to Login page
    When User decides to registers as a new user
    When User registers within the app
      | email    |          |
      | password | test1234 |

    Then User confirms the new account
    When User returns to gu Cart
    Given User adds products for "ACC66" to cart from mock page
    Given User goes to gu Cart
    Then Products are present in Cart page
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User adds a new delivery address with standard delivery
    When User confirms the shipping method
    When User select the creditCard payment method
    When User adds a new credit card
    When User confirms the credit card payment method
    Then User is redirected to Order Review page
    Then Products are present in Order Review page
    When User edits the Gifting Option from Order Review page
    When User selects the gifting type and adds message
      | type        | gumaterial |
      | messageType | gu         |
      | message     | がんばって！ |

    When User adds a gu coupon from Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate    
    When User opens MiniBag
    Then Products are present in Mini Bag
    Then MiniBag price details are accurate
    Then Coupon amount is correct on minibag
    When User closes the MiniBag
