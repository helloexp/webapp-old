Feature: ACC222

  Scenario: New user with Split Delivery (ACC222)
    
    Given User goes to Cart
    When  User goes to Login page
    When User decides to registers as a new user
    When User registers within the app
      | email    |          |
      | password | test1234 |
      | zip      | 1235555  |

    Then User confirms the new account
    When User returns to Cart
    Given User adds products for "ACC222" to cart from mock page
    Given User goes to Cart
    When User gets the order summary price details
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the shipto delivery method
    When User adds a new delivery address
      | type              | address           |
      | firstName         | ヤマグチヤマグ      |
      | lastName          | ヤマグチヤマグチ     |
      | firstNameKatakana | ヤマグチ            |
      | lastNameKatakana  | タロウ              |
      | postalCode        | 1235555           |
      | prefecture        | 東京都             |
      | city              | 港区赤坂           |
      | street            | 豊洲              |
      | streetNumber      | ２－２０－２        |
      | aptName           | 東京ミッドタウン３１Ｆ|
      | phoneNumber       | 1234567890        |
      | cellPhoneNumber   | 1234567899        |
    
    When User selects individual packing method
    When User validates there exists "2" shipment in individual shipping
    When User selects nextday shipping method for Delivery 1
    When User selects standard shipping method for Delivery 2
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

    When User confirms the credit card payment method
    Then User is redirected to Order Review page
    When User edits the shipping method
    Then User is redirected to Order Delivery page
    When User adds a new Shipping address
    When User adds a new delivery address
      | type              | address          |
      | firstName         | 一道              |
      | lastName          | 木村山            |
      | firstNameKatakana | カズミチ          |
      | lastNameKatakana  | キムラヤマ         |
      | postalCode        | 1350063          |
      | prefecture        | 東京都            |
      | city              | 港区              |
      | street            | 赤坂              |
      | streetNumber      | １－４－２０       |
      | aptName           | 東京都江東区有明１－１ |
      | phoneNumber       | 1234567890       |
      | cellPhoneNumber   | 1234567899       |
    
    When User selects individual packing method
    When User validates there exists "2" shipment in individual shipping
    When User selects bydate shipping method for Delivery 1
    When User selects standard shipping method for Delivery 2
    When User selects standard shipping method for Delivery 3
    When User confirms the shipping method
    Then User is redirected to Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User opens MiniBag
    Then MiniBag price details are accurate
    When User closes the MiniBag