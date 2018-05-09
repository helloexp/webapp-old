Feature: ACC113

  Scenario: Existing user with Pick up at Uniqlo store and Pay in Store(ACC113)

    Given User goes to Cart
    When User goes to Login page
    When User logs in
      | email    | automation113@uniqlo.com |
      | password | test1234                 |

    Then User is successfully logged in
    When Prerequisites Reset user Cart data
    When User goes to Cart
    Given User adds products for "ACC113" to cart from mock page
    Given User goes to Cart
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the uniqlo delivery method
    When User select a Uniqlo Store to deliver
    When User select the atstore payment method
    When User select a Uniqlo Store to pay
    Then User is redirected to Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User opens MiniBag
    Then MiniBag price details are accurate
    When User closes the MiniBag
    
