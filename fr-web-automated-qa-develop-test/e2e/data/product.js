let i18n = require('./i18n');
let language = 'jp';

let products = {
  data: [
    {
      id: '168885',
      quantity: 1,
      //unit: i18n[language].unit,
      description: '',
      color: 'WHITE',
      size: 'MEN 43',
      length: '81.5',
      sku: '168885-00-043-815',
      usedBy: ['ACC1', 'ACC5', 'ACC8', 'ACC205', 'ACC215', 'ACC9', 'ACC169', 'ACC212', 'ACC222', 'ACC51', 'ACC52', 'ACC53', 'ACC54', 'ACC55', 'ACC56', 'ACC57', 'ACC107', 'ACC108', 'ACC109', 'ACC89', 'ACC90', 'ACC25', 'ACC91', 'ACC92', 'ACC93', 'ACC94', 'ACC95', 'ACC96', 'ACC97', 'ACC207', 'ACC209']
    },
    {
      id: '086797',   
      quantity: 1,    
      //unit: i18n[language].unit,    
      description: '',    
      color: '32 BEIGE',    
      size: '73',    
      sku: '086797-32-073-076',   
      usedBy: ['ACC215', 'ACC212', 'ACC218', 'ACC222', , 'ACC3', 'ACC4']    
    },
    {    
      id: '079980',   
      quantity: 1,    
      //unit: i18n[language].unit,    
      description: '',    
      color: 'OFF WHITE',   
      sku: '079980-01-999-000',   
      usedBy: ['ACC210', 'ACC211', 'ACC218', 'ACC220','ACC219', 'ACC221']    
    },    
    {   
      id: '178546',   
      quantity: 1,    
      //unit: i18n[language].unit,    
      description: '',    
      color: 'DARK GRAY',   
      size: '46',   
      length: '72',   
      sku: '178546-08-046-072',   
      usedBy: ['ACC210', 'ACC211', 'ACC213', 'ACC218', 'ACC220', 'ACC221']    
    },
   /* {
      id: '199083',
      quantity: 2,
      //unit: i18n[language].unit,
      description: '',
      color: 'NAVY',
      size: 'MEN M',
      length: '',
      sku: '199083-69-004-000',
      usedBy: ['ACC220', 'ACC195','ACC216','ACC191','ACC176','ACC118','ACC114','ACC116','ACC8','ACC536','ACC4','ACC119','ACC539','ACC126','ACC115','ACC10','ACC143', 'ACC144', 'ACC14', 'ACC145', 'ACC165', 'ACC168', 'ACC197', 'ACC2', 'ACC6', 'ACC7', 'ACC58', 'ACC59', 'ACC60', 'ACC129', 'ACC204', 'ACC153', 'ACC12',]
    },
    {
      id: '169118',
      quantity: 1,
      //unit: i18n[language].unit,
      description: '',
      color: 'GRAY',
      size: '70',
      length: '76',
      sku: '169118-03-070-076',
      usedBy: ['ACC175', 'ACC189', 'ACC193', 'ACC194', 'ACC196', 'ACC3', 'ACC537', 'ACC539', 'ACC176', 'ACC114', 'ACC116', 'ACC117', 'ACC118', 'ACC119', 'ACC179', 'ACC180', 'ACC181', 'ACC205', 'ACC536', 'ACC206', 'ACC193-2'],
    },**/
    {
      id: '137374',
      quantity: 1,
      //unit: i18n[language].unit,
      description: '',
      color: 'DARK GRAY',
      size: '73',
      length: '76',
      sku: '137374-08-073-076',
      usedBy: ['ACC11', 'ACC13', 'ACC198', 'ACC12','ACC215']
    },
    {
      id: '137374',
      quantity: 4,
      //unit: i18n[language].unit,
      description: '',
      color: 'DARK GRAY',
      size: '73',
      length: '76',
      sku: '137374-08-073-076',
      usedBy: ['ACC15', 'ACC16', 'ACC17', 'ACC18', 'ACC166']
    },
    {
      id: '199083',
      quantity: 7,
      //unit: i18n[language].unit,
      description: '',
      color: 'OLIVE',
      size: 'M',
      length: '',
      sku: '199083-57-006-000',
      usedBy: ['ACC142']
    }, 

    {
      id: '137374',
      quantity: 2,
      //unit: i18n[language].unit,
      description: '',
      color: 'DARK GRAY',
      size: '73',
      length: '76',
      sku: '137374-08-073-076',
      usedBy: ['ACC173', 'ACC192','ACC13', 'ACC142', 'ACC167', 'ACC173', 'ACC40', 'ACC110', 'ACC73', 'ACC82', 'ACC83', 'ACC84', 'ACC85', 'ACC86', 'ACC87', 'ACC171', 'ACC170']
    },
       {
      id: '088190',
      quantity: 10,
      //unit: i18n[language].unit,
      description: '',
      color: 'PINK',
      size: 'S',
      sku: '088190-12-003-001',
      usedBy: ['ACC142']
    },
    {
      id: '088190',
      quantity: 10,
      //unit: i18n[language].unit,
      description: '',
      color: 'NAVY',
      size: '3XL',
      sku: '088190-69-008-001',
      usedBy: ['ACC142']
    },
    {
      id: '088190',
      quantity: 10,
      //unit: i18n[language].unit,
      description: '',
      color: 'NAVY',
      size: 'XL',
      sku: '088190-69-006-001',
      usedBy: ['ACC142']
    },
    {
      id: '088190',
      quantity: 10,
      //unit: i18n[language].unit,
      description: '',
      color: 'NAVY',
      size: 'XL',
      sku: '088190-69-006-001',
      usedBy: ['ACC142', 'ACC152']
    },    
    {
      id: '088190',
      quantity: 10,
      //unit: i18n[language].unit,
      description: '',
      color: 'NAVY',
      size: 'XL',
      sku: '088190-69-006-001',
      usedBy: ['ACC142']
    },
    {
      id: '088190',
      quantity: 10,
      //unit: i18n[language].unit,
      description: '',
      color: 'BLUE',
      size: 'XL',
      sku: '088190-62-006-001',
      usedBy: ['ACC142']
    },
    {
      id: '086571',
      quantity: 10,
      //unit: i18n[language].unit,
      description: '',
      color: 'WHITE',
      size: 'S',
      sku: '086571-00-003-001',
      usedBy: ['ACC173', 'ACC174']
    },
    {
      id: '088190',
      quantity: 10,
      //unit: i18n[language].unit,
      description: '',
      color: 'NAVY',
      size: 'XL',
      sku: '088190-69-006-001',
      usedBy: ['ACC142']
    },
    {
      id: '088190',
      quantity: 10,
      //unit: i18n[language].unit,
      description: '',
      color: 'PINK',
      size: 'XL',
      sku: '088190-12-006-001',
      usedBy: ['ACC142']
    },
    {
      id: '088190',
      quantity: 10,
      //unit: i18n[language].unit,
      description: '',
      color: 'BLUE',
      size: 'L',
      sku: '088190-62-005-001',
      usedBy: ['ACC142']
    },
    // {
    //   id: '086571',
    //   quantity: 1,
    //   //unit: i18n[language].unit,
    //   description: '',
    //   color: 'WHITE',
    //   size: 'S',
    //   sku: '086571-00-003-001',
    //   usedBy: ['ACC208','ACC151', 'ACC160', 'ACC188', 'ACC19', 'ACC20', 'ACC200', 'ACC21', 'ACC22', 'ACC23', 'ACC24', 'ACC26', 'ACC27', 'ACC154', 'ACC190', 'ACC202',  'ACC106', 'ACC111', 'ACC112', 'ACC113', 'ACC120', 'ACC121', 'ACC122', 'ACC123', 'ACC124', 'ACC125', 'ACC126', 'ACC127', 'ACC128', 'ACC129', 'ACC130', 'ACC131', 'ACC132', 'ACC133', 'ACC134', 'ACC135', 'ACC136', 'ACC204', 'ACC70', 'ACC71', 'ACC72', 'ACC74', 'ACC75', 'ACC76', 'ACC77', 'ACC78', 'ACC79', 'ACC80', 'ACC81']
    // },
    {
      id: '168860',
      quantity: 1,
      //unit: i18n[language].unit,
      description: '',
      color: 'BLUE',
      size: '36',
      length: '75.5',
      sku: '168860-63-036-755',
      usedBy: ['ACC208','ACC151', 'ACC160', 'ACC188', 'ACC19', 'ACC20', 'ACC200', 'ACC21', 'ACC22', 'ACC23', 'ACC24', 'ACC26', 'ACC27', 'ACC154', 'ACC190', 'ACC202',  'ACC106', 'ACC229', 'ACC111', 'ACC112', 'ACC113', 'ACC120', 'ACC121', 'ACC122', 'ACC123', 'ACC124', 'ACC125', 'ACC126', 'ACC127', 'ACC128', 'ACC129', 'ACC130', 'ACC131', 'ACC132', 'ACC133', 'ACC134', 'ACC136', 'ACC204', 'ACC70', 'ACC71', 'ACC72', 'ACC74', 'ACC75', 'ACC76', 'ACC77', 'ACC78', 'ACC79', 'ACC80', 'ACC81','ACC156', 'ACC157', 'ACC215', 'ACC212', 'ACC163', 'ACC199', 'ACC164', 'ACC172','ACC43', 'ACC36', 'ACC37', 'ACC38', 'ACC39','ACC203', 'ACC44', 'ACC45', 'ACC46', 'ACC41', 'ACC42','ACC47', 'ACC48', 'ACC49', 'ACC50', 'ACC61', 'ACC62', 'ACC63', 'ACC64', 'ACC40','ACC167-2',  'ACC168-2','ACC175', 'ACC189', 'ACC193', 'ACC194', 'ACC196', 'ACC3', 'ACC222', 'ACC176', 'ACC114', 'ACC116', 'ACC117', 'ACC118', 'ACC119', 'ACC179', 'ACC180', 'ACC181', 'ACC205', 'ACC206', 'ACC193-2', 'ACC40', 'ACC167-2', 'ACC168-2','ACC195','ACC191','ACC176','ACC118','ACC114','ACC116','ACC8', 'ACC119', 'ACC126','ACC115','ACC205','ACC10','ACC143', 'ACC144', 'ACC14', 'ACC145', 'ACC165', 'ACC168', 'ACC197', 'ACC2', 'ACC6', 'ACC7', 'ACC58', 'ACC59', 'ACC135', 'ACC60', 'ACC129', 'ACC204', 'ACC153', 'ACC12','ACC195','ACC191','ACC176','ACC118','ACC114','ACC116','ACC8', 'ACC119', 'ACC126','ACC115','ACC205','ACC10','ACC143', 'ACC144', 'ACC14', 'ACC145', 'ACC165', 'ACC168', 'ACC197', 'ACC2', 'ACC6', 'ACC7', 'ACC58', 'ACC59', 'ACC60', 'ACC129', 'ACC204', 'ACC153', 'ACC12','ACC208' ]
    },

    {
      id: '172738',
      quantity: 1,
      //unit: i18n[language].unit,
      description: '',
      color: 'BLACK',
      size: '73',
      sku: '172738-09-073-076',
      usedBy: ['ACC164']
    },
    {
      id: '08657300001',
      //unit: i18n[language].unit,
      quantity: 1,
      description: '',
      color: 'WINE',
      size: 'S',
      sku: '086573-18-003-002',
      usedBy: ['ACC28', 'ACC29', 'ACC30', 'ACC31', 'ACC32', 'ACC33', 'ACC34', 'ACC35', 'ACC100', 'ACC101', 'ACC102', 'ACC103', 'ACC104', 'ACC105', 'ACC98', 'ACC99']
    },
    {
      id: '231003',
      quantity: 1,
      //unit: i18n[language].unit,
      quantity: 1,
      description: '',
      color: 'BLACK',
      size: '28',
      length: '76',
      sku: '231003-09-028-076',
      store: 'GU',
      usedBy: ['ACC146','ACC185', 'ACC187']
    },
    {
      id: '268943',
      quantity: 1,
      description: '',
      color: 'GRAY',
      size: 'S',
      sku: '268943-03-003-000',
      store: 'GU',
      usedBy: ['ACC187']
    },
    {
      id: '229663',
      quantity: 1,
      description: '',
      color: 'OFF WHITE',
      size: '58',
      sku: '229663-01-058-076',
      store: 'GU',
      usedBy: ['ACC228', 'ACC226','ACC227']
    },
    {
      id: '23088900001',
      quantity: 9,
      description: '',
      color: 'PINK',
      size: '58',
      sku: '230889-11-058-076',
      store: 'GU',
      usedBy: ['ACC68', 'ACC148', 'ACC187']
    },
    {
      id: '268942',
      quantity: 1,
      description: '',
      color: 'GRAY',
      size: 'S',
      sku: '268942-09-003-000',
      store: 'GU',
      usedBy: ['ACC88','ACC69','ACC147']
    },
    {
      id: '224841',
      quantity: 1,
      description: '',
      color: 'GRAY',
      size: 'S',
      sku: '224841-56-073-000',
      store: 'GU',
      usedBy: ['ACC223','ACC224','ACC225']
    },
    {
      id: '277366-08-120-000',
      quantity: 1,
      description: '',
      color: 'GRAY',
      size: 'S',
      sku: '277366-08-120-000',
      store: 'GU',
      usedBy: ['ACC223','ACC224','ACC225']

    },
    {
      id: '231678',
      quantity: 1,
      description: '',
      color: 'GRAY',
      size: 'S',
      sku: '231678-09-140-000',
      store: 'GU',
      usedBy: ['ACC223','ACC224','ACC225']

    },
    {
      id: '268930-09-003',
      quantity: 1,
      description: '',
      color: 'GRAY',
      size: 'S',
      sku: '268930-09-003-000',
      store: 'GU',
      usedBy: ['ACC230','ACC231']

    },
    {
      id: '229663',
      quantity: 1,
      //unit: i18n[language].unit,
      description: '',
      color: 'OFF WHITE',
      size: '58',
      length: '76',
      sku: '229663-01-058-076',
      store: 'GU',
      usedBy: ['ACC65', 'ACC66', 'ACC67', 'ACC138', 'ACC140', 'ACC67', 'ACC65','ACC161', 'ACC139', 'ACC141', 'ACC186',]
    },   
      ],

  /**
   * Filters products by Spec used
   * @param {String} specId
   * @return {Array.<products.data>}
   */
  filterByUsage: function (specId) {
    return this.data.filter(function (product) {
      return product.usedBy.includes(specId);
    });
  }

};

module.exports = products;
