# BrowserAgent

## Install Angular
This project is build using Angular 6.  
In order to install and run it, please follow these steps:  
1. Make sure NodeJS version is 8.9+ (`node -v`)
2. You need npm installed (usually it is shipped with NodeJS)
3. Make sure you have installed the latest version of Angular Cli (`npm install -g @angular/cli`). If you have a previous version of this, uninstall it and then run the before mentioned command.
4. Clone the project locally
5. `cd` into the project directory and run `npm install`

## Install Elastic Search
1. Download Elastic Search 5.5.3 from https://www.elastic.co/downloads/past-releases/elasticsearch-5-5-3
2. Add the following properties to the file elasticsearch.yml under config:  
cluster.routing.allocation.disk.threshold_enabled: false  
http.cors.enabled: true  
http.cors.allow-origin: "*"  
3. `cd` into the Elastic Search directory and execute `./bin/elasticsearch`. This will start a cluster on port 9200. 

## Run the project
`cd` into the Angular Application directory.  
Project ready to run by executing `ng serve`. Navigate to `http://localhost:4200/`.
