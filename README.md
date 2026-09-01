# RicettaGo — GitHub Pages + Google Sheets + Drive + GPT

Questa versione non richiede Vercel, Firebase o un server tradizionale.

## Architettura
- **GitHub Pages**: interfaccia HTML/CSS/JS e PWA.
- **Google Apps Script**: backend.
- **Google Sheets**: database.
- **Google Drive**: immagini.
- **OpenAI API**: chiamata esclusivamente da Apps Script.

> IMPORTANTE: la chiave OpenAI NON deve essere inserita nel repository GitHub o nel JavaScript pubblico. Il codice può stare tutto su GitHub; il segreto va nelle **Script Properties** di Apps Script.

## 1. Crea il backend Apps Script
1. Apri Google Apps Script e crea un nuovo progetto.
2. Copia `apps-script/Code.gs` nel file `Code.gs`.
3. Copia il contenuto di `apps-script/appsscript.json` nel manifest del progetto.
4. In **Impostazioni progetto → Proprietà script**, crea:
   - `OPENAI_API_KEY` = la tua chiave API OpenAI.
5. Esegui manualmente una volta la funzione `setupRicettaGo`.
6. Autorizza accesso a Fogli Google, Drive e richieste esterne.
7. Nei log troverai il Foglio Google e la cartella Drive creati automaticamente.

## 2. Pubblica Apps Script
1. **Esegui deployment → Nuovo deployment → App web**.
2. Esegui come: **Me**.
3. Accesso: scegli l'opzione che consente alla tua GitHub Page di chiamare la Web App.
4. Copia l'URL che termina in `/exec`.

## 3. Pubblica su GitHub Pages
Carica nella root del repository:
- `index.html`
- `manifest.webmanifest`
- `sw.js`
- cartella `assets`

In GitHub: **Settings → Pages → Deploy from a branch → main / root**.

Apri il sito GitHub Pages, premi ⚙️ e incolla l'URL `/exec` di Apps Script.

## Sicurezza
GitHub Pages è pubblico lato client. Qualunque segreto inserito nei file GitHub può essere letto. Per questo la API key GPT è conservata nelle Script Properties di Google Apps Script. Il browser conosce soltanto l'URL della Web App.

Per un'app personale/familiare questa architettura è semplice ed economica. Prima di renderla pubblica a molti utenti è consigliato aggiungere autenticazione e protezione anti-abuso.

## Importazione da social
Foto/screenshot e testo sono supportati direttamente. Un semplice link Instagram/TikTok/YouTube non garantisce che Apps Script/OpenAI possa leggere il contenuto del post; l'app evita di inventare una ricetta quando il contenuto non è disponibile.


## v2 - Importazione dai siti web
Quando incolli l'URL di una normale pagina di ricetta, Apps Script scarica la pagina e cerca prima i dati strutturati Schema.org Recipe (JSON-LD): titolo, ingredienti, istruzioni, porzioni, tempi, nutrizione e immagine. Se non sono presenti, passa a GPT il testo leggibile della pagina come fallback. La foto principale viene copiata su Google Drive quando il sito ne consente il download.

### Aggiornamento
Sostituisci `index.html` su GitHub e `Code.gs` in Apps Script con quelli di questa versione. Poi crea una nuova versione/deployment della Web App Apps Script. Se cambia l'URL `/exec`, aggiornalo nelle impostazioni di RicettaGo.


## v3 — YouTube e Instagram
- **YouTube**: prova a leggere titolo, descrizione, immagine e la prima traccia di sottotitoli/trascrizione pubblicamente esposta dal player.
- **Instagram Reel/Post**: prova a leggere metadati pubblici (titolo/caption/immagine) dalla pagina.
- Se i dati social sono insufficienti, il backend può tentare una **ricerca web OpenAI** tramite Responses API. Modello configurabile con Script Property `OPENAI_WEB_MODEL`; default `gpt-5-mini`.
- Se anche il recupero web non trova il contenuto, l'app interrompe l'importazione e chiede screenshot/testo: non inventa una ricetta.

### Aggiornamento v3
1. Su GitHub sostituisci `index.html` (e gli eventuali file modificati del pacchetto).
2. In Google Apps Script sostituisci interamente `Code.gs`.
3. Distribuisci una nuova versione della Web App.
4. Mantieni `OPENAI_API_KEY` nelle Script Properties. Facoltativo: aggiungi `OPENAI_WEB_MODEL` = `gpt-5-mini`.
5. Se il nuovo deployment ha un URL `/exec` diverso, aggiornalo in ⚙️ nell'app.

### Nota sui social
Instagram e YouTube possono cambiare markup o limitare accessi automatizzati. Per questo l'importazione è best-effort e include fallback; nessun metodo puramente GitHub/Apps Script può garantire l'accesso a ogni Reel privato, limitato o non indicizzato.


## v3.1
Corretto errore di sintassi nella funzione `meta_()` del file `Code.gs` (virgolette nella RegExp).
