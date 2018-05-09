Feature: ACC151 (Error Code 2401 (Jira 524))

  Scenario: Validate Error Code Qunatity Of Gift Card to be Used (ACC151)

    Given User goes to Cart
    When  User goes to Login page
    When User decides to registers as a new user
    When User registers within the app
    Then User confirms the new account
    When User returns to Cart
    Given User adds products for "ACC151" to cart from mock page
    Given User goes to Cart
    Then Products are present in Cart page
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User adds a new delivery address with standard delivery
    When User confirms the shipping method

    When User select the giftcard payment method
    When User adds a gift card and proceed
      | type       | giftcard            |
      | cardNumber | 9999-1001-0000-0001 |
      | pin        | 1234                |
      | amount     | 100                 |
    When User refresh the browser
    Then User verify the error message "giftCardValidationErrors.giftCardIsUnset" is visible in payment page
    When User proceed using the gift card "1" with part payment
      | type       | giftcard            |
      | cardNumber | 9999-1001-0000-0001 |
      | pin        | 1234                |
      | amount     | 100                 |

    When User select the giftcard payment method
    When User adds a gift card and proceed
      | type       | giftcard            |
      | cardNumber | 9999-1001-0000-0002 |
      | pin        | 1234                |
      | amount     | 100                 |
    When User refresh the browser
    Then User verify the error message "giftCardValidationErrors.giftCardIsUnset" is visible in payment page
    When User proceed using the gift card "2" with part payment
      | type       | giftcard            |
      | cardNumber | 9999-1001-0000-0002 |
      | pin        | 1234                |
      | amount     | 100                 |

    When User select the giftcard payment method
    When User adds a gift card and proceed
      | type       | giftcard            |
      | cardNumber | 9999-1001-0000-0003 |
      | pin        | 1234                |
      | amount     | 100                 |
    When User refresh the browser
    Then User verify the error message "giftCardValidationErrors.giftCardIsUnset" is visible in payment page
    When User proceed using the gift card "3" with part payment
      | type       | giftcard            |
      | cardNumber | 9999-1001-0000-0003 |
      | pin        | 1234                |
      | amount     | 100                 |

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
    When User closes the MiniBag
