#!/bin/bash
while true
do
    git add .
    git commit -m "auto update" && git push
    sleep 30
done
