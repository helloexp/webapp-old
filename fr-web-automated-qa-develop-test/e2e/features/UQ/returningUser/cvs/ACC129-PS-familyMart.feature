Feature: ACC129

  Scenario: Existing user with CVS Family Mart store and Pay At Store (ACC129)
    Given User goes to Cart
    When User goes to Login page
    When User logs in
      | email    | automation129@uniqlo.com |
      | password | test1234                 |

    Then User is successfully logged in
    Given User adds products for "ACC129" to cart from mock page
    And User goes to Cart
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the cvs delivery method
    When User selects a existing Family Mart Convenient Store
    When User select the atstore payment method
    When User select a Uniqlo Store to pay
    Then User is redirected to Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User opens MiniBag
    Then MiniBag price details are accurate
    When User closes the MiniBag
    When User places the order
    Then User is redirected to Order Confirmation page
    Then The order is successfully placed
    Then User navigates to Order History page
    Then Delivery method information is verified
    When User cancels the Order
    Then Order is successfully canceled
