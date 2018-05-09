Feature: ACC165 (Jira ACC516)

  Scenario: New user with add address from member page without phone number, checkout from cart and verify delivery page(ACC165)
    Given User goes to Cart
    When  User goes to Login page
    When User decides to registers as a new user
    When User registers within the app
    Then User confirms the new account
    When User returns to Cart
    When User navigates to Account page
    When Prerequisites user set the Address
    | type              | address      |
    | firstName         | 詩織           |
    | lastName          | 佐々山          |
    | firstNameKatakana | シオリ          |
    | lastNameKatakana  | ササキ          |    
    | prefecture        | 東京都          |
    | city              | 港区           |
    | street            | 赤坂           |
    | streetNumber      | １－４－２０       |
    | aptName           | 赤坂マンション１０１   |

    Given User adds products for "ACC165" to cart from mock page
    Given User goes to Cart
    Then Products are present in Cart page
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    Then Address form is visible
    When User adds a new delivery address with standard delivery
    When User confirms the shipping method
    When User select the ondelivery payment method
    When User confirms the cash on delivery payment method
    Then User is redirected to Order Review page
    Then Products are present in Order Review page
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
