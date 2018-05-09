Feature: ACC172

  Scenario: New user with all the three CVS stores and Gift Card Validation(ACC172)
    Given User goes to Cart
    When  User goes to Login page
    When User decides to registers as a new user
    When User registers within the app
    Then User confirms the new account
    When User returns to Cart
    Given User adds products for "ACC172" to cart from mock page
    Given User goes to Cart
    Then Products are present in Cart page
    When User adds a uq coupon from Cart page
    Then Coupon is applied in cart
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the cvs delivery method
    When User selects a new Seven Eleven Convenient Store
    Then User changes the delivery method type from Payment Page
    When User select the cvs delivery method
    When User selects a new Family Mart Convenient Store
    Then User changes the delivery method type from Payment Page
    When User select the cvs delivery method
    When User selects a new Lawson Convenient Store
    When User select the giftcard payment method
    When User adds a new billing address
    When User adds a gift card and proceed with part payment mode
      | type       | giftcard            |
      | cardNumber | 9999-1001-0000-0004 |
      | pin        | 1234                |
      | amount     | 5                   |
      | message    | Good day!!!         |

    When User select the giftcard payment method
    When User adds a gift card and proceed with full payment mode
      | type       | giftcard            |
      | cardNumber | 9999-1001-0000-0005 |
      | pin        | 1234                |
      | message    | Good day!!!         |

    Then User is redirected to Order Review page
    Then Products are present in Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User edits the Gifting Option from Order Review page
    When User selects the gifting type and adds message
      | type        | uniqlobox     |
      | messageType | uniqlo        |
      | message     | がんばって！    |

    Then User verify the error message "giftCardValidationErrors.giftCardAmountExceedCartAmount" is visible in payment page
    When User select the giftcard payment method
    When User adds a gift card and proceed with full payment mode
      | type       | giftcard            |
      | cardNumber | 9999-1001-0000-0001 |
      | pin        | 1234                |
      | message    | Good day!!!         |

    Then User is redirected to Order Review page
    Then Products are present in Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate    
    When User deletes the coupon from Order Review page
    Then User is redirected to Order Payment page
    Then User verify the error message "giftCardValidationErrors.giftCardAmountExceedCartAmount" is visible in payment page
    When User deletes the gift card "1" from Payment Page
    When User proceed using the gift card "1" with full payment
      | type       | giftcard            |
      | cardNumber | 9999-1001-0000-0005 |
      | pin        | 1234                |
      | message    | Good day!!!         |

    Then User is redirected to Order Review page
    Then Products are present in Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User opens MiniBag
    Then Products are present in Mini Bag
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
