Feature: ACC189

  Scenario: New user with new Shipping Address, Giftcard, standard and validates receipt checkbox(ACC 189)
    Given User goes to Cart
    When  User goes to Login page
    When User decides to registers as a new user
    When User registers within the app
    Then User confirms the new account
    When User returns to Cart
    Given User adds products for "ACC189" to cart from mock page
    Given User goes to Cart
    Then Products are present in Cart page
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User adds a new delivery address with standard delivery
    When User confirms the shipping method
    When User select the giftcard payment method
    When User adds a gift card and proceed with full payment mode
      | type       | giftcard            |
      | cardNumber | 9999-1001-0000-0007 |
      | pin        | 1234                |
      | amount     | 0                   |
      | message    | Good day!!!         |

    Then User is redirected to Order Review page
    Then Issue Receipt is visible
    Then Products are present in Order Review page
    When User edits the Gifting Option from Order Review page
    When User selects the gifting type and adds message
      | type        | uniqlobox |
      | messageType | uniqlo    |
      | message     | がんばって！|

    Then User is redirected to Order Payment page
    When User select the giftcard payment method
    When User proceed using the gift card "1" with full payment
      | type       | giftcard            |
      | cardNumber | 9999-1001-0000-0007 |
      | pin        | 1234                |
      | message    | Good day!!!         |

    Then User is redirected to Order Review page
    Then Products are present in Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate    
    Then Issue Receipt is not visible
    When User places the order
    Then User is redirected to Order Confirmation page
    Then The order is successfully placed
    Then User navigates to Order History page
    When User cancels the Order
    Then Order is successfully canceled
