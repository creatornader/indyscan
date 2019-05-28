#!/bin/bash

./build-ubuntu-libindy.sh
./build-tool.sh "indyscan-daemon" "./indyscan-daemon/Dockerfile"
