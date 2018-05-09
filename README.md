# webapp-old
To install nvm
sudo apt-get install build-essential libssl-dev
sudo -i
curl https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | NVM_DIR=/usr/local/nvm PROFILE=/etc/bash.bashrc bash

Checkout the code both - qa and webapp	
1) Webapp:	https://github.com/fastretailing/fr-webapp
2) QA:	        https://github.com/fastretailing/fr-web-automated-qa

Node versions
1) webapp - 6.5
2) qa - 6.7

Goto Webapp folder location and run the commands	
1. cd /home/anju/Projects/fr-webapp-cnc
2. nvm install 6.5 (if showing error then run sudo -i then nvm install 6.5)
3. nvm use 6.5
4. cd /home/anju/Projects/fr-webapp-cnc
5. npm install
6. npm run build && npm run dll && npm run dev

Go to QA folder location and run the commands	
1. nvm install 6.7
2. (if showing error then run) sudo -i then nvm install 6.7
3. cd /home/anju/Projects/fr-web-automated-qa-develop-test
4. nvm use 6.7
5. npm install
6. (if java not installed) sudo apt-get install default-jre
7. npm run webdriver-install
8. npm run webdriver-start

changing host file in linux	
1. Open a terminal window.
2. Open the hosts file in a text editor (you can use any text editor) by typing the following line: sudo nano /etc/hosts.
3. Enter your domain user password.
4. Make the necessary changes to the file.
5. Press Control-x.
6. When asked if you want to save your changes, answer y.

Chrome downgrade 66 -> 58
First download the chrome 58 from the attached link
sudo apt-get purge google-chrome-stable
sudo dpkg -i <filename>.deb
sudo apt-get install -f

ERROR: connect ECONNREFUSED 127.0.0.1:4444
So delete some hidden files in the project folder like .org.chromium.*	sudo -i 
go to folder location: 
cd /home/anju/Projects/fr-web-automated-qa-develop-test
rm -rf <filename>