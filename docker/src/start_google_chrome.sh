#!/usr/bin/env bash

set -ex

cd /config
  rm -rf Single*
cd ..

/usr/bin/google-chrome --user-data-dir='/config'

echo "done"
