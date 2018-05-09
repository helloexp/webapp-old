Feature: ACC164 (Jira ACC515)

  Scenario: New user with new Shipping Address, gifting as UniqloBox and Gift Card full payment (ACC164)
    Given User goes to Cart
    When  User goes to Login page
    When User decides to registers as a new user
    When User registers within the app
    Then User confirms the new account
    When User returns to Cart
    Given User adds products for "ACC164" to cart from mock page
    Given User goes to Cart
    When User updates the quantity of product "124174-32-073-076" with "+1"
    Then Product quantity is successfully updated
    Then Products are present in Cart page
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User adds a new delivery but not as billing address with bydate delivery
    When User confirms the shipping method
    When User select the giftcard payment method
    When User changes the delivery method type from Payment Page
    When User select the uniqlo delivery method
    When User choose the Uniqlo Store finder
    When User cancels the uniqlo store
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
