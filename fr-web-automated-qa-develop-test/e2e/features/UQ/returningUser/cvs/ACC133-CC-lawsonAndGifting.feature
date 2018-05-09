Feature: ACC133

  Scenario: Existing user with Lawson store and Credit Card with Gifting (ACC133)
    Given User goes to Cart
    When User goes to Login page
    When User logs in
      | email    | automation133@uniqlo.com |
      | password | test1234                 |

    Then User is successfully logged in
    Given User adds products for "ACC133" to cart from mock page
    And User goes to Cart
    When User gets the order summary price details
    When User enables the gift option
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the cvs delivery method
    When User selects a existing Lawson Convenient Store
    When User edits the Gifting Option from Order Payment page
    When User selects the gifting type and adds message
      | type        | uniqloboxmaterial |
      | messageType | uniqlo    |
      | message     | がんばって！|

    When User select the creditCard payment method
    When User selects the existing credit card
    Then User is redirected to Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User fills credit card CVV code "123"
    When User opens MiniBag
    Then MiniBag price details are accurate
    When User closes the MiniBag
    