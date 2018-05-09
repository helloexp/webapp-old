Feature: ACC173

  Scenario: New user selects products from PDP page validates recently viewed items (ACC173)
    Given User goes to Cart
    When  User goes to Login page
    When User decides to registers as a new user
    When User registers within the app
    Then User confirms the new account
    When User returns to Cart
    Given User selects products "ACC173" from PDP page
      | id     | quantity | color     | size | length | inseamType   | inseamLength | sku               |
      | 088190 |    1     | PINK      | S    |        |              |              | 088190-12-003-001 |
      | 086622 |    1     | GRAY      | S    |        |              |              | 086622-03-003-001 |
      | 124174 |    1     | BEIGE     | 100  | 85     | doubleInseam | 50           | 124174-32-100-085 |


    Given User goes to Cart
    Then User validates the recently viewed items in cart page
    
