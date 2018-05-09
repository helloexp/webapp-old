Feature: ACC106

  Scenario: Existing user with Pick up at Uniqlo store, Gifting as Uniqlo, and Payment with Gift Card (ACC106)
    Given User goes to Cart
    When User goes to Login page
    When User logs in
      | email    | automation106@uniqlo.com |
      | password | test1234                |

    Then User is successfully logged in
    Given User adds products for "ACC106" to cart from mock page
    Given User goes to Cart
    When User gets the order summary price details
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

    When User select the giftcard payment method
    When User adds a gift card and proceed with full payment mode
      | type       | giftcard            |
      | cardNumber | 9999-1001-0000-0001 |
      | pin        | 1234                |
      | message    | Good day!!!         |

    Then User is redirected to Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate    
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
    When User cancels the Order
    Then Order is successfully canceled
