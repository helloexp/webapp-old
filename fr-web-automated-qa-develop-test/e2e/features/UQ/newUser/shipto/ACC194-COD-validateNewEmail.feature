Feature: ACC194

  Scenario: New user with Shipping Address, Standard and COD validates the new email (ACC194)
    Given User goes to Cart
    When  User goes to Login page
    When User decides to registers as a new user
    When User registers within the app
    Then User confirms the new account
    When User returns to Cart
    Then User is successfully logged in
    When Prerequisites Reset user Cart data
    When User navigates to Account page
    Then User navigates to Member Edit page
    Then User changes the registered email address 
    When User returns to Cart
    Given User adds products for "ACC194" to cart from mock page
    Given User goes to Cart
    Then Products are present in Cart page
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User adds a new delivery address with standard delivery
    When User confirms the shipping method
    When User validates the email in Payment Page
    When User select the ondelivery payment method
    When User confirms the cash on delivery payment method
    Then User is redirected to Order Review page
    Then Products are present in Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User opens MiniBag
    Then Products are present in Mini Bag
    Then MiniBag price details are accurate
    When User closes the MiniBag
    Then User verifies Email after placing the order
    
