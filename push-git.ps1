# Execute este script na pasta do projeto para enviar as alteracoes ao GitHub
# Clique com o botao direito no arquivo > "Executar com PowerShell" ou abra o terminal NA PASTA DO PROJETO e rode: .\push-git.ps1

Set-Location $PSScriptRoot
git add -A
$status = git status --short
if (-not $status) {
    Write-Host "Nenhuma alteracao para enviar. Tudo ja esta commitado."
    exit 0
}
git commit -m "Paleta do logo em pedido e pedido-casa (todas as etapas e telas)"
git push origin main
Write-Host "Push concluido."
