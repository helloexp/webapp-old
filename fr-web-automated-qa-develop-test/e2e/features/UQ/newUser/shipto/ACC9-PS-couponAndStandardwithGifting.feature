Feature: ACC09

  Scenario: New user with new Shipping Address and Pay in Store with Standard with gifting and Coupon(ACC09)
    Given User goes to Cart
    When  User goes to Login page
    When User decides to registers as a new user
    When User registers within the app
    Then User confirms the new account
    When User returns to Cart
    Given User adds products for "ACC9" to cart from mock page
    Given User goes to Cart
    Then Products are present in Cart page
    When User gets the order summary price details
    When User enables the gift option
    When User adds a uq coupon from Cart page
    Then Coupon is applied in cart
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User adds a new delivery address with standard delivery
    When User confirms the shipping method
    Then User is redirected to Order Payment page
    When User edits the Gifting Option from Order Payment page
    When User selects the gifting type and adds message
      | type        | uniqlobox |
      | messageType | uniqlo    |
      | message     | がんばって！|

    When User select the atstore payment method
    When User select a Uniqlo Store to pay
    Then User is redirected to Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User opens MiniBag
    Then Products are present in Mini Bag
    Then MiniBag price details are accurate
    Then Coupon amount is correct on minibag
    When User closes the MiniBag
    Then Validate applied coupons in review order page
