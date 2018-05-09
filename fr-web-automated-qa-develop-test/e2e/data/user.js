/*
 * CreditCard test data used for the test cases
 TODO
 * Need to update the test bed according to page modifications
 */

module.exports = {
  valid:   {
    existing: [
      {
        email:    'automation1477972195682@uniqlo.com',
        password: 'test1234'
      },
      {
        //Used for ACC-113
        email:    'automation100@uniqlo.com',
        password: 'test1234',
        zip:      1410021,
        year:     '1985',
        month:    '01',
        day:      '01',
        gender:   'male',
        usedBy:    ['test3']
      },
      {
        //Used for ACC-234
        email:    'automation101@uniqlo.com',
        password: 'test1234',
        zip:      1410021,
        year:     '1986',
        month:    '04',
        day:      '06',
        gender:   'male',
        usedBy:    ['test3']        
      },
      {
        //Used for ACC-237
        email:    'automation102@uniqlo.com',
        password: 'test1234',
        zip:      1410021,
        year:     '1980',
        month:    '03',
        day:      '03',
        gender:   'male',
        usedBy:    ['test3']        
      },
      {
        //Used for ACC-240
        email:    'automationuser1001@uniqlo.com',
        password: 'test1234',
        zip:      1410021,
        year:     '1980',
        month:    '03',
        day:      '03',
        gender:   'male',
        usedBy:    ['test3']
      },
      {
        //Used for ACC-254
        email:    'automationuser1002@uniqlo.com',
        password: 'test1234',
        zip:      1410021,
        year:     '1980',
        month:    '03',
        day:      '03',
        gender:   'male',
        usedBy:    ['test3']
      },
      {
        //Used for ACC-239
        email:    'automationnew239@uniqlo.com',
        password: 'test1234',
        zip:      1410021,
        year:     '1980',
        month:    '01',
        day:      '01',
        gender:   'male',
        usedBy:    ['test3']
      },
      {
        //Used for ACC-271
        email:    'automation271@uniqlo.com',
        password: 'test1234',
        zip:      1410021,
        year:     '1980',
        month:    '01',
        day:      '01',
        gender:   'male',
        usedBy:    ['test3']
      },
      {
        //Used for ACC-387
        email:    'automation387@uniqlo.com',
        password: 'test1234',
        zip:      1410021,
        year:     '1985',
        month:    '01',
        day:      '01',
        gender:   'male',
        usedBy:    ['test3']
      }
    ],
    new:      [
      {
        email:    'automation' + new Date().getTime() + '@uniqlo.com',
        password: 'test1234',
        zip:      1076231,
        year:     '1980',
        month:    '04',
        day:      '07',
        gender:   'male',
        usedBy:    ['test3']
      },
      {
        email:    'automation' + new Date().getTime() + '@uniqlo.store',
        password: 'test1234',
        zip:      1076231,
        year:     '1981',
        month:    '05',
        day:      '07',
        gender:   'male',
        usedBy:    ['prodtest-store']
      }, 
      {
        email:    'automation' + new Date().getTime() + '@uniqlo.store',
        password: 'test1234',
        zip:      1076231,
        year:     '1981',
        month:    '05',
        day:      '07',
        gender:   'male',
        usedBy:    ['test3-store']
      },
      {
        email:    'automation' + new Date().getTime() + '@uniqlo.com',
        password: 'test1234',
        zip:      1076321,
        year:     '1982',
        month:    '06',
        day:      '07',
        gender:   'male',
        usedBy:    ['test']
      },
      {
        email:    'automation' + new Date().getTime() + '@uniqlo.com',
        password: 'test1234',
        zip:      1076321,
        year:     '1982',
        month:    '06',
        day:      '07',
        gender:   'male',
        usedBy:    ['prodtest']
      }      
    ]
  },
  invalid: {
    email:    {
      email:    'qbautomn@qburst.com',
      password: 'qburst123'
    },
    password: {
      email:    'qbautomation@qburst.com',
      password: 'qburst1'
    }
  },

    /**
   * Filters products by env used
   * @param {String} env
   * @return {Array.<coupons.valid>}
   */
  filterByUsage: function (env) {
    return this.valid.new.filter(function (user) {
      return user.usedBy.includes(env);
    });
  }
};
