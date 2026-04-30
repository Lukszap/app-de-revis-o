#!/usr/bin/env python3
"""Script para criar card de teste e verificar endpoint /study/due"""
import urllib.request
import urllib.error
import json

BASE_URL = "http://localhost:8000/api"

def api_call(method, path, data=None, token=None):
    """Faz chamada API"""
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    data_bytes = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=data_bytes, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read()
        try:
            return e.code, json.loads(body.decode()) if body else {}
        except:
            return e.code, {"error": body.decode() if body else str(e)}
    except Exception as e:
        return 0, {"error": str(e)}

def login():
    """Login e retorna token"""
    status, data = api_call("POST", "/auth/login", {
        "email": "test@example.com",
        "password": "senha123"
    })
    print(f"Login status: {status}")
    if status == 200:
        return data.get("access_token")
    
    # Se falhar, tenta registrar
    print("Tentando registrar usuário...")
    status, data = api_call("POST", "/auth/register", {
        "email": "test@example.com",
        "password": "senha123",
        "name": "Test User"
    })
    print(f"Register status: {status}")
    if status == 200:
        return data.get("access_token")
    return None

def get_decks(token):
    """Lista decks do usuário"""
    status, data = api_call("GET", "/decks", token=token)
    print(f"Decks status: {status}")
    print(f"Decks: {data}")
    return data if isinstance(data, list) else []

def create_deck(token):
    """Cria deck de teste"""
    status, data = api_call("POST", "/decks", {
        "title": "Deck Teste",
        "description": "Deck para testes",
        "color": "#2196F3"
    }, token)
    print(f"Create deck status: {status}")
    print(f"Response: {data}")
    return data if status == 200 else None

def create_card(token, deck_id):
    """Cria card no deck"""
    status, data = api_call("POST", f"/decks/{deck_id}/cards", {
        "front": "Qual a capital do Brasil?",
        "back": "Brasília"
    }, token)
    print(f"Create card status: {status}")
    print(f"Response: {data}")
    return status == 200

def check_due_cards(token):
    """Verifica cards devidos"""
    status, data = api_call("GET", "/study/due", token=token)
    print(f"Due cards status: {status}")
    print(f"Due cards: {data}")
    return data if isinstance(data, list) else []

def check_stats(token):
    """Verifica estatísticas"""
    status, data = api_call("GET", "/study/stats", token=token)
    print(f"Stats status: {status}")
    print(f"Stats: {data}")

if __name__ == "__main__":
    print("="*50)
    print("Testando API FlashMind")
    print("="*50)
    
    # Login
    token = login()
    if not token:
        print("❌ Falha no login")
        exit(1)
    print(f"✅ Token: {token[:20]}...")
    
    # Check stats atual
    print("\n--- Stats atual ---")
    check_stats(token)
    
    # Check due cards atual
    print("\n--- Due cards atual ---")
    due = check_due_cards(token)
    
    # Se não houver cards, cria um
    if not due:
        print("\n--- Criando card de teste ---")
        decks = get_decks(token)
        
        # Se não tiver deck, cria um
        if not decks:
            print("Criando deck...")
            deck = create_deck(token)
            if deck:
                decks = [deck]
        
        if decks:
            deck_id = decks[0]["id"]
            print(f"Criando card no deck {deck_id}...")
            create_card(token, deck_id)
            
            # Verifica novamente
            print("\n--- Verificando após criação ---")
            check_stats(token)
            due = check_due_cards(token)
            if due:
                print(f"✅ Card criado e disponível: {due}")
            else:
                print("⚠️ Card criado mas não aparece em /due")
                print("   Isso pode ser normal - cards novos só aparecem como 'new' no endpoint /due?new=true")
                print("   Verificando new cards...")
                status, new_cards = api_call("GET", "/study/due?new=true", token=token)
                print(f"New cards: {new_cards}")
        else:
            print("❌ Não foi possível criar deck")
    else:
        print(f"✅ Já existem {len(due)} cards para revisar")
