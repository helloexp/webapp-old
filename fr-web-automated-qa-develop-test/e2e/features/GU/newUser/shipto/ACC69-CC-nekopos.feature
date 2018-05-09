Feature: ACC69

  Scenario: New user with new Shipping Address as Nekopos Payment using Credit Card(ACC69)
    Given User goes to gu Cart
    When  User goes to Login page
    When User decides to registers as a new user
    When User registers within the app
      | email    |          |
      | password | test1234 |
      
    Then User confirms the new account
    When User returns to gu Cart
    Given User adds products for "ACC69" to cart from mock page
    Given User goes to gu Cart
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User adds a new delivery address with nekoPosPacket delivery
    When User confirms the shipping method
    When User select the creditCard payment method
    When User adds a new credit card
    When User confirms the credit card payment method
    Then User is redirected to Order Review page
    Then Products are present in Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User opens MiniBag
    Then Products are present in Mini Bag
    Then MiniBag price details are accurate
    When User closes the MiniBag
