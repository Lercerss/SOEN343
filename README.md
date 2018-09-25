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

If you are a Windows user, configure your `npm` to use Bash as a subshell with the following command:

```shell
npm config set script-shell "C:\\Path\\To\\bin\\bash.exe"
```

To install the necessary packages specified in `package.json`, type the following command from root directory of the project:

```
npm install
```

### Database Setup

Create a JS config file called `hidden.js` in the root directory of the project with the following contents:

```javascript
module.exports = {
    password: "<password>"
};
```

Run mySQL shell, and enter the following SQL statements:

```SQL
CREATE USER 'dbuser'@'localhost' IDENTIFIED BY '<password>';
GRANT ALL PRIVILEGES ON anansi_db.* TO 'dbuser'@'localhost';
FLUSH PRIVILEGES;
```

To create the database and apply migrations, run the following commands:

```Shell
npm run migrate db:create anansi_db -- -e creation
npm run migrate up
```

### Running the Server

To start the web application, use the following command:

```
node app.js
```

### Running the webpack dev server

Inside anansiUI use the following command:

```
npm start
```
