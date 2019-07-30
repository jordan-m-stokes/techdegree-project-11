# techdegree-project-11

## setup 
* Clone project
* Install Mongo and Postman if not having done it already
* Run following commands in the `seed-data` folder to setup database
  ```
  mongoimport --db course-api --collection courses --type=json --jsonArray --file courses.json
  mongoimport --db course-api --collection users --type=json --jsonArray --file users.json
  mongoimport --db course-api --collection reviews --type=json --jsonArray --file reviews.json
  ```
* Use `CourseAPI.postman_collection.json` file to setup Postman for testing

## usage
* run `mongod` to start up database
* run `npm start` in project directory to run server
* use postman to send requests to the server

## testing
* the unit testing written for this program only works if the following user exists in the database:
```Javascript
{
  fullName: John Smith,
  emailAddress: john@smith.com,
  password: password
}
```
