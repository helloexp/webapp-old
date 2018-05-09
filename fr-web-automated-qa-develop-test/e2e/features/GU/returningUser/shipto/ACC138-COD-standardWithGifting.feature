Feature: ACC138

  Scenario: Existing user with Shipping Address, gifting as GU direct and COD (ACC138)

    Given User goes to gu Cart
    When User goes to Login page
    When User logs in
      | email    | automation138@uniqlo.com |
      | password | test1234                 |

    Then User is successfully logged in
    Given User adds products for "ACC138" to cart from mock page
    And User goes to gu Cart
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User selects and submits an existing address
    When User selects standard shipping method
    When User confirms the shipping method
    When User select the ondelivery payment method
    When User confirms the cash on delivery payment method
    Then User is redirected to Order Review page
    When User edits the Gifting Option from Order Review page
    When User selects the gifting type and adds message
      | type        | gudirect   |
      | messageType | gu         |
      | message     | がんばって！ |

    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User opens MiniBag
    Then MiniBag price details are accurate
    When User closes the MiniBag
    When User places the order
    Then The order is successfully placed
    Then User navigates to Order History page
    Then Delivery method information is verified
    Then Payment method information is verified
    Then Cart information is verified
    When User cancels the Order
    Then Order is successfully canceled
