Feature: ACC156 (Jira ACC385)

  Scenario: New user with New Credit Card validate Credit Card Error messages (ACC156)
    Given User goes to Cart
    When  User goes to Login page
    When User decides to registers as a new user
    When User registers within the app
    Then User confirms the new account
    When User returns to Cart
    Given User adds products for "ACC156" to cart from mock page
    Given User goes to Cart
    Then Products are present in Cart page
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User adds a new delivery address with standard delivery
    When User confirms the shipping method
    When User select the creditCard payment method
    When User validates the credit card error messages for "card number"
    When User validates the credit card error messages for "expiration date"
    When User validates the credit card error messages for "cvv"
    When User validates the credit card error messages for "card holder name"
    When User adds a new credit card
    When User confirms the credit card payment method
    Then User is redirected to Order Review page
    Then Products are present in Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User opens MiniBag
    Then Products are present in Mini Bag
    Then MiniBag price details are accurate
   
