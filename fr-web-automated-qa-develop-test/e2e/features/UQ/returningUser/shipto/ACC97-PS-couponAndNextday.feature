Feature: ACC97

  Scenario: Existing user with nextday using Pay At Store with Coupon (ACC97)
    Given User goes to Cart
    When User goes to Login page
    When User logs in
      | email    | automation97@uniqlo.com |
      | password | test1234                |

    Then User is successfully logged in
    When Prerequisites Reset user Cart data
    Given User adds products for "ACC97" to cart from mock page
    Given User goes to Cart
    When User gets the order summary price details
    When User adds a uq coupon from Cart page
    Then Coupon is applied in cart
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User selects and submits an existing address
    When User selects nextday shipping method
    When User confirms the shipping method
    Then User is redirected to Order Payment page
    When User select the atstore payment method
    When User select a Uniqlo Store to pay   
    Then User is redirected to Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User opens MiniBag
    Then MiniBag price details are accurate
    Then Coupon amount is correct on minibag
    When User closes the MiniBag
    Then Validate applied coupons in review order page
