Feature: ACC119

  Scenario: Existing user with CVS Seven store and two Gift Card, Credit Card with Gifting (ACC119)
    Given User goes to Cart
    When User goes to Login page
    When User logs in
      | email    | automation119@uniqlo.com |
      | password | test1234                 |

    Then User is successfully logged in
    When Prerequisites Reset user Cart data
    Given User adds products for "ACC119" to cart from mock page
    And User goes to Cart
    When User gets the order summary price details
    When User enables the gift option
    When User triggers checkout
    Then User is redirected to Order Delivery page
    When User select the cvs delivery method
    When User selects a existing Seven Eleven Convenient Store
    When User edits the Gifting Option from Order Payment page
    When User selects the gifting type and adds message
      | type        | uniqloboxmaterial |
      | messageType | uniqlo    |
      | message     | がんばって！|

    When User select the giftcard payment method
    When User adds a gift card and proceed with part payment mode
      | type       | giftcard            |
      | cardNumber | 9999-1001-0000-0001 |
      | pin        | 1234                |
      | amount     | 100                 |
      | message    | Good day!!!         |

    When User select the giftcard payment method
    When User adds a gift card and proceed with part payment mode
      | type       | giftcard            |
      | cardNumber | 9999-1001-0000-0002 |
      | pin        | 1234                |
      | amount     | 100                 |
      | message    | Good day!!!         |

    When User select the creditCard payment method
    When User selects the existing credit card
    Then User is redirected to Order Review page
    Then Delivery method information is accurate
    Then Payment method information is accurate
    When User fills credit card CVV code "123"
    When User opens MiniBag
    Then MiniBag price details are accurate
    When User closes the MiniBag
   