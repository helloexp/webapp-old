Feature: ACC201

  Scenario: Existing user verifies last 5 orders from Order history (ACC201)
    Given User goes to Cart
    When User goes to Login page
    When User logs in
      | email    | automation201@uniqlo.com |
      | password | test1234                |

    Then User is successfully logged in
    When Prerequisites Reset user Cart data
    Given User goes to Cart
    When User navigates to Account page
    Then User navigates to Order History List page
    Then User verifies the last 5 Orders
