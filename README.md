# MyAssignmentRepo 
This repo has HTTP web server with /mean and /stddev endpoints which is containerized with Docker

## Requirements
- Docker installed
- Port specified available from .env file

## Env File
### Ensure you have .env file specifying PORT:
PORT = 5000

## Automate with Shell Script for Mac/Linux or WSL Terminal in Windows Configuration
### Before running bash file make sure you change permission using following code (First time only):
chmod +x run.sh

### Use this code to run:
./run.sh

## If you want to run manually
### Build the image: 
docker build --build-arg PORT=5000 -t myassignmentrepo .

### Run the container:
docker run -d --name myassignmentrepo --env-file .env -p 5000:5000 myassignmentrepo

## Test the endpoints
### To test the endpoint, either we can use POSTMAN or bash terminal

### Bash Terminal
#### For Mean of [1,2,3,4,5]:
curl http://localhost:5000/mean -X POST -d '[1,2,3,4,5]' -H "Content-Type:application/json"

#### For Standard Deviation of [1,2,3,4,5]:
curl http://localhost:5000/stddev -X POST -d '[1,2,3,4,5]' -H "Content-Type:application/json"
