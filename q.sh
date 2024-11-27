#!/bin/bash

KIPSH_HOST="root@188.225.80.100"
EXTERNAL_PORT=3000
INTERNAL_PORT=3000
SERVICE_NAME=kipish-nuxt
PREV_VERSION=$(cat package.json | awk '/"version[ :"]*[0-9]*\.[0-9]*\.[0-9]*",/ {print $0}' | sed -s 's:[^0-9\.]*::g')
if [ -z "$1" ]
then
  set -- "1"
fi


NPM_PATH="/root/.nvm/versions/node/v14.21.3/bin/npm"
PM2_PATH="/root/.nvm/versions/node/v14.21.3/bin/pm2"

RERUN_COMMAND="cd /opt/kipish-nuxt && \
  $NPM_PATH install && \
  $PM2_PATH stop ${SERVICE_NAME} || echo 'No process found to stop' && \
  $PM2_PATH start ${NPM_PATH} --interpreter /root/.nvm/versions/node/v14.21.3/bin/node --name '${SERVICE_NAME}' -- run dev -- --key=kipish-nuxt && \
  $PM2_PATH save
"

ssh -t -i ~/.ssh/id_rsa ${KIPSH_HOST} "$RERUN_COMMAND"

