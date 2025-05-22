#!/bin/bash

# Set the maximum interval duration in seconds
MAX_INTERVAL_SEC=180

# Set the minimum interval duration in seconds
MIN_INTERVAL_SEC=120

# Define the command to run
# openbox-poe-seat\src\carousell-click-burner\start_chrome.js

while :
do
    # node ./carousell-sell-scrape/scrape_sell_post.js 1300000000 &
    cd tests
      node ./011_jobsdb_fetch_job_detail.js
      # node ./start_chrome.js
    cd -

    OFFSET=$(((RANDOM % $(($MAX_INTERVAL_SEC-$MIN_INTERVAL_SEC))) + $MIN_INTERVAL_SEC))

    echo "THIS_ITERATION_START $THIS_ITERATION_START ..."
    echo "Waiting for $OFFSET seconds..."

    # Wait for the specified number of seconds
    sleep $OFFSET
done
