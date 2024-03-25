#! /usr/bin/env bash

API="api"
FILE=$1

if [ -z FILE ]
then
  yarn test-all
else
  yarn test-specific "${API}/${FILE}"
fi
