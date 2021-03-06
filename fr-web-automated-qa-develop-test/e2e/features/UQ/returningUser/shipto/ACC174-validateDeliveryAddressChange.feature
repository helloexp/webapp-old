Feature: ACC174

  Scenario: Existing User validates the Delivery Address Change(ACC174)
    Given User goes to Cart
    When User goes to Login page
    When User logs in
      | email    | automation174@uniqlo.com |
      | password | test1234                 |

    Then User is successfully logged in
    When Prerequisites Reset user Cart data
    Given User adds products for "ACC174" to cart from mock page
    Given User goes to Cart
    Then Products are present in Cart page
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User selects and submits an existing address
    When User selects standard shipping method
    When User confirms the shipping method
    When User changes the delivery address from Payment Page
    When User selects an alternate existing address
    Then User opens MiniBag
    When User navigates to cart page using the link
    Then User triggers checkout
    Then User is redirected to Order Payment page
    When User select the ondelivery payment method
    When User confirms the cash on delivery payment method
    Then User is redirected to Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User opens MiniBag
    Then Products are present in Mini Bag
    Then MiniBag price details are accurate
    When User closes the MiniBag
    When User places the order
    Then User is redirected to Order Confirmation page
    Then The order is successfully placed
     Then User navigates to Order History page
    Then Delivery method information is verified
    Then Payment method information is verified
    Then Cart information is verified
    When User cancels the Order
    Then Order is successfully canceled
