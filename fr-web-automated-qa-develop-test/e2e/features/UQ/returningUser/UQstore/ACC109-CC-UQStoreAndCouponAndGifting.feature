Feature: ACC109

  Scenario: Existing user with Pick up at Uniqlo store, Coupon, Gifting as Uniqlo, and Payment with Credit Card (ACC109)
    Given User goes to Cart
    When User goes to Login page
    When User logs in
      | email    | automation109@uniqlo.com |
      | password | test1234                |

    Then User is successfully logged in
    When User goes to Cart
    When Prerequisites Reset user Cart data
    Given User adds products for "ACC109" to cart from mock page
    Given User goes to Cart
    When User gets the order summary price details
    When User adds a uq coupon from Cart page
    Then Coupon is applied in cart
    When User enables the gift option
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the uniqlo delivery method
    When User select a Uniqlo Store to deliver
    When User edits the Gifting Option from Order Payment page
    When User selects the gifting type and adds message
      | type        | uniqlobox |
      | messageType | uniqlo    |
      | message     | がんばって！    |

    When User select the creditCard payment method
    When User selects the existing credit card
    Then User is redirected to Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate    
    When User opens MiniBag
    Then MiniBag price details are accurate
    Then Coupon amount is correct on minibag
    When User closes the MiniBag
    When User fills credit card CVV code "123"
    Then Validate applied coupons in review order page
