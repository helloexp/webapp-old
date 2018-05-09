Feature: ACC167

  Scenario: New user with new Shipping Address not as billing, edit and choose Uq Store, adn update quantity to amount less than 5000(ACC167)
    Given User goes to Cart
    When  User goes to Login page
    When User decides to registers as a new user
    When User registers within the app
    Then User confirms the new account
    When User returns to Cart
    Given User adds products for "ACC167" to cart from mock page
    Given User goes to Cart
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
    When User opens MiniBag
    Then User navigates to cart page using the link
    When User delete item "199083-57-006-000" from Cart page
    Then Product "199083-57-006-000" is deleted from cart
    When User delete item "137374-08-073-076" from Cart page
    Then Product "137374-08-073-076" is deleted from cart
    Given User adds products for "ACC167-2" to cart from mock page
    Given User goes to Cart
    Then Products are present in Cart page
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    Then Delivery methods are reset
