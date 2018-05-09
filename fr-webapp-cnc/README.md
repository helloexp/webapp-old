# SPA Web App
## Get started:

After an initial git clone, run `npm install`

## Development Environment

`npm run dev`

This will start a webpack-dev-server with HMR

## Tests

`npm run test`

## Linting

`npm run lint`

## Deploy the dist folder into staging amazon s3 using webpack

'npm run deploy-staging'

## Production Deployment

`npm run build`
`gulp deploy`

## Server Side
`npm run build`
`npm start`

## Profiling Development Environment

`npm run dev-profiling`

## Profiling Production Environment

`npm run prod-profiling`

## Usage of Profiling information captured

 a) Inside ./performance folder there are 2 folders one for memory snapshots and another one for CPU.

 b) Open Chrome Developer Tools and choose Profiles tab
 
 ![alt tag](https://github.com/fastretailing/fr-webapp/blob/develop/performance/chrome-dev-tools.png)
 
 c) Click on Load and load files corresponding to problem you want to investigate CPU or Memory. 
 Chrome will detect automatically what kind of information is provided and will offer a great visualization tool for you to be able to investigate
 
 Sample CPU:
 
 ![alt tag](https://github.com/fastretailing/fr-webapp/blob/develop/performance/cpu.png)
 
 Sample Memory:
 
 ![alt tag](https://github.com/fastretailing/fr-webapp/blob/develop/performance/memory.png)
