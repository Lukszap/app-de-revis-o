# FlashMind Backend Tests (PowerShell)
# Execute com: .\test_backend.ps1

$BASE = "http://localhost:8000/api"
$PYTHON = "..\.venv\Scripts\python.exe"

Write-Host "=== FlashMind Backend Tests ==="

# Usar email único baseado no timestamp
$EMAIL = "teste$(Get-Random)@flash.com"

# 1. Health check
Write-Host "`n[1] Health check..."
$docs = Invoke-RestMethod -Uri "$BASE/docs" -Method GET -ErrorAction SilentlyContinue
if ($docs -match "FlashMind") { Write-Host "OK: docs acessível" } else { Write-Host "FALHOU: docs não encontrado" }

# 2. Registro
Write-Host "`n[2] Registro de usuário... ($EMAIL)"
try {
    $regBody = @{email=$EMAIL; name="Teste"; password="senha123"} | ConvertTo-Json
    $REG = Invoke-RestMethod -Uri "$BASE/auth/register" -Method POST -ContentType "application/json" -Body $regBody
    Write-Host "OK: registro funcionou"
    $TOKEN = $REG.access_token
} catch {
    Write-Host "Usuário já existe, fazendo login..."
    $loginBody = @{email=$EMAIL; password="senha123"} | ConvertTo-Json
    $LOGIN = Invoke-RestMethod -Uri "$BASE/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    Write-Host "OK: login funcionou"
    $TOKEN = $LOGIN.access_token
}

if (-not $TOKEN) { Write-Host "FALHOU: Não foi possível obter token"; exit 1 }

# 3. Me (autenticado)
Write-Host "`n[3] GET /auth/me..."
try {
    $ME = Invoke-RestMethod -Uri "$BASE/auth/me" -Method GET -Headers @{Authorization="Bearer $TOKEN"}
    Write-Host "OK: me retornou usuário ($($ME.email))"
} catch {
    Write-Host "FALHOU: $_"
}

# 4. Criar deck
Write-Host "`n[4] Criar deck..."
try {
    $deckBody = @{title="Inglês B2"; description="Vocabulário avançado"; is_public=$false} | ConvertTo-Json
    $DECK = Invoke-RestMethod -Uri "$BASE/decks" -Method POST -ContentType "application/json" -Body $deckBody -Headers @{Authorization="Bearer $TOKEN"}
    Write-Host "OK: deck criado ($($DECK.id))"
    $DECK_ID = $DECK.id
} catch {
    Write-Host "FALHOU: $_"
    exit 1
}

# 5. Criar card
Write-Host "`n[5] Criar card..."
try {
    $cardBody = @{front="What does ephemeral mean?"; back="Lasting for a very short time"} | ConvertTo-Json
    $CARD = Invoke-RestMethod -Uri "$BASE/decks/$DECK_ID/cards" -Method POST -ContentType "application/json" -Body $cardBody -Headers @{Authorization="Bearer $TOKEN"}
    Write-Host "OK: card criado ($($CARD.id))"
    $CARD_ID = $CARD.id
} catch {
    Write-Host "FALHOU: $_"
    exit 1
}

# 6. Cards devidos
Write-Host "`n[6] Cards devidos hoje..."
try {
    $DUE = Invoke-RestMethod -Uri "$BASE/study/due" -Method GET -Headers @{Authorization="Bearer $TOKEN"}
    Write-Host "OK: endpoint due retornou $($DUE.Length) cards"
} catch {
    Write-Host "FALHOU: $_"
}

# 7. Submeter review
Write-Host "`n[7] Submeter review (quality=4)..."
try {
    $reviewBody = @{card_id=$CARD_ID; quality=4} | ConvertTo-Json
    $REVIEW = Invoke-RestMethod -Uri "$BASE/study/review" -Method POST -ContentType "application/json" -Body $reviewBody -Headers @{Authorization="Bearer $TOKEN"}
    Write-Host "OK: review salva (interval=$($REVIEW.interval), next_review=$($REVIEW.next_review))"
} catch {
    Write-Host "FALHOU: $_"
}

# 8. Stats
Write-Host "`n[8] Stats do usuário..."
try {
    $STATS = Invoke-RestMethod -Uri "$BASE/study/stats" -Method GET -Headers @{Authorization="Bearer $TOKEN"}
    Write-Host "OK: stats (reviews=$($STATS.total_reviews), streak=$($STATS.current_streak))"
} catch {
    Write-Host "FALHOU: $_"
}

# 9. SM-2 unit test
Write-Host "`n[9] Teste unitário SM-2..."
$sm2Test = @"
import os, sys
sys.path.insert(0, '.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.dev')

import django
django.setup()

from apps.estudos.sm2 import calculate_sm2
from datetime import date

r1 = calculate_sm2(4, 2.5, 1, 0)
assert r1['repetitions'] == 1, 'repetitions deve ser 1'
assert r1['interval'] == 1, 'primeiro intervalo deve ser 1'
assert r1['next_review'] > date.today(), 'next_review deve ser futuro'

r2 = calculate_sm2(5, r1['easiness'], r1['interval'], r1['repetitions'])
assert r2['interval'] == 6, 'segundo intervalo deve ser 6'

r3 = calculate_sm2(1, 2.5, 10, 5)
assert r3['repetitions'] == 0, 'falha deve resetar repetitions'
assert r3['interval'] == 1, 'falha deve resetar interval para 1'

print('OK: SM-2 passou em todos os casos')
"@

$sm2Test | & $PYTHON - 2>&1 | ForEach-Object { Write-Host $_ }

Write-Host "`n=== Testes concluídos ==="
