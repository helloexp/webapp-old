Feature: ACC215

  Scenario: Existing user with Split Delivery with bydate shipping and same day shipping using Credit Card (ACC215)
    
    Given User goes to Cart
    When User goes to Login page
    When User logs in
      | email    | automation215@uniqlo.com |
      | password | test1234                |

    Then User is successfully logged in
    When Prerequisites Reset user Cart data
    Given User adds products for "ACC215" to cart from mock page
    Given User goes to Cart
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User selects and submits an existing address    
    When User selects individual packing method
    When User selects bydate shipping method for Delivery 1
    When User selects standard shipping method for Delivery 2
    When User selects standard shipping method for Delivery 3
    When User confirms the shipping method
    When User select the creditCard payment method
    When User selects the existing credit card
    Then User is redirected to Order Review page
    Then Products are present in Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User fills credit card CVV code "123" 
    When User opens MiniBag
    Then Products are present in Mini Bag
    Then MiniBag price details are accurate
    When User closes the MiniBag
