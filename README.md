[![CircleCI](https://circleci.com/gh/Lercerss/SOEN343.svg?style=svg&circle-token=3131703e1b64c29ce735053475a6c3c55a68436c)](https://circleci.com/gh/Lercerss/SOEN343)

# SOEN343

## Team Information

-   Lucas Turpin (40029907) @Lercerss - lucas_turpin@hotmail.com / Team leader
-   Mila Roisin (29575774) @milaroisin - mila.roisin@gmail.com
-   Riya Dutta (40028085) @riyaGit - riya.dutta1001@gmail.com
-   Patrick Vacca (40028886) @pvacca97 - patrick.vacca04@gmail.com
-   Chirac Manoukian (40028500) @chimano - chiracmanoukian@hotmail.com
-   Panorea Kontis (40032422) @panoreak - panorea.kontis@gmail.com
-   Duy-Khoi Le (40026393) @alvyn279 - alvyn279@gmail.com
-   Joo Yeon Lee (25612950) @niiita - nitachaska@gmail.com
-   Michelle Choi (26307647) @michecho - michy.miche@gmail.com
-   Scott Bouchard (26251625) @sbouchard09 - scottbouchard09@gmail.com

## Anansi Library Management System

This web application uses the following technologies:

-   _Express_, a Node.js back-end framework
-   _MySQL_, a relational database

### Installing Dependencies

Before starting, make sure you have working versions of Node (10.0.0+) and mySQL (5.7.23+). If not, please refer to the [Wiki](https://github.com/Lercerss/SOEN343/wiki/First-Time-Setup-Information) for installation details.

```
node --version
mysql --version
```

Necessary dependencies must be installed for both parts of the application.
For the back-end, execute:
```shell
cd anansiBE/
npm install
```
For the front-end, execute:
```shell
cd anansiUi/
npm install
```

### Database Setup

Create a config file inside `anansiBE/` called `.env`with the following contents, replacing `<password>` with a password of your choice:

```dosini
MYSQL_PASSWORD="<password>"
SECRETKEY="<secret key>"
DATABASE_NAME="anansi_db"
TEST_DATABASE="anansi_db_test"
```

From the MySQL shell, and enter the following SQL statements, replacing `<password>` with the selected password above:

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

The first hardcoded administrator user is already included the migrations.

| username | password |
|----------|----------|
| tester   | test     |

### Running the Back-end Server

To start the back-end server, use the following command from `anansiBE/`:

```
npm start
```

### Running the Front-end Server

To start the front-end server, use the following command from `anansiUI/`:

```
npm start
```
The application will then be accessible at port `8080` exposed locally, i.e. `http://localhost:8080`.
Note that both servers must be running as separate processes for the application to function.
