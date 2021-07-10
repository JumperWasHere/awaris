#!/bin/bash

CURRENTDATE=`date +"%Y%m%d_%H%M"`

echo "Enter target [dev|stg|prod]: "
read target

echo Command to be executed: npm run build-$target

echo "Are you confirm? Type one more time target [dev|stg|prod] "
read confirmation

if [[ $target == $confirmation ]]; then
    echo "Start to deploy..."
    git stash
    git pull
    npm i
    npm run build-$target -- --dest dist2
    mv dist dist_${CURRENTDATE}
    mv dist2 dist
else
    echo "don't do that"
fi

