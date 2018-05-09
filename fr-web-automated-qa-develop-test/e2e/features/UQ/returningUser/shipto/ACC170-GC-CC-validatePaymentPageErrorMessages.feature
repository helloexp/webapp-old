Feature: ACC170 (Jira ACC521)

Scenario: Existing user with Credit Card and Gift Card Validation When Gift Card Amount Equal to Cart Amount (ACC170)
  Given User goes to Cart
  When User goes to Login page
  When User logs in
    | email    | automation170@uniqlo.com |
    | password | test1234                 |

  Then User is successfully logged in
  When Prerequisites Reset user Cart data
  Given User adds products for "ACC170" to cart from mock page
  And User goes to Cart
  Then Products are present in Cart page
  When User gets the order summary price details
  When User triggers checkout
  When User select the shipto delivery method
  When User selects and submits an existing address
  When User selects standard shipping method
  When User confirms the shipping method
  When User select the creditCard payment method
  When User selects the existing credit card
  Then User is redirected to Order Review page
  Then Products are present in Order Review page
  Then Delivery method information is accurate
  Then Payment method information is accurate
  Then User changes the payment method type
  When User select the giftcard payment method
  When User adds a gift card and proceed with part payment mode
      | type       | giftcard            |
      | cardNumber | 9999-1001-0000-0005 |
      | pin        | 1234                |
      | amount     | 6480                |
      | message    | Good day!!!         |

  When User select the creditCard payment method
  When User selects the existing credit card
  Then User is redirected to Order Review page
  Then Products are present in Order Review page
  When User opens MiniBag
  Then Products are present in Mini Bag
  Then MiniBag price details are accurate
  When User navigates to cart page using the link
  Then Products are present in Cart page
  When User gets the order summary price details
  When User updates the quantity of product "137374-08-073-076" with "-1"
  Then Product quantity is successfully updated
  Then Products are present in Cart page
  When User gets the order summary price details
  When User triggers checkout
  Then User is redirected to Order Review page
  Then Credit Card Panel is not visible

Scenario:  Existing User with Giftcard Amount Exceed Cart Amount Error Validation (ACC170)
  When User goes to Cart
  When User updates the quantity of product "137374-08-073-076" with "+1"
  Then Product quantity is successfully updated
  Then Products are present in Cart page
  When User gets the order summary price details
  When User triggers checkout
  Then User is redirected to Order Payment page
  When User proceed using the gift card "1" with part payment
      | type       | giftcard            |
      | cardNumber | 9999-1001-0000-0005 |
      | pin        | 1234                |
      | amount     | 7000                |
      | message    | Good day!!!         |

  When User select the creditCard payment method
  When User selects the existing credit card
  Then User is redirected to Order Review page
  Then Products are present in Order Review page
  When User opens MiniBag
  Then Products are present in Mini Bag
  Then MiniBag price details are accurate
  When User navigates to cart page using the link
  Then Products are present in Cart page
  When User gets the order summary price details
  When User updates the quantity of product "137374-08-073-076" with "-1"
  Then Product quantity is successfully updated
  Then Products are present in Cart page
  When User gets the order summary price details
  When User triggers checkout
  Then User is redirected to Order Payment page
  Then User verify the error message "giftCardValidationErrors.giftCardAmountExceedCartAmount" is visible in payment page

Scenario: Existing User with creditCard Error Validation When Gift Card Amount Less Than Cart Amount (ACC170)
  When User goes to Cart
  When User updates the quantity of product "137374-08-073-076" with "+1"
  Then Product quantity is successfully updated
  Then Products are present in Cart page
  When User gets the order summary price details
  When User triggers checkout
  Then User is redirected to Order Payment page
  When User select the creditCard payment method
  When User selects the existing credit card
  Then User is redirected to Order Review page
  Then Products are present in Order Review page
  Then Delivery method information is accurate
  Then User changes the payment method type
  When User select the giftcard payment method
  When User adds a gift card and proceed with part payment mode
      | type       | giftcard            |
      | cardNumber | 9999-1001-0000-0005 |
      | pin        | 1234                |
      | amount     | 5000                |
      | message    | Good day!!!         |

  When User select the creditCard payment method
  When User selects the existing credit card
  Then User is redirected to Order Review page
  Then Products are present in Order Review page
  When User opens MiniBag
  Then Products are present in Mini Bag
  Then MiniBag price details are accurate
  When User navigates to cart page using the link
  Then Products are present in Cart page
  When User gets the order summary price details
  When User updates the quantity of product "137374-08-073-076" with "-1"
  Then Product quantity is successfully updated
  Then Products are present in Cart page
  When User gets the order summary price details
  When User triggers checkout  
  Then User is redirected to Order Review page
  Then User verify the error message "creditCardValidationErrors.creditCardAmountChanged" in order review page
