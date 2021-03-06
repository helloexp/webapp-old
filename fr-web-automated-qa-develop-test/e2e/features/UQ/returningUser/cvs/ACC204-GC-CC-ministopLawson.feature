Feature: ACC204

  Scenario: Existing user with CVS Lawson Ministop store with Gift Card and Credit Card (ACC204)
    Given User goes to Cart
    When User goes to Login page
    When User logs in
      | email    | automation204@uniqlo.com |
      | password | test1234                 |

    Then User is successfully logged in
    When Prerequisites Reset user Cart data
    Given User adds products for "ACC204" to cart from mock page
    Given User goes to Cart
    Then Products are present in Cart page
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the cvs delivery method
    When User selects a existing Ministop Convenient Store
    When User select the giftcard payment method
    When User adds a gift card and proceed with part payment mode
      | type       | giftcard            |
      | cardNumber | 9999-1001-0000-0002 |
      | pin        | 1234                |
      | amount     | 100                 |
      | message    | Good day!!!         |

    When User select the creditCard payment method
    When User selects the existing credit card
    Then User is redirected to Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User fills credit card CVV code "123"
    When User opens MiniBag
    Then MiniBag price details are accurate
    When User closes the MiniBag
    When User places the order
    Then User is redirected to Order Confirmation page
    Then The order is successfully placed
    Then User navigates to Order History page
    Then Delivery method information is verified
    Then Payment method information is verified
    Then Cart information is verified
    Then User verifies the How to recieve from Ministop is visible
    When User cancels the Order
    Then Order is successfully canceled