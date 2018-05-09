Feature: ACC200

  Scenario: New user with Shipping Address, Standard and COD validates the AddressBook (ACC200)
    Given User goes to Cart
    When  User goes to Login page
    When User decides to registers as a new user
    When User registers within the app
    Then User confirms the new account
    When User returns to Cart    
    When User navigates to Account page
    Then User goes to Address Book page and clicks on Register new Address
    When User adds a new address from account page
    Then User updates the address book
    Then User edits the pincode from address book to "1076231"
    When User adds products for "ACC200" to cart from mock page
    And User goes to Cart
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User selects and submits an existing address
    When User selects bydate shipping method
    When User confirms the shipping method
    When User select the ondelivery payment method
    When User confirms the cash on delivery payment method
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