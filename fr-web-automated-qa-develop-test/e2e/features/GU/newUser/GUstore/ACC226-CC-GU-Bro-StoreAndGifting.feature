Feature: ACC226

  Scenario: New user with GUPick up at Uniqlo store, Gifting as Uniqlo, and Payment with Credit Card (ACC226)
    
    Given User goes to Cart
    When  User goes to Login page
    When User decides to registers as a new user
    When User registers within the app
    Then User confirms the new account
    When User returns to Cart
    Given User adds products for "ACC226" to cart from mock page
    And User goes to gu Cart
    Then Products are present in Cart page
    When User gets the order summary price details
    When User enables the gift option
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the uniqlo delivery method
    When User select a Uniqlo Store to deliver
    When User edits the Gifting Option from Order Review page
    When User selects the gifting type and adds message
      | type        | gumaterial   |
      | messageType | gu           |
      | message     | がんばって！   |

    When User select the creditCard payment method
    When User adds a new billing address
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
    