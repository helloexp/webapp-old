    Feature: ACC74

  Scenario: Existing user with Shipping Address, standard, gifting and Payment using Credit Card (ACC74)
    Given User goes to Cart
    When User goes to Login page
    When User logs in
      | email    | automation74@uniqlo.com |
      | password | test1234                 |

    Then User is successfully logged in
    When Prerequisites Reset user Cart data
    Given User adds products for "ACC74" to cart from mock page
    Given User goes to Cart
    When User gets the order summary price details
    When User enables the gift option
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User selects and submits an existing address
    When User selects standard shipping method
    When User confirms the shipping method
    Then User is redirected to Order Payment page
    When User edits the Gifting Option from Order Payment page
    When User selects the gifting type and adds message
      | type        | uniqlobox     |
      | messageType | uniqloSquare  |
      | message     | がんばって！    |

   When User select the creditCard payment method
   When User selects the existing credit card
   Then User is redirected to Order Review page
   Then Delivery method information is accurate
   Then Payment method information is accurate
      | type            |   creditCard        |
      | cardNumber      |   4484500000000005  |
      | cardType        |   visa              |

   When User fills credit card CVV code "123"
   When User opens MiniBag
   Then MiniBag price details are accurate
   When User closes the MiniBag
   When User places the order
   Then The order is successfully placed
   Then User navigates to Order History page
   When User cancels the Order
   Then Order is successfully canceled

