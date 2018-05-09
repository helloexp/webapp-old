Feature: ACC209

  Scenario: New user with Pick up at Uniqlo store and Pay in Store(ACC209)
    Given User goes to Cart
    When  User goes to Login page
    When User decides to registers as a new user
    When User registers within the app
      | email    |          |
      | password | test1234 |
      | zip      | 1076231  |

    Then User confirms the new account
    When User returns to Cart
    Given User adds products for "ACC209" to cart from mock page
    Given User goes to Cart
    Then Products are present in Cart page
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the uniqlo delivery method
    When User select a Uniqlo Store to deliver
    When User select the atstore payment method
    When User select a Uniqlo Store to pay
    When User adds member information at Payment Page
    Then User is redirected to Order Review page
    When User opens MiniBag
    When User navigates to cart page using the link
    Then User logs out
    When User goes to Login page
    When User logs in with registered account
    Then User is successfully logged in
    Given User goes to Cart
    Then Products are present in Cart page
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the uniqlo delivery method
