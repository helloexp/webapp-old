Feature: ACC230

  Scenario: Existing user with GUPick up at Uniqlo store, Gifting as Uniqlo, Coupon and Payment with creditCard (ACC230)
    
    Given User goes to gu Cart
    When User goes to Login page
    When User logs in
      | email    | automation230@uniqlo.com |
      | password | test1234                 |

    Then User is successfully logged in
    When Prerequisites Reset user Cart data
    Given User adds products for "ACC230" to cart from mock page
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
    When User adds a gu coupon from Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User opens MiniBag
    Then Products are present in Mini Bag
    Then MiniBag price details are accurate
    When User closes the MiniBag
