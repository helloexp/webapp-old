Feature: ACC130

  Scenario: Existing user with CVS Lawson, Coupon and Payment using one Gift Card (ACC130)
    Given User goes to Cart
    When User goes to Login page
    When User logs in
      | email    | automation130@uniqlo.com |
      | password | test1234                 |

    Then User is successfully logged in
    When Prerequisites Reset user Cart data
    Given User adds products for "ACC130" to cart from mock page
    And User goes to Cart
    When User gets the order summary price details
    When User adds a uq coupon
    Then Coupon is applied in cart
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the cvs delivery method
    When User selects a existing Lawson Convenient Store
    When User select the giftcard payment method
    When User adds a gift card and proceed with full payment mode
      | type       | giftcard            |
      | cardNumber | 9999-1001-0000-0001 |
      | pin        | 1234                |
      | message    | Good day!!!         |

    Then User is redirected to Order Review page
    Then Payment method information is accurate
    Then Delivery method information is accurate
    When User opens MiniBag
    Then MiniBag price details are accurate
    Then Coupon amount is correct on minibag
    When User closes the MiniBag
    Then Validate applied coupons in review order page
