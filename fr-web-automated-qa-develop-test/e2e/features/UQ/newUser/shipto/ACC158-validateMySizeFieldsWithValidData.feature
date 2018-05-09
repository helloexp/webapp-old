Feature: ACC158 (Jira ACC389)

  Scenario: Validate My Size for New User with Valid My Size Data (ACC158)

    Given User goes to Cart
    When User goes to Login page
    When User decides to registers as a new user
    When User registers within the app
    Then User confirms the new account
    When User returns to Cart
    When User navigates to Account page
    When User navigates to My Size page
    When User validate the my size creation form
    When User Creates a new valid My Size
    When User Validate My Size Fields
    When User Fills My Size Details
    When User Submit My Size
    When User Validate My Size Details
    When User Confirms the My Size Details
    Then User Validate the Confirmation Message
