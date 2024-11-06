docker build -t botimages.azurecr.io/msgext-action-js:latest .
az acr login --name botimages
docker push botimages.azurecr.io/msgext-action-js:latest
