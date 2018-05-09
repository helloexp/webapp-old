Feature: ACC125

  Scenario: Existing user with CVS Family Mart store and Credit Card with Gifting (ACC125)
    Given User goes to Cart
    When User goes to Login page
    When User logs in
      | email    | automation125@uniqlo.com |
      | password | test1234                 |

    Then User is successfully logged in
    Given User adds products for "ACC125" to cart from mock page
    And User goes to Cart
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the cvs delivery method
    When User selects a existing Family Mart Convenient Store
    When User select the creditCard payment method
    When User selects the existing credit card
    Then User is redirected to Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User fills credit card CVV code "123"
    When User opens MiniBag
    Then MiniBag price details are accurate
    When User closes the MiniBag
   