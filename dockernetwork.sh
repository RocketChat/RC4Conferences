echo "--Creating a docker network for Open Event Server"
docker network ls|grep oesnet > /dev/null || docker network create oesnet

echo "--Creating a docker network for Superprofile"
docker network ls|grep spnet > /dev/null || docker network create spnet

echo "--Creating a docker network for NextJS"
docker network ls|grep mainnet > /dev/null || docker network create mainnet