# dwired
Student / teacher communication platform for Ms. Dwyer.
msdwyerstuy@gmail.com

Javascript instant messsaging tutorial!
https://www.youtube.com/watch?v=lW1vsKMUaKg
Google Auth tutorial
https://scotch.io/tutorials/easy-node-authentication-google

-------

#deployment guide:
1. Have a running Ubuntu and/or Node.js-based D.O. Droplet, with root/sudo users already configured
2. Clone repositiory: https://github.com/dlui220/dwired.git
3. Go into the 'dwired' directory and run ```$ npm install```
4. Make sure all dependencies are installed.
5. In the same directory, run command ``` $ pm2 start mongod server.js```
6. (Optional, but recommended) Run command ```$ pm2 startup ubuntu``` to create a start-up script for the app, following succeeding prompts after command is given.


