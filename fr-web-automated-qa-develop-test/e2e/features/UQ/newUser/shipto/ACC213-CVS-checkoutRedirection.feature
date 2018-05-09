Feature: ACC213

  Scenario: New user with checkout Redirection Validation(ACC213)
    
    Given User goes to Cart
    When  User goes to Login page
    When User decides to registers as a new user
    When User registers within the app
      | email    |          |
      | password | test1234 |
      | zip      | 1410021  |

    Then User confirms the new account
    When User returns to Cart
    Given User adds products for "ACC213" to cart from mock page
    Given User goes to Cart
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User adds a new delivery address with standard delivery
      | type              | address      |
      | firstName         | 昇          |
      | lastName          | 畠沢       |
      | firstNameKatakana | ノボル          |
      | lastNameKatakana  | ハタザワ           |
      | postalCode        | 1410021      |
      | prefecture        | 東京都          |
      | city              | 港区          |
      | street            | 豊洲           |
      | streetNumber      | ２－２０－２            |
      | aptName           | 有明マンション１１１   |
      | phoneNumber       | 1234567890 |
      | cellPhoneNumber   | 1234567899 |

    When User confirms the shipping method    
    Then User changes the delivery method type from Payment Page
    When User select the cvs delivery method
    When User selects a new Seven Eleven Convenient Store
    When User opens MiniBag
    When User navigates to cart page using the link
    When User triggers checkout
    Then User is redirected to Order Payment page
    