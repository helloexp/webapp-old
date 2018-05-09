Feature: ACC202

  Scenario: Existing user with Shipping Address, standard and Payment using Credit Card(ACC202)
    Given User goes to Cart
    When User goes to Login page
    When User logs in
      | email    | automation202@uniqlo.com |
      | password | test1234                 |

    Then User is successfully logged in
    And User goes to Cart
    When User navigates to Account page
    Then User navigates to Credit Card Page
    When User registers new credit card from credit card page
      | type            | creditCard       |
      | cardNumber      | 4484500000000005 |
      | cardType        | visa             |
      | expirationMonth | 5                |
      | expirationYear  | 2020             |
      | cvv             | 123              |
      | cardHolder      | Uniqlo           |

    Then The credit card is successfully registered
    And User goes to Cart
    When Prerequisites Reset user Cart data
    Given User adds products for "ACC202" to cart from mock page
    And User goes to Cart
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User selects and submits an existing address
    When User selects standard shipping method
    When User confirms the shipping method
    When User select the creditCard payment method
    When User selects the existing credit card
    Then User is redirected to Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User opens MiniBag
    Then MiniBag price details are accurate
    When User closes the MiniBag
    When User fills credit card CVV code "123"
     