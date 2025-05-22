#!/usr/bin/env bash
# https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04
set -e

echo "setup start"

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 20
nvm use 20

npm i -g yarn

echo "setup done"
