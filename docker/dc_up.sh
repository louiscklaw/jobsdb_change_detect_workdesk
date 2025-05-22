#!/usr/bin/env bash

set -ex


# ./build_docker.sh

read -p "Press [Enter] key to provision containers..."
# docker compose kill
# docker compose down

docker compose up -d
# docker compose logs -f
sleep 3
docker compose exec -it pocketbase sh

echo "done"
