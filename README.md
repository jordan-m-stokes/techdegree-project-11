# Techdegree Project 11 - Course API with Express

## Setup 
* Clone project
* Install Mongo and Postman if not having done it already
* Run following commands in the `seed-data` folder to setup database
  ```
  mongoimport --db course-api --collection courses --type=json --jsonArray --file courses.json
  mongoimport --db course-api --collection users --type=json --jsonArray --file users.json
  mongoimport --db course-api --collection reviews --type=json --jsonArray --file reviews.json
  ```
* Use `CourseAPI.postman_collection.json` file to setup Postman for testing

## Usage
* Run `mongod` to start up database
* Run `npm start` in project directory to run server
* Use Postman to send requests to the server

## Testing
* The unit testing written for this program only works if the following user exists in the database:
```Javascript
{
  fullName: John Smith,
  emailAddress: john@smith.com,
  password: password
}
```
