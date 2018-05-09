Feature: ACC187

  Scenario: Existing user with Shipping Address, standard, coupon and Deferred Payment(ACC187)
    Given User goes to gu Cart
    When User goes to Login page
    When User logs in
      | email    | automation1505291260802@uniqlo.com |
      | password | test1234                 |

    Then User is successfully logged in
    When Prerequisites Reset user Cart data
    Given User adds products for "ACC187" to cart from mock page
    And User goes to gu Cart
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User selects and submits an existing address
    When User selects standard shipping method
    When User confirms the shipping method
    When User select the deferred payment method
    When User confirm the age verification for Deferred payment method
    When User confirm the Deferred payment method
    Then User is redirected to Order Review page
    Then Products are present in Order Review page
    When User adds a gu coupon from Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User opens MiniBag
    Then Coupon amount is correct on minibag
    Then Products are present in Mini Bag
    Then MiniBag price details are accurate
    When User closes the MiniBag
    Then Validate applied coupons in review order page
