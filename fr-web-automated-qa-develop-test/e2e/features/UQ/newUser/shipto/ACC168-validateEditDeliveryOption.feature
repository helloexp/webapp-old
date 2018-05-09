Feature: ACC168
#This test case is for Redmine #44349-001

  Scenario: New user with new shipping address Edit Delivery option for mandatory fields (ACC168)
    Given User goes to Cart
    When  User goes to Login page
    When User decides to registers as a new user
    When User registers within the app
    Then User confirms the new account
    When User returns to Cart
    Given User adds products for "ACC168" to cart from mock page
    Given User goes to Cart
    Then Products are present in Cart page
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User adds a new delivery address with standard delivery
    When User confirms the shipping method
    When User select the atstore payment method
    When User select a Uniqlo Store to pay      
    When User opens MiniBag
    Then User navigates to cart page using the link
    When User delete item "199083-57-006-000" from Cart page
    Then Product "199083-57-006-000" is deleted from cart
    Given User adds products for "ACC168-2" to cart from mock page
    Given User goes to Cart
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    Then Delivery methods are reset
