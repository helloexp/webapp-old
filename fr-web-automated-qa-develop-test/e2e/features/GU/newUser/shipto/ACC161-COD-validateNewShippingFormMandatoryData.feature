Feature: ACC161 (Jira ACC410)

  Scenario: New user with new shipping address validate shipping address form for mandatory fields (ACC161)
    Given User goes to gu Cart
    When  User goes to Login page
    When User decides to registers as a new user
    When User registers within the app
      | email    |          |
      | password | test1234 |
      
    Then User confirms the new account
    When User returns to gu Cart
    Given User adds products for "ACC161" to cart from mock page
    Given User goes to gu Cart
    Then Products are present in Cart page
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    Then User Validates the form
    When User submits the address form
    When User selects standard shipping method
    When User confirms the shipping method
    When User select the ondelivery payment method
    When User confirms the cash on delivery payment method
    Then User is redirected to Order Review page
    Then Products are present in Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User opens MiniBag
    Then MiniBag price details are accurate
    When User closes the MiniBag
    When User places the order
    Then The order is successfully placed
    Then User navigates to Order History page
    Then Delivery method information is verified
    Then Payment method information is verified
    Then Cart information is verified
    When User cancels the Order
    Then Order is successfully canceled
