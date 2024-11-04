docker build -t botimages.azurecr.io/task-module-bot:latest .
az acr login --name botimages
docker push botimages.azurecr.io/task-module-bot:latest
