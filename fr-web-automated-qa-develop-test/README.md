# ACC Automation project

## Setup environment

### Install node

NodeJS download page: https://nodejs.org/en/download/current/

### Setup local application environment

Add the following line to hosts file
 - ```127.0.0.1       dev.uniqlo.com```
 
*Clone* fr-webapp locally <br />
- ```npm install```
- ```npm run build```
- ```npm run dll```
- ```npm run dev```

### Setup local test environment

*Clone* fr-web-automated-qa
 -```npm install```

### Lint project files

**NOTE:**
*Please lint each time you push code to origin.*
 -```npm run lint```

## Run automated tests

### Run tests on local dev env

**Test prerequisites**
- ```npm run webdriver-install```
- ```npm run webdriver-start```

#### All the tests except the ones with existing users

- ```npm run test-new-user``` - can be used by dev team to run on local and not interfere with Jenkins

#### Chrome browser with Android emulation

- ```npm run test-android```

#### Safari browser with iOS emulation

- ```npm run test-ios```

#### CI like run

- ```npm run test-ci```

#### Run SINGLE test

- ```npm run test-single [relativePathToTestFile]``` - relative to AppRootFolder<br />
E.g.: ```npm run test-single e2e/specs/cartCheckoutFlow/newuser/P01-ACC112-shippingAndCreditCard.spec.js```

