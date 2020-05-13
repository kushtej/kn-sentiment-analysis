#!/bin/bash

# Give permission before run:
# chmod +x installation.sh
# sudo ./installation.sh

echo "NodeJS Setup in Progress"
pwd
cd kn-SA-web/
npm install
echo "NodeJS Setup Finished"

echo "Django Setup in Progress"
cd ..
cd kn-SA-API/
pipenv run pip -r requirements.txt
echo "Django Setup Finished"

