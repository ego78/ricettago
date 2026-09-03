# RicettaGo Complete v5

RicettaGo è una PWA statica per GitHub Pages con backend Google Apps Script, database Google Sheets, immagini Google Drive, OpenAI e Apify per i Reel Instagram pubblici.

## Funzioni incluse (1–12)
1. Importatore universale: Instagram, YouTube, siti Recipe/JSON-LD, testo, foto/screenshot e fallback controllati.
2. Analisi social: caption + trascrizione + fino a 4 immagini/fotogrammi/copertine esposti dalla fonte; niente ingredienti inventati.
3. Scheda ricetta moderna con foto, macro, fonte/video originale, passaggi spuntabili.
4. Cambio porzioni automatico lato app.
5. Categoria, tag, difficoltà e apparecchi classificati automaticamente.
6. Ricerca normale + ricerca AI in linguaggio naturale.
7. Dispensa: trova ricette compatibili o crea una nuova idea AI.
8. Lista spesa intelligente: aggrega quantità e categorie per reparto.
9. Piano settimanale drag & drop + generazione Menu AI.
10. Preferiti, voto 1–5 e note personali.
11. Conversione in variante Bimby o friggitrice ad aria senza sovrascrivere l'originale.
12. Importazione multipla, un link per riga, eseguita sequenzialmente.

## Aggiornamento da una versione precedente
La funzione `setupRicettaGo()` non cancella i dati: aggiunge le colonne mancanti ai fogli esistenti. È comunque consigliato fare una copia del Foglio Google prima dell'aggiornamento.

## 1. GitHub
Carica nella root del repository:
- `index.html`
- `manifest.webmanifest`
- `sw.js`
- cartella `assets`

GitHub → Settings → Pages → Deploy from branch → `main` / root.

## 2. Google Apps Script
Crea/apri il backend. Sostituisci completamente `Code.gs` con `apps-script/Code.gs` e il manifest con `apps-script/appsscript.json`.

In **Impostazioni progetto → Proprietà script** inserisci:
- `OPENAI_API_KEY` = chiave OpenAI
- `APIFY_API_TOKEN` = token Apify
- facoltativo `OPENAI_MODEL` = modello che vuoi usare (default nel codice: `gpt-5-mini`)
- facoltativo `APIFY_INSTAGRAM_ACTOR` = Actor Apify; default `apify~instagram-reel-scraper`

Non mettere mai API key o token nei file GitHub.

## 3. Migrazione / setup
Esegui manualmente `setupRicettaGo()` una volta. Crea o aggiorna:
- Recipes
- Planner
- Shopping
- Pantry
- ImportLog

Crea inoltre `RicettaGo Immagini` su Drive se non esiste.

## 4. Deployment
Apps Script → Esegui deployment → Gestisci deployment / Nuovo deployment → App web.
- Esegui come: **Me**
- accesso: l'opzione che consente alla GitHub Page di chiamare la Web App

Copia l'URL `/exec` e incollalo in RicettaGo → ⚙ Impostazioni.

## 5. Instagram
La v5 usa Apify per i Reel pubblici. Il backend prova l'Actor con URL diretto e recupera caption, transcript, `displayUrl`, immagini e `videoUrl` quando disponibili. Le URL CDN Instagram possono scadere: per questo la copertina viene copiata su Google Drive.

Se un Reel è privato, rimosso o non restituisce dati sufficienti, RicettaGo interrompe l'importazione invece di creare una scheda vuota. In quel caso usa screenshot/testo.

## 6. Video e fotogrammi
Con l'architettura GitHub + Apps Script non viene eseguito FFmpeg. RicettaGo analizza transcript/caption e le immagini/fotogrammi che la fonte o Apify rendono disponibili. Per testo mostrato solo in fotogrammi non esposti, carica uno screenshot: verrà analizzato via vision.

## 7. Importazione multipla
Usa la modalità **Importazione multipla**, un URL per riga. Il browser effettua una chiamata separata per ogni link, così una fonte lenta non fa fallire l'intero lotto.

## Sicurezza
Le API key sono solo nelle Script Properties. GitHub Pages contiene esclusivamente codice client pubblico. Prima di esporre l'app a utenti non fidati, aggiungi autenticazione/allowlist perché un URL Apps Script pubblico può essere abusato da chi lo scopre.
