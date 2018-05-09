Feature: ACC159 (Jira ACC390)

  Scenario: Validate My Size for New User with Invalid My Size Data (ACC159)

    Given User goes to Cart
    When User goes to Login page
    When User decides to registers as a new user
    When User registers within the app
    Then User confirms the new account
    When User returns to Cart
    When User navigates to Account page
    When User navigates to My Size page
    When User validate the my size creation form
    When User Creates a new invalid My Size
    When User Validate My Size Fields
    Then My Size Submit Button Disabled
