Feature: ACC229

Scenario: Concierge app Fast checkout.
    Given User goes to Cart
    When User goes to Login page
    When User logs in
      | email    | storeguy@uniqlo.store |
      | password | test1234                |

    Then User is successfully logged in
    Given User goes to Cart
    When Prerequisites Reset user Cart data
    Given User adds products for "ACC229" to cart from mock page
    Given User goes to Cart
    When User triggers fast checkout
    Then User is redirected with fast checkout to Order Review page
    Then Store pickup details and store payment details are accurate for store staff
    When User places the order