Feature: ACC169 (Jira ACC520)
#This test case is for Redmine #44630

  Scenario: New user with CVS seven Eleven and validate payment options and payment error message(ACC169)
    Given User goes to Cart
    When  User goes to Login page
    When User decides to registers as a new user
    When User registers within the app
    Then User confirms the new account
    When User returns to Cart
    Given User adds products for "ACC169" to cart from mock page
    Given User goes to Cart
    Then Products are present in Cart page
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the cvs delivery method
    When User selects a new Seven Eleven Convenient Store
    Then User verify the error message "errors.checkPaymentMethod" is not visible in payment page

  Scenario: New user with CVS Lawson store and validate payment options and payment error message(ACC169)
    When User changes the delivery method type from Payment Page
    When User returns to Cart
    Then Products are present in Cart page
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the cvs delivery method
    When User selects a new Lawson Convenient Store
    Then User verify the error message "errors.checkPaymentMethod" is not visible in payment page

  Scenario: New user with CVS Family Mart and validate payment options and payment error message(ACC169)
    When User changes the delivery method type from Payment Page
    When User returns to Cart
    Then Products are present in Cart page
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the cvs delivery method
    When User selects a new Family Mart Convenient Store

    Then User verify the error message "errors.checkPaymentMethod" is not visible in payment page

  Scenario: New user with new shipping validate payment options and payment error message(ACC169)
    When User changes the delivery method type from Payment Page
    When User returns to Cart
    Then Products are present in Cart page
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User adds a new delivery address with standard delivery
    When User confirms the shipping method
    Then User verify the error message "errors.checkPaymentMethod" is not visible in payment page

  Scenario: New user with Uq Store and validate payment options and payment error message(ACC169)
    When User changes the delivery method type from Payment Page
    When User returns to Cart
    Then Products are present in Cart page
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the uniqlo delivery method         
    Then User verify the error message "errors.checkPaymentMethod" is not visible in payment page
