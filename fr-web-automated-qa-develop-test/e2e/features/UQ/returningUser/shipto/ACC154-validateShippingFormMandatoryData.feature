Feature: ACC154 (Jira ACC382)

  Scenario: Existing user with edit shipping address validate shipping address form (ACC154)
    Given User goes to Cart
    When User goes to Login page
    When User logs in
      | email    | automation154@uniqlo.com |
      | password | test1234                 |
    Then User is successfully logged in
    When Prerequisites Reset user Cart data
    Given User adds products for "ACC154" to cart from mock page
    And User goes to Cart
    Then Products are present in Cart page
    When User gets the order summary price details
    When User triggers checkout
    When User select the shipto delivery method
    When User selects and submits an existing address
    When User selects standard shipping method
    When User confirms the shipping method
    When User select the ondelivery payment method
    When User confirms the cash on delivery payment method
    Then User is redirected to Order Review page
    Then Products are present in Order Review page
    When User changes the delivery method type
    When User select the shipto delivery method
    When User selects and changes an existing address
    Then User Validates the form
    When User saves the updated the address form
    When User clicks Save and continue on selected address
    When User selects standard shipping method
    When User confirms the shipping method
    When User select the ondelivery payment method
    When User confirms the cash on delivery payment method
    When User opens MiniBag
    Then Products are present in Mini Bag
    Then MiniBag price details are accurate
    