Feature: ACC179

  Scenario: Existing user with Shipping Address and Deferred Payment with Nextday (ACC179)
    Given User goes to Cart
    When User goes to Login page
    When User logs in
      | email    | automation179@uniqlo.com |
      | password | test1234    |

    Then User is successfully logged in
    When Prerequisites Reset user Cart data
    Given User adds products for "ACC179" to cart from mock page
    Given User goes to Cart
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User selects and submits an existing address
    When User selects nextday shipping method
    When User confirms the shipping method
    When User select the deferred payment method
    When User confirm the age verification for Deferred payment method
    When User confirm the Deferred payment method
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
    Then Payment method information is verified
    Then Cart information is verified
    When User cancels the Order
    Then Order is successfully canceled