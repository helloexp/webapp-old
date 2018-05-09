## Goal
_**Scalable**_ test infrastructure.
Provide means to **_easily_** test components.
Assist code development by enforcing standards, such that code is the same everywhere and is easily maintainable and readable.
Scalable coverage reporting system.
Ability to generate **_application-wide_** coverage reports.
Enforce code standards and lint code.

## Means to achieve the goal
Introduced two ways to run written test cases. 

1. First is using Webpack to transpile the code using babel, bundle it together and afterwards `require` all test cases, effectively running them. This is not as efficient (time taken to complete) but enables us to do the following:

    - [x] debug our code **real-time** inside of Chrome, using **Chrome devtools**. The code is mapped used `inline-source-maps`, so we're effectively looking at **ES6 source as-is** when debugging and stepping through code.
    - [x] when debugging, **step through actual sources** as well, which we are testing, not just test case source code itself.
    - [x] run the unit tests across a wide variety of browsers
    - [x] browsers supported:
        - [x] Chrome
        - [x] Firefox
        - [x] Safari
        - [x] jsdom
        - [ ] PhantomJS2 - difficulties with ES6 code and shims, specifically Array Proto methods (for more details look at [this issue opened by the author of PhantomJS](https://github.com/ariya/phantomjs/issues/14506)
    - [x] parallelize running tests across many browsers at once
    - [x] benefit from everything that comes from using webpack as a bundler, which would be a list too long to cover here

2. Second is using a leaner **pure** NodeJS approach for accomplishing the same task. It runs _**extremely fast**_ but we lose out on the benefits of real-time source code debugging within Chrome. It is also limited to one browser, which is _technically_ not a browser: **jsdom**.

## New scripts for running unit tests
1. **```test```** - Using `#2` from above, it runs the headless (browserless) unit tests in a fast manner.
2. **```t:w```** - Same as ```test```, but with watch mode on. Short-hand for developer leniency.
3. **```test:w```** - Same as above.
4. **```test:watch```** - Same as above.
5. **```test:webpack```** - Using `#1` from above, it runs the webpack bundled method of running unit tests. Can optionally take the `browsers` parameter from CLI in a comma separated manner. 
    * For example: ```npm run test:webpack -- browsers=chrome,firefox```
6. **```test:webpack:watch```** - Same as ```test:webpack```, but with watch mode on.
7.  **```test:webpack:w```** - Same as above, short-hand for developer leniency.
8. **```test:w:w```** - Same as above.
9. **```test:webpack:full```** - Same as ```test:webpack```, except with a predefined full stack of browsers, running the tests across all browsers currently supported.
10. **```test:w:f```** - Same as above, short-hand for developer leniency.
11. **```test:webpack:full:watch```** - Same as above, except with watch mode on.
12. **```t:w:f:w```** - Same as above, short-hand for developer leniency. **Yes we are lazy.**

The list is extensive but most are duplicates for fast short-hand access.
Most important ones are:
1. **```test```**
2. **```test:watch```**
3. **```test:webpack```**
4. **```test:webpack:watch```**

### Helper methods ###

A solid number of helper methods have also been included unit test-wide.
You no longer have to specifically import the following, because they are implicitly available in a global scope when writing unit tests:

- [x] chai - assertion library
- [x] sinon - test framework
- [x] icepick - test utility that helps with immutable structures or quickly passing in `sinon spies` as replacement for properties or methods
- [x] shallow - Enzyme way of rendering component into the DOM, only top level render for speed considerations. Currently doesn't support lifecycle methods, but [it is work in progress](https://github.com/facebook/react/pull/7912), and there is [a functional workaround](https://github.com/airbnb/enzyme/issues/34).
- [x] mount - Fully render component into DOM using Enzyme. Fully supports lifecycle methods.
- [x] testHelpers - A wide variety of helper functions exposed to render with different props and objects to assign to the react `context`.

The exposed testHelper functions are very suggestive as to what they do:
```
export function shallowWithStore(node, store = defaultStore)
export function shallowWithConfig(node, config = defaultConfig)
export function shallowWithI18n(node, i18n = defaultI18n)
export function shallowWithStoreAndConfig(node, store = defaultStore, config = defaultConfig)
export function shallowWithStoreAndI18n(node, store = defaultStore, i18n = defaultI18n)
export function shallowWithConfigAndI18n(node, config = defaultConfig, i18n = defaultI18n)
export function shallowWithAll(node, i18n = defaultI18n, store = defaultStore, config = defaultConfig)
export function mountWithConfig(node, config = defaultConfig)
export function mountWithStore(node, store = defaultStore)
export function mountWithI18n(node, i18n = defaultI18n)
export function mountWithStoreAndI18n(node, store = defaultStore, i18n = defaultI18n)
export function mountWithStoreAndConfig(node, store = defaultStore, config = defaultConfig)
export function mountWithConfigAndI18n(node, config = defaultConfig, i18n = defaultI18n)
export function mountWithAll(node, store = defaultStore, config = defaultConfig, i18n = defaultI18n)
```

Additionally, another exposed function is `stubComponent`, which will stub out lifecycle methods as well as props (if need be).

The function signature is below:

```export function stubComponent(componentClass, stubProps = false)```

---------------------------------------------------------------

TODO: 

- [ ] Introduce [jest testing framework](https://facebook.github.io/jest/) as an alternative means to test code. More oriented for code that is finished and ready to _lock down_.

----------------------------------------------------------------
## Coverage and ways to achieve it

The tool of choice is [NYC](https://github.com/istanbuljs/nyc) combined together with [this babel plugin](https://github.com/istanbuljs/babel-plugin-istanbul). These together instrument all sources that we have, even if there are no tests written for it. Currently there's nearly nothing on the internet that will enable us to do what I managed to do in here. There's a good handful of currently open issues in many repositories (Babel, Karma, Webpack, Istanbul, NYC) that deal with this specific use-case.

To check application code coverage, the following npm scripts are available:

1. **```coverage```** - will instrument all application code (some files are ignored because there is nothing to instrument, for example they only contain imports / exports - nothing to worry about) and afterwards run a jsdom enclosed unit test batch. At the end the report can be found under the `coverage` folder in the root of the application folder.
   * The created report is entirely browsable and is to be opened up in a browser. HTML format and is extremely easy to use. Self-explanatory.

    * ![image](https://cloud.githubusercontent.com/assets/4669986/19618504/ac74c5da-9854-11e6-9712-24181d1e29b9.png)

2. **```coverage:report```** - will print out in the console the results of a previously run coverage report in a pretty format.

```
=============================== Coverage summary ===============================
Statements   : 18.68% ( 2219/11881 )
Branches     : 8.8% ( 553/6281 )
Functions    : 7.51% ( 157/2090 )
Lines        : 18.95% ( 2160/11401 )
================================================================================
```
And yes, our numbers are **_extremely low_** right now. Not only that, the code quality for unit tests is horrendous and needs to improve dramatically. With the tools provided by me, it should be a lot easier to achieve.

## Lint and enforced code standards

Code quality is very important. There are a lot of problems in our current codebase that can very easily lead to many issues further down the road. Extensibility, re-usability and readability all have to suffer for it. Let alone performance.

I have introduced a great deal of many new lint rules that will uncover most of these issues, but the vast majority of these rules have been chocked out, using a `0` level of warning in our `eslintrc`. The reason for this is that we have above `6,000` lint errors. In addition to the `~3,000` that I have resolved in this PR.

Some of these rules are up for debate, if need be. I can personally guarantee that they provide a clean and easy way to ensure code readability and maintainability.

To check for lint issues, you have the following npm scripts at your disposal:

1. ```lint``` - Checks all sources for lint errors.
2. ```lint:w``` - Same as above, but turns on watch mode. You can go through sources and fix the errors. Once you save the sources, it will re-run the check. Same as unit tests.
3. ```lint:f``` - Will run ```lint``` but it will try to fix some broken rules along the way that are safe to fix automatically and do not require manual interaction.

- Below you can find the choked out linter rules that we need to get around to fixing application-wide:
    * `"consistent-return": 0, // TODO`
    * `"arrow-body-style": 0, // TODO`
    * `"no-mixed-operators": 0, // TODO`
    * `"no-case-declarations": 0, // TODO`
    * `"no-unused-vars": 0, // TODO`
    * `"jsx-a11y/no-static-element-interactions": 0, // TODO`
    * `"jsx-a11y/label-has-for": 0, // TODO`
    * `"no-useless-escape": 0, // TODO`
    * `"no-prototype-builtins": 0, // TODO`
    * `"import/imports-first": 0, // TODO`
    * `"no-plusplus": 0, // TODO`
    * `"import/no-named-as-default": 0, // TODO`
    * `"import/no-named-as-default-member": 0, // TODO`
    * `"no-param-reassign": 0, // TODO`
    * `"no-underscore-dangle": 0, // TODO`
    * `"no-confusing-arrow": 0, // TODO`
    * `"prefer-const": 0, // TODO`
    * `"import/newline-after-import": 0, // TODO`
    * `"object-property-newline": 0, // TODO`
    * `"no-duplicate-imports": 0, // TODO`
    * `"import/prefer-default-export": 0, // TODO`
    * `"react/no-unused-prop-types": 0, // TODO`
    * `"no-useless-concat": 0, // TODO`
    * `"global-require": 0, // TODO`
    * `"no-unneeded-ternary": 0, // TODO`
    * `"class-methods-use-this": 0, // TODO`
    * `"array-callback-return": 0, // TODO`
    * `"react/jsx-first-prop-new-line": 0, // TODO`
    * `"no-extra-boolean-cast": 0, // TODO`
    * `"react/prop-types": 0, // TODO`
    * `"react/style-prop-object": 0, // TODO`
    * `"react/jsx-no-duplicate-props": 0, // TODO`
    * `"no-bitwise": 0, // TODO`
    * `"no-return-assign": 0, // TODO`
    * `"no-template-curly-in-string": 0, // TODO`
    * `"react/sort-comp": 0, // TODO`
    * `"no-useless-constructor": 0, // TODO`
    * `"no-use-before-define": 0, // TODO`
    * `"jsx-a11y/img-has-alt": 0, // TODO`
    * `"prefer-rest-params": 0, // TODO`
    * `"jsx-a11y/lang": 0, // TODO`
    * `"no-restricted-syntax": 0, // TODO`
    * `"react/no-unescaped-entities": 0, // TODO`
    * `"react/no-find-dom-node": 0, // TODO`
    * `"react/prefer-stateless-function": 0, // TODO`
    * `"import/no-dynamic-require": 0, // TODO`
    * `"jsx-a11y/anchor-has-content": 0, // TODO`
    * `"react/no-danger": 0, // TODO`
    * `"react/jsx-no-bind": 0, // TODO`
    * `"operator-assignment": 0, // TODO`
    * `"no-lonely-if": 0, // TODO`
    * `"import/no-mutable-exports": 0, // TODO`
    * `"comma-dangle": 2, // TODO`

# Summary

#### Tests now run smooth and fast. ####
#### We achieved scalability for all our test related systems. ####
#### Memory usage dropped to one eighth of what it used to be (1/8). ####
#### We have the ability to debug them in an extremely developer friendly environment. ####
#### We have many helper methods to be able to write unit tests that are easy and fast. ####
#### Writing unit tests will be an enjoyable experience and no longer a pain. ####
#### We have full coverage report across the board. ####
#### Easy to run reports and easy to see what's missing. Very intuitive interface. ####
#### Code standards now will be enforced and we will have the infrastructure to support it. ####
#### New lint rules will keep the code clean and maintainable. ####
