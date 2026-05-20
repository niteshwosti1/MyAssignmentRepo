IMAGE_NAME="myassignmentrepo"
CONTAINER_NAME="myassignmentrepo"
ENV_FILE=".env"

if [ -f "$ENV_FILE" ]; then
  export $(cat $ENV_FILE | xargs)
else
  echo "Environment file $ENV_FILE not found. Using default PORT"
  PORT=3000
fi

echo ""
echo "Stopping existing container if running ..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

echo ""
echo "Building Docker Image..."
docker build --build-arg PORT=$PORT -t $IMAGE_NAME .

if [ $? -ne 0 ]; then
  echo "Docker build failed. Exiting."
  exit 1
fi

echo "Build Successful!"

echo ""
echo "Starting Container on port $PORT..."
if [ -f "$ENV_FILE" ]; then
  docker run -d -p $PORT:$PORT --name $CONTAINER_NAME --env-file $ENV_FILE $IMAGE_NAME
else
  docker run -d -p $PORT:$PORT --name $CONTAINER_NAME -e PORT=$PORT $IMAGE_NAME
fi

if [ $? -ne 0 ]; then
  echo "Failed to start Docker container. Exiting."
  exit 1
fi

echo ""
echo "Waiting for server to start..."
MAX_ATTEMPTS=15
WAIT_SECONDS=2

STARTED=false

for i in $(seq 1 $MAX_ATTEMPTS); do
  if curl --silent --fail http://localhost:$PORT/health > /dev/null 2>&1; then
    STARTED=true
    echo "Server is up and running on port $PORT!"
    break
  else
    echo "Attempt $i: Server not responding yet. Retrying in $WAIT_SECONDS seconds..."
    sleep $WAIT_SECONDS
  fi
done

if [ "$STARTED" = false ]; then
  echo "Server failed to start after $MAX_ATTEMPTS attempts. Please check the container logs for more details."
  docker logs $CONTAINER_NAME
  exit 1
fi

# curl http://localhost:$PORT/mean -X POST -d '[1,2,3,4,5]' -H "Content-Type:application/json"
# echo ""

# curl http://localhost:$PORT/stddev -X POST -d '[1,2,3,4,5]' -H "Content-Type:application/json"
# echo ""