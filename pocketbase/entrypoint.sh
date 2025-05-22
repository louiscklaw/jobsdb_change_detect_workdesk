#!/usr/bin/env sh

set -ex

sleep 1

# original from dockerfile

echo "init first migration for create user"
/usr/local/bin/pocketbase migrate up

echo "create admin account"
/usr/local/bin/pocketbase migrate up --dir=/pb_data --migrationsDir=/pb_migrations


echo "start server"
/usr/local/bin/pocketbase serve \
  --http=0.0.0.0:8090 \
  --dir=/pb_data \
  --migrationsDir=/pb_migrations \
  --publicDir=/pb_public \
  --hooksDir=/pb_hooks &

sleep 5
echo "calling hook"

/usr/local/bin/pocketbase hello
