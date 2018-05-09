Feature: ACC221

  Scenario: New user with split delivery and validates gifting and coupon to be hidden on choosing split delivery  (ACC221)
    Given User goes to Cart
    When  User goes to Login page
    When User decides to registers as a new user
    When User registers within the app
      | email    |          |
      | password | test1234 |

    Then User confirms the new account
    When User returns to Cart
    Given User adds products for "ACC221" to cart from mock page
    When User goes to Cart
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User adds a new delivery address
      | type              | address      |
      | firstName         | 一道          |
      | lastName          | 余川       |
      | firstNameKatakana | トモオ          |
      | lastNameKatakana  | キムラヤマ           |
      | postalCode        | 1076231      |
      | prefecture        | 愛知県          |
      | city              | 名古屋市名          |
      | street            | 東区藤が丘           |
      | streetNumber      | １－３            |
      | aptName           |    |
      | phoneNumber       | 1234567890 |
      | cellPhoneNumber   | 1234567890 |

    Then User checks if gifting option is visible
    When User selects individual packing method
    Then User checks if gifting option is hidden
    When User selects collective packing method
    When User selects standard shipping method
    When User confirms the shipping method
    Then User checks if gifting option is visible
    Then User checks if apply coupon is visible
    Then User changes the shipping method type from Payment Page
    When User selects individual packing method
    When User selects standard shipping method for Delivery 1
    When User selects standard shipping method for Delivery 2
    When User confirms the shipping method
    Then User checks if gifting option is hidden
    Then User checks if apply coupon is hidden
    When User select the creditCard payment method
    When User adds a new credit card and saves it for later usage
      | type            | creditCard       |
      | cardNumber      | 4484500000000005 |
      | cardType        | visa             |
      | expirationMonth | 5                |
      | expirationYear  | 2020             |
      | cvv             | 123              |
      | cardHolder      | Uniqlo           |

    When User confirms the credit card payment method
    Then User is redirected to Order Review page
    Then User checks if gifting option is hidden
    Then User checks if apply coupon is hidden
    Then User edits the shipping method
    When User selects collective packing method
    When User selects standard shipping method
    When User confirms the shipping method
    Then User is redirected to Order Review page
    Then User checks if gifting option is visible
    Then User checks if apply coupon is visible
    Then Products are present in Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User opens MiniBag
    Then Products are present in Mini Bag
    Then MiniBag price details are accurate
    When User closes the MiniBag
    
