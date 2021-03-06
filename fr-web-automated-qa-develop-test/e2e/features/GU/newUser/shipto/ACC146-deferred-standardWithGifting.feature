Feature: ACC146

  Scenario: New user with new Shipping Address, gifting as GU direct and Deferred Payment(ACC146)
    Given User goes to gu Cart
    When  User goes to Login page
    When User decides to registers as a new user
    When User registers within the app
      | email    |          |
      | password | test1234 |

    Then User confirms the new account
    When User returns to gu Cart
    Given User adds products for "ACC146" to cart from mock page
    Given User goes to gu Cart
    Then Products are present in Cart page
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User adds a new delivery address with standard delivery
    When User confirms the shipping method
    When User select the deferred payment method
    When User confirm the age verification for Deferred payment method
    When User confirm the Deferred payment method
    Then User is redirected to Order Review page
    Then Products are present in Order Review page
    When User edits the Gifting Option from Order Review page
    When User selects the gifting type and adds message
      | type        | gudirect   |
      | messageType | gu         |
      | message     | がんばって！ |

    Then Delivery method information is accurate
    Then Payment method information is accurate    
    When User opens MiniBag
    Then Products are present in Mini Bag
    Then MiniBag price details are accurate
    When User closes the MiniBag
    When User places the order
    Then The order is successfully placed
    Then User navigates to Order History page
    When User cancels the Order
    Then Order is successfully canceled
