Feature: ACC220

  Scenario: New user with split delivery and Shipping Address not same as Billing Address (ACC220)
    Given User goes to Cart
    When  User goes to Login page
    When User decides to registers as a new user
    When User registers within the app
      | email    |          |
      | password | test1234 |

    Then User confirms the new account
    When User returns to Cart
    Given User adds products for "ACC220" to cart from mock page
    When User goes to Cart    
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User adds a new delivery but not as billing address
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

    When User selects individual packing method
    When User selects standard shipping method for Delivery 1
    When User selects bydate shipping method for Delivery 2
    When User selects standard shipping method for Delivery 3
    When User confirms the shipping method
    When User select the creditCard payment method
    When User adds a new credit card and saves it for later usage
      | type            | creditCard       |
      | cardNumber      | 4484500000000005 |
      | cardType        | visa             |
      | expirationMonth | 5                |
      | expirationYear  | 2020             |
      | cvv             | 123              |
      | cardHolder      | Uniqlo           |

    When User adds a new billing address
      | type              | address             |
      | firstName         | 昇                  |
      | lastName          | 畠沢                |
      | firstNameKatakana | ノボル              |
      | lastNameKatakana  | ハタザワ            |
      | postalCode        | 1076321            |
      | prefecture        | 東京都              |
      | city              | 港区                |
      | street            | 豊洲                |
      | streetNumber      | ２－２０－２          |
      | aptName           | 有明マンション１１１   |
      | phoneNumber       | 1234567890          |
      | cellPhoneNumber   | 1234567899          |

    When User confirms the credit card payment method
    Then User is redirected to Order Review page
    Then Products are present in Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User opens MiniBag
    Then Products are present in Mini Bag
    Then MiniBag price details are accurate
    When User closes the MiniBag
   
