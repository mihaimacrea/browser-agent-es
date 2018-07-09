# BrowserAgent

## Install Angular
This project is build using Angular 6.  
In order to install and run it, please follow these steps:  
1. Make sure NodeJS version is 8.9+ (`node -v`)
2. You need npm installed (usually it is shipped with NodeJS)
3. The project does not require Angular Cli installed globally.  
If you do wish to do this, follow the next steps (4-7).  
If not then follow 1.b. under 'Run the project' section by ignoring the following steps (4-7).
4. Install the Cli with `npm install -g @angular/cli`. If you have a previous version of angular (check with `ng -version`), uninstall it (`npm uninstall -g @angular/cli`) and then run the before mentioned command.
5. Clone the project locally
6. `cd` into the project directory and run `npm install`
7. Run the project by following 1.a. under 'Run the project' section after Elastic Search is running

## Install Elastic Search
1. Download Elastic Search 5.5.3 from https://www.elastic.co/downloads/past-releases/elasticsearch-5-5-3
2. Add the following properties to the file elasticsearch.yml under config:  
cluster.routing.allocation.disk.threshold_enabled: false  
http.cors.enabled: true  
http.cors.allow-origin: "*"  
3. `cd` into the Elastic Search directory and execute `./bin/elasticsearch`. This will start a cluster on port 9200. 

## Run the project
1.a. `cd` into the Angular Application directory.  
Project ready to run by executing `ng serve`. Navigate to `http://localhost:4200/`.  
1.b. If you wish to run with the Cli inside the project execute the following command `npm run-script ng serve`.  
Navigate to `http://localhost:4200/`
