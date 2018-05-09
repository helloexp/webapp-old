Feature: ACC44

  Scenario: New user with CVS Seven store with Coupon, Gifting and Gift Card (ACC44)
    Given User goes to Cart
    When  User goes to Login page
    When User decides to registers as a new user
    When User registers within the app
    Then User confirms the new account
    When User returns to Cart
    Given User adds products for "ACC44" to cart from mock page
    Given User goes to Cart
    Then Products are present in Cart page
    When User adds a uq coupon
    Then Coupon is applied in cart
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the cvs delivery method
    When User selects a new Seven Eleven Convenient Store
    When User adds the Gifting Option from Order Payment page
    When User selects the gifting type and adds message
      | type        | uniqlobox         |
      | messageType | uniqloSquare      |
      | message     | がんばって！        |

    When User select the giftcard payment method
    When User adds a new billing address
    When User adds a gift card and proceed with full payment mode
      | type       | giftcard            |
      | cardNumber | 9999-1001-0000-0006 |
      | pin        | 1234                |
      | message    | Good day!!!         |

    Then User is redirected to Order Review page
    Then Products are present in Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User opens MiniBag
    Then Products are present in Mini Bag
    Then MiniBag price details are accurate
    Then Coupon amount is correct on minibag
    When User closes the MiniBag
    Then Validate applied coupons in review order page
