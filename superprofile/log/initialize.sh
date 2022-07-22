cd /var/log/faunadb
ALREADY_INITIALIZED="init_flag"
if [ ! -e $ALREADY_INITIALIZED ]; then
   touch $ALREADY_INITIALIZED
   echo "-- initializing fauna... --"
   fauna create-database --secret=abcdef123456 RC4Conference 
   fauna create-key --secret=abcdef123456 RC4Conference | awk '/secret: */{print $2}' -  > dbkey
   fauna upload-graphql-schema /var/log/faunadb/schema.gql --domain="localhost" --port="8443" --scheme="http"  --secret=`cat dbkey` --endpoint=local --graphqlHost=localhost --graphqlPort=8084
else
   echo "-- already initialized, do nothing --"
fi
