Feature: ACC206

  Scenario: New user with Pick up at Uniqlo store and Pay in Store(ACC206)
    Given User goes to Cart
    When  User goes to Login page
    When User decides to registers as a new user
    When User registers within the app
    Then User confirms the new account
    When User returns to Cart
    Given User adds products for "ACC206" to cart from mock page
    Given User goes to Cart
    Then Products are present in Cart page
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the uniqlo delivery method
    When User select a Uniqlo Store to deliver
    When User select the atstore payment method
    When User select a Uniqlo Store to pay
    When User adds member information at Payment Page
    Then User is redirected to Order Review page
    Then Products are present in Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User opens MiniBag
    Then Products are present in Mini Bag
    Then MiniBag price details are accurate
    
