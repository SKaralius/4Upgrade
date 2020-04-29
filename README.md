<h1 align="center"><a href="https://4upgrade.now.sh">Live Website.<a/></h1>

# 4Upgrade

A javascript game where you gather resources and upgrade items.

## Brief overview of the project and its feautures.

This is a very simple, online, RPG style browser game. 
A player creates an account or tries out a demo, gets a few low tier items to start out with,
then uses them to overcome an enemy and randomly receive resources or items.

The upgrade system is random, but can be influenced to the benefit of the player with various resource combinations.
The ultimate goal of the game is to have the best item with the highest possible stats. The progression in the game is quick
and should not take more than a few hours to complete.

## Quick Start
**Instructions with PostgresSQL.**

To have a look at this project on your own machine:
1. Run `npm install` on 4UpgradeFE
2. Run `npm install` on 4UpgradeBE
3. Create a new database in PostgresSQL
4. Go to 4UpgradeBE and create a new file called .env, enter your enviroment variables as such:

```
DATABASE_URL=<your_postgres_connection_url> 

In this format `postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]`

ACCESS_TOKEN_SECRET=<your_secret>
REFRESH_TOKEN_SECRET=<your_secret2>
IP=<your_backend_ip>
```

If you enter your actual IP, then you can connect from any device on your local network. format is: http://0.0.0.0:8080/
if you get the IP wrong here, you just won't be able to see any images, because their paths will be constructed incorrectly.

5. Go to 4UpgradeFE and create a new file called .env, enter your enviroment variables as such:

```
REACT_APP_IP=<your_backend_adress_default_is_http://localhost:8080/>
```

Again, if you enter your actual IP, you can see the project on any device on your local network. Same format: http://0.0.0.0:8080/

6. Run `psql <your_db_name> < 4upgrade.sql`

4upgrade.sql is included in this repository.
It will have some items, stats and resources initialized.

If psql does nothing or returns an error use the connection string in place of <your_db_name>. 

`postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]`

7. Run `npm start` on 4UpgradeBE and 4UpgradeFE and localhost:3000 will have the project.
8. (optional) If you want to make changes to the css, run `npm run sass` on 4UpgradeFE and then make changes to the .scss files. Don't change the automatically generated main.css

## Technologies used
* ### Front End
React, React Router Dom, React Hook Form, SASS, axios.
* ### Back End
Node, express, express-validator, JSON Web Token, bcryptjs and the database is PostgresSQL.

## How it Works
* ### Registration and Logging in
A user has an option to either register or try a demonstration of the project. Both of these options are almost identical, the key difference is that when a user tries a demo, they do not have to enter any information, instead the server generates it for them.

If the user chooses to register, they are asked for a username and a password. The add user route is called with the user's information. The username is checked against the database to make sure there are no duplicates and an error is returned if there are. If the username is unique, an encrypted and salted password, and the username are added to the database. Then, their accounts are set-up. Each user on account creation receives several random low-tier resources and 2 predefined low-tier items, which showcase that each item has its unique stats and how a user is able to switch between the items, use them in the arena.

After the registration process is complete, the user information client side is forwarded to the next route for logging in. The database is queried for user information based on their username. Their password is compared with the hashed one in the database. If all checks succeed, the user is issued 2 JSON Web Token's, access and refresh.

The access token contains the user's username and is valid for 1 hour. The username is then used for identification in the rest of the project, this guarantees that the user really has access to the account they say they do. The refresh token contains a "link". The link is saved in the database and is compared with the link in the refresh token when the access token expires. This is because a refresh token is sensitive information akin to a password, this way it is not stored on the database. Even if someone has the link, they would still need the secret for the JWT. The access, refresh tokens are returned to the user and they're stored in the client.

After receiving a success response from the server, the client writes the current date + 1h to the browser as expiry date and redirects the user to the main page. Each user's request is now intercepted by axios, and the expiry date is checked. If it is less than the current date, that means the token has expired and a new one is requested using the refresh token. A new expiry date and the token are saved in the browser again.

Usernames cannot have special symbols or be over 36 characters long. Passwords cannot be less than 6 characters or more than 255. User input is sanitized and SQL queries are parameterized. The input is validated on client side with React Hook Form, server side with express-validator and finally in the database the correct contraints are set.

* ### Resources and Items
When a user visits the /items route, their resources and items are retrieved from the database based on their encoded username in the JWT. Their total inventory size is compared with the maximum allowed and the remainder is filled with empty array items. The inventory is rendered with item information. A loader is used to wait for item information from the server, and components are rendered conditionally. I.e. if the data is not yet received, the component does not render and does not make other calls to the server dependant on the previous information.

Resources in the inventory are each given an index, which is used to refer to the items when they are moved from the inventory to the transfer box and back.

Resource deletion uses the resources's unique id's. Upon clicking the delete button, a request with the id is sent to the server, the user is authorized by their username encoded in their JWT, the database is updated, and the item is removed from the array from which the inventory is rendered.

Items have a separate inventory with 4 slots. When an item is clicked it is selected as active and will be used in the arena against the enemy, it will also be the item that receives the upgrades from transfer. Item's stats are loaded, a loader is rendered while the item preview changes. 

* ### Upgrade (Transfer)
2 resources can be added to the upgrade. The button is only clickable when the resources are present. When the upgrade button is clicked, the resource id's are sent to the server, together with the selected weapon's entry id. The user is authorized by their username encoded in their JWT as usual. The item id array is checked if its length is valid. Weapon stats for the selected weapon are fetched in the server, then an effect is chosen based on the added items and the effects function is returned and saved in a variable. The first item dictates the effect and second item gives a bonus to it based on the item tier. The higher the item tier is, the stronger the effect. If weapon stats are full or empty and the effect based on the first item would not/cannot do anything, an error is returned and no items are consumed. Otherwise, for each of the items their validaty is confirmed and they are removed from the user, then the previously returned effect function that was saved in a variable is executed.

* ### Arena
A request is sent to the server to create an enemy based on the total damage of the selected item. The higher the damage, the higher tier items the user can receive. Upon clicking the enemy, a request is sent to the server, to deal damage, a random value between the items min and max damage is chosen and returned to the client, which shows the changes to the health bar/circle accordingly. A date + 700ms is set on the server, which acts as a cooldown. The button on the front end is disabled so no requests can be sent during that time. When the enemy's health reaches 0, an end encounter request is sent to the server, the server confirms, that the enemies health is 0 or less and then chooses a reward based on the enemies maximum health, which is then added to the users inventory if there is enough space and sent to the front end. In the front end, the new item or resource is rendered in /items. 
