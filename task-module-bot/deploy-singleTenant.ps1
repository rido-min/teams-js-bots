$rg="rido-dev"
$botName = Read-Host "Enter the name of the bot" #"my-mcsbot-$(Get-Random)"

echo "Creating Bot $botName in RG $rg"

$appId = az ad app create --display-name $botName --sign-in-audience "AzureADMyOrg" --query appId | ConvertFrom-Json
echo "Created AppId: "  $appId

$secretJson = az ad app credential reset --id $appId | ConvertFrom-Json

az containerapp create `
    -n $botName `
    -g $rg `
    --registry-server botimages.azurecr.io `
    --image botimages.azurecr.io/task-module-bot:latest `
    --ingress external `
    --environment BotApps `
    --secrets clientsecret=$($secretJson.password) `
    --env-vars `
        MicrosoftAppId=$($secretJson.appId) `
        MicrosoftAppPassword="secretref:clientsecret" `
        MicrosoftAppTenantId=$($secretJson.tenant)
        

$acaJson = az containerapp show -n $botName -g $rg | ConvertFrom-Json

$endpoint = "https://$($acaJson.properties.configuration.ingress.fqdn)/api/messages"

Write-Host "Created app at $endpoint"

az bot create `
    --app-type SingleTenant `
    --appid $appId `
    --name $botName `
    --resource-group $rg `
    --endpoint $endpoint `
    --tenant-id $($secretJson.tenant)

