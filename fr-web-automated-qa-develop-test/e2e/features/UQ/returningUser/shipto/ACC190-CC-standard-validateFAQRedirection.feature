Feature: ACC190

  Scenario: Existing user with Shipping Address, Standard and Credit Card validates the FAQ redirection (ACC190)

    Given User goes to Cart
    When User goes to Login page
    When User logs in
      | email    | automation190@uniqlo.com |
      | password | test1234    |

    Then User is successfully logged in
    When Prerequisites Reset user Cart data
    Given User adds products for "ACC190" to cart from mock page
    And User goes to Cart
    When User gets the order summary price details
    When User selects Contact Us
    Then User is redirected to FAQ Page
    When User goes to Cart
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User selects and submits an existing address
    When User selects standard shipping method
    When User confirms the shipping method
    When User select the creditCard payment method
    When User selects the existing credit card
    Then User is redirected to Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User opens MiniBag
    Then MiniBag price details are accurate
    When User closes the MiniBag
    Then User clicks on the receipt ToolTip
    Then User is redirected to FAQ page
    When User fills credit card CVV code "123"
    
