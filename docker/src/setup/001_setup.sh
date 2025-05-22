#!/usr/bin/env bash
# test under ubuntu 20.04

set -e

sudo apt update

cd setup

# need to run explicitly with sudo
sudo ./002_setup_chromium.sh

./003_setup_node_1.sh


