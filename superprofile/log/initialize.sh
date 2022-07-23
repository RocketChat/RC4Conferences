cd /var/log/faunadb
ALREADY_INITIALIZED="init_flag"
if [ ! -e $ALREADY_INITIALIZED ]; then
   touch $ALREADY_INITIALIZED
   echo "-- initializing fauna... --"
   fauna create-database RC4Conference 
   fauna create-key RC4Conference | awk '/secret: */{print $2}' -  > dbkey
   echo "-- uploading graphql schema... --"
   fauna upload-graphql-schema /var/log/faunadb/schema.gql --domain="localhost" --port="8443" --scheme="http"  --secret=`cat dbkey` --graphqlHost=localhost --graphqlPort=8084 --mode=replace
   echo "-- schema uploaded successfully... --"
   echo "-- initializing fauna collection User... --"
   fauna eval RC4Conference --file=/var/log/faunadb/initUser.fql
   echo "-- initializing fauna collection EventUser... --"
   fauna eval RC4Conference --file=/var/log/faunadb/initEvuser.fql
else
   echo "-- already initialized, do nothing --"
fi
