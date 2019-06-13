#!/usr/bin/env bash
set -e

SCRIPT_DIR_PATH=$(dirname "$0")

#NETWORKS=""SOVRIN_MAIN_NET,SOVRIN_STAGING_NET,SOVRIN_BUILDER_NET,SOVRIN_TRAINING_NET""
NETWORKS=""SOVRIN_STAGING_NET""

"$SCRIPT_DIR_PATH"/indyscan-daemon/start.sh --mode 'build' --url-mongo "mongodb://localhost:27999" --indy-networks "$NETWORKS"



