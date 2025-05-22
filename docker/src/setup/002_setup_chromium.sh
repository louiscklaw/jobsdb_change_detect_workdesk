#!/usr/bin/env bash
# test under ubuntu 20.04

set -e

apt-get install -y software-properties-common

apt-mark hold snapd

sudo apt-get install -y chromium

# TODO: remove below
# obsoleted ?
# sudo apt-get install -y python3-launchpadlib
# add-apt-repository -y ppa:saiarcot895/chromium-beta
# apt update
# apt install -y chromium-browser

# for file in *.sh; do
#   bash "$file"
# done
