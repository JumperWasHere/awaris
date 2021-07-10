#!/bin/bash

CURRENTDATE=`date +"%Y%m%d_%H%M"`

echo "Enter target [dev|stg|prod]: "
read target

echo "Are you confirm? Type one more time target [dev|stg|prod] "
read confirmation

if [[ $target == $confirmation ]]; then
    mv dist dist_${CURRENTDATE}
    mv dist2 dist
else
    echo "don't do that"
fi

