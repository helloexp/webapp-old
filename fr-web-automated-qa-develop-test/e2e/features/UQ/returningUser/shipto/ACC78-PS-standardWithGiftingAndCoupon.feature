Feature: ACC78

  Scenario: Existing user with Shipping Address, Standard, Coupon, Gifting as Uniqlo Box and Pay in Store(ACC78)
    Given User goes to Cart
    When User goes to Login page
    When User logs in
      | email    | automation78@uniqlo.com |
      | password | test1234                  |

    Then User is successfully logged in
    When Prerequisites Reset user Cart data
    Given User adds products for "ACC78" to cart from mock page
    And User goes to Cart
    When User gets the order summary price details
    When User adds a uq coupon
    Then Coupon is applied in cart
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User selects and submits an existing address
    When User selects standard shipping method
    When User confirms the shipping method
    When User adds the Gifting Option from Order Payment page
    When User selects the gifting type and adds message
      | type        | uniqlobox   |
      | messageType | uniqlo      |
      | message     | がんばって！  |

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
