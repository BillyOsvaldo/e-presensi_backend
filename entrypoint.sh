#!/bin/sh
set -e

CONFIG_DEFAULT="${APP_DIR}/config/default.json"
CONFIG_PROD="${APP_DIR}/config/production.json"

set_environment () {
  export MONGO_URL=${MONGO_URL}
  export MONGO_DB=${MONGO_DB}
  export MONGO_REPLICASET=${MONGO_REPLICASET}
  export AUDIENCE_URL=${AUDIENCE_URL}
  export EAKUN_HOST=${EAKUN_HOST}
  export API_KEY=${API_KEY}
  export HOSTURL=${HOSTURL}
}

set_config() {
  echo 'set MONGO_URL'
  sed -i 's@MONGO_URL@'"$MONGO_URL"'@' $CONFIG_DEFAULT
  echo 'set REPLACE URL MONGO'
  sed -i 's@|@\,@g' $CONFIG_DEFAULT
  echo 'set MONGO_DB'
  sed -i 's@MONGO_DB@'"$MONGO_DB"'@' $CONFIG_DEFAULT
  echo 'set MONGO_RS'
  sed -i 's@MONGO_RS@'"$MONGO_RS"'@' $CONFIG_DEFAULT
  echo 'set AUDIENCE_URL'
  sed -i 's@AUDIENCE_URL@'"$AUDIENCE_URL"'@' $CONFIG_DEFAULT
  echo 'set EAKUN_HOST'
  sed -i 's@EAKUN_HOST@'"$EAKUN_HOST"'@' $CONFIG_DEFAULT
  echo 'set API_KEY'
  sed -i 's@API_KEY@'"$API_KEY"'@' $CONFIG_DEFAULT
  echo 'set HOSTURL'
  sed -i 's@HOSTURL@'"$HOSTURL"'@' $CONFIG_PROD
}

set_environment
set_config
exec "$@"