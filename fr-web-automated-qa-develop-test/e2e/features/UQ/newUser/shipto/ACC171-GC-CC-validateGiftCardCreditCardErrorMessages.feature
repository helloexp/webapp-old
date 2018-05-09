Feature: ACC171

  Scenario: New user with Shipping Address and Credit Card Validation When the Gift Card Amount is Equal to Cart Amount (ACC171)
    Given User goes to Cart
    When  User goes to Login page
    When User decides to registers as a new user
    When User registers within the app
    Then User confirms the new account
    When User returns to Cart
    Given User adds products for "ACC171" to cart from mock page
    Given User goes to Cart
    Then Products are present in Cart page
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User adds a new delivery address with standard delivery
    When User confirms the shipping method
    When User select the giftcard payment method
    When User adds a gift card and proceed with part payment mode
      | type       | giftcard            |
      | cardNumber | 9999-1001-0000-0001 |
      | pin        | 1234                |
      | amount     | 6480                |
      | message    | Good day!!!         |

    When User select the creditCard payment method
    When User adds a new credit card
    When User confirms the credit card payment method
    Then User is redirected to Order Review page
    Then Products are present in Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User opens MiniBag
    Then Products are present in Mini Bag
    Then MiniBag price details are accurate
    When User navigates to cart page using the link
    Then User dismisses the popup message
    Then Products are present in Cart page
    When User gets the order summary price details
    When User updates the quantity of product "137374-08-073-076" with "-1"
    Then Product quantity is successfully updated
    Then Products are present in Cart page
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Review page
    Then Credit Card Panel is not visible

  Scenario: New user with Shipping Address and Gift Card Validation When the Gift Card Amount is Greater Than Cart Amount (ACC171)
    Given User goes to Cart
    When User updates the quantity of product "137374-08-073-076" with "+1"
    Then Product quantity is successfully updated
    Then Products are present in Cart page
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Payment page
    When User deletes the gift card "1" from Payment Page
    When User select the giftcard payment method
    When User adds a gift card and proceed with part payment mode
      | type       | giftcard            |
      | cardNumber | 9999-1001-0000-0001 |
      | pin        | 1234                |
      | amount     | 7000                |
      | message    | Good day!!!         |

    When User select the creditCard payment method
    When User adds a new credit card
    When User confirms the credit card payment method
    Then User is redirected to Order Review page
    Then Products are present in Order Review page
    Then Delivery method information is accurate
    When User opens MiniBag
    Then Products are present in Mini Bag
    Then MiniBag price details are accurate
    When User navigates to cart page using the link
    Then User dismisses the popup message
    Then Products are present in Cart page
    When User gets the order summary price details
    When User updates the quantity of product "137374-08-073-076" with "-1"
    Then Product quantity is successfully updated
    Then Products are present in Cart page
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Payment page
    Then User verify the error message "giftCardValidationErrors.giftCardAmountExceedCartAmount" is visible in payment page
