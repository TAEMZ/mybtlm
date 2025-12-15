# Test Brand Sync Workflow

Write-Host "Testing Brand Sync Workflow..." -ForegroundColor Cyan
Write-Host ""

$response = Invoke-RestMethod -Uri "https://n8n.btmls.com/webhook/brand-sync" `
    -Method Post `
    -Headers @{"Content-Type" = "application/json"} `
    -Body (@{user_id = "test-user-123"} | ConvertTo-Json)

Write-Host "Response:" -ForegroundColor Green
$response | ConvertTo-Json -Depth 5

Write-Host ""
Write-Host "Now check your database:" -ForegroundColor Yellow
Write-Host "Run this in Supabase SQL Editor:" -ForegroundColor Yellow
Write-Host ""
Write-Host "SELECT COUNT(*) as brands FROM brands;" -ForegroundColor White
Write-Host "SELECT COUNT(*) as campaigns FROM facebook_campaigns;" -ForegroundColor White
Write-Host "SELECT COUNT(*) as ad_sets FROM facebook_ad_sets;" -ForegroundColor White
Write-Host "SELECT COUNT(*) as ads FROM facebook_ads;" -ForegroundColor White
