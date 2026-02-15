# Execute este script NA PASTA DO PROJETO para enviar tudo ao GitHub
# Clique com o botao direito no arquivo > "Executar com PowerShell"
# Ou abra o terminal na pasta do projeto e rode: .\push-git.ps1

Set-Location $PSScriptRoot
git add -A
$status = git status --short
if (-not $status) {
    Write-Host "Nenhuma alteracao para enviar. Tudo ja esta commitado."
    git push --force origin main
    Write-Host "Force push executado (remote = local)."
    exit 0
}
git commit -m "Versao completa: README, CHECKLIST-PRODUCAO, config.example, utils, melhorias UX e acessibilidade"
git push --force origin main
Write-Host "Push concluido. GitHub atualizado com o conteudo local."
