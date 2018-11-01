[![CircleCI](https://circleci.com/gh/Lercerss/SOEN343.svg?style=svg&circle-token=3131703e1b64c29ce735053475a6c3c55a68436c)](https://circleci.com/gh/Lercerss/SOEN343)

# SOEN343

## Team Information

-   Lucas Turpin (40029907) - lucas_turpin@hotmail.com / Team leader
-   Mila Roisin (29575774) - mila.roisin@gmail.com
-   Riya Dutta (40028085) - riya.dutta1001@gmail.com
-   Patrick Vacca (40028886) - patrick.vacca04@gmail.com
-   Chirac Manoukian (40028500) - chiracmanoukian@hotmail.com
-   Panorea Kontis (40032422) - panorea.kontis@gmail.com
-   Duy-Khoi Le (40026393) - alvyn279@gmail.com
-   Joo Yeon Lee (25612950) - nitachaska@gmail.com
-   Michelle Choi (26307647) - michy.miche@gmail.com
-   Scott Bouchard (26251625) - scottbouchard09@gmail.com

## Important Commands

This web application uses the following technologies:

-   _Express_, a Node.js back-end framework
-   _MySQL_, a relational database

### Installing Dependencies

Before starting, make sure you have working versions of Node (10.0.0+) and mySQL (5.7.23+). If not, please refer to the [Wiki](https://github.com/Lercerss/SOEN343/wiki/First-Time-Setup-Information) for installation details.

```
node --version
mysql --version
```

We need to install the necessary node packages for front-end and back-end specified in all `package.json`. Type the following command from root directory of the project AND from anansiUI/:

```
npm install
```

### Database Setup

Create a config file called `.env` in anansiBE/ (located in the root directory of the project) with the following contents:

```dosini
MYSQL_PASSWORD="<password>"
SECRETKEY="<secret key>"
DATABASE_NAME="anansi_db"
TEST_DATABASE="anansi_db_test"
```

Run mySQL shell, and enter the following SQL statements:

```SQL
CREATE USER 'dbuser'@'localhost' IDENTIFIED BY '<password>';
GRANT ALL PRIVILEGES ON `anansi_db%`.* TO 'dbuser'@'localhost';
FLUSH PRIVILEGES;
```

To create the database and apply migrations, run the following commands:

```Shell
#dev database
npm run migrate db:create anansi_db -- -e creation 
npm run migrate up

#test database
npm run migrate db:create anansi_db_test 
npm run test_migrate up
```

The first hardcoded administrator user is already included the migrations. The username/password credentials are set to **tester/test**

### Running the Server

To start the web application, use the following command inside anansiBE/:

```
npm start
```

### Running Webpack Dev Server

Inside anansiUI/, run the following command as a separate process from the Express server (on another terminal):

```
npm start
```
