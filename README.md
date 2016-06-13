# dwired
Student / teacher communication platform for Ms. Dwyer.
msdwyerstuy@gmail.com

Hosted on: 
dwyred.mooo.com

-------

#deployment guide:
1. Have a running Ubuntu and/or Node.js-based D.O. Droplet, with root/sudo users already configured
2. Clone repositiory: https://github.com/dlui220/dwired.git
3. Go into the 'dwired' directory and run ```$ npm install```
4. Make sure all dependencies are installed.
5. In the same directory, run commands:
``` $ pm2 start mongod -- --dbpath ./data --smallfiles``` 
``` $ pm2 start server.js```
6. (Optional, but recommended) Run command ```$ pm2 startup ubuntu``` to create a start-up script for the app, following succeeding prompts after command is given.

Note: There may be an issue with the 'bcrypt' dependency, which means you will have to ```$ npm install bcrypt``` in order to fix.


