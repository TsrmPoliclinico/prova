# 🚀 COME INIZIARE - ISTRUZIONI RAPIDE

## 1. APERTURA DELL'APP
Apri il file `index.html` nel tuo browser:
- **Doppio click** su index.html, oppure  
- Trascina il file nel browser

## 2. NAVIGAZIONE PRINCIPALE
L'app ha 5 sezioni nel menu superiore:

### 📊 Dashboard
- Panoramica generale del sistema
- Visualizza statistiche e avvisi
- Badge rosso mostra numero prodotti in esaurimento

### 📦 Inventario
- Visualizza tutti i prodotti
- Modifica quantità, elimina prodotti
- Aggiungi nuovi prodotti con barcode
- Barra di ricerca per trovare rapidamente

### 📱 Scansione Barcode
- Scansiona barcode con lettore o digita manualmente
- Seleziona Carico (📥) o Scarico (📤)
- Aggiungi note opzionali
- Visualizza ultimi movimenti

### 📋 Nuovo Ordine
- Compila modulo ordine
- Seleziona prodotto, quantità, fornitore
- Ordini attivi mostrati sotto
- Clicca "Segna come Ricevuto" per aggiornare automaticamente inventario

### 📊 Storico Movimenti
- Registro completo di tutte le operazioni
- Filtra per data e tipo
- Esporta dati se necessario

## 3. DATI DI ESEMPIO
L'app viene precaricata con 4 prodotti:
- ✅ Mascherine Chirurgiche (250 pezzi)
- ⚠️ Guanti Nitrile Blu (45 pezzi - BASSO STOCK!)
- ✅ Disinfettante Mani (80 flaconi)
- ✅ Garze Sterili (500 pezzi)

## 4. FUNZIONI PRINCIPALI

### Aggiungere un Prodotto
1. Vai a **Inventario**
2. Compila il form "Aggiungi Nuovo Prodotto"
3. Nome, Codice, Barcode, Quantità, Soglia Minima, Unità
4. Clicca "Aggiungi Prodotto"

### Scaricare/Caricare Materiale
1. Vai a **Scansione Barcode**
2. Scansiona il barcode (o digita manualmente)
3. Il prodotto compare nel pannello
4. Seleziona Carico o Scarico
5. Inserisci quantità
6. Clicca "Conferma Operazione"
7. Il movimento è registrato nello storico

### Creare un Ordine
1. Vai a **Nuovo Ordine**
2. Compila: Fornitore, Prodotto, Quantità, Prezzo
3. Clicca "Crea Ordine"
4. Ordine appare in "Ordini Attivi"
5. Quando arriva: clicca "Segna come Ricevuto"

### Ricevere un Ordine
1. Vai a **Nuovo Ordine**
2. Scorri fino a "Ordini Attivi"
3. Clicca "Segna come Ricevuto"
4. L'inventario si aggiorna automaticamente!

## 5. AVVISI AUTOMATICI ⚠️
- Badge rosso in alto a destra = numero di prodotti critici
- Notifiche toast scompaiono da sole
- App controlla ogni 5 minuti automaticamente

## 6. CONSERVAZIONE DATI
- Tutti i dati salvati nel browser (LocalStorage)
- NON si perdono se ricarichi la pagina
- SI SI PERDONO se cancelli cookie del browser
- **Consiglio**: Fai backup periodici dei dati!

## 7. BARCODE
- Formato standard: 13 cifre (Es: 8901234567890)
- Utilizza lettore barcode USB o digita manualmente
- Il campo è auto-focalizzato quando sei su questa tab

## 8. PROBLEMI COMUNI

**Il barcode non viene trovato**
→ Verifica che il prodotto esista e il barcode sia esatto

**La quantità non si aggiorna**
→ Ricarica il browser (Ctrl+R / Cmd+R)

**Ho perso i dati**
→ Se hai cancellato i dati del browser, non sono recuperabili

**Voglio fare backup**
→ Leggi il README.md per le istruzioni avanzate

## 9. FILE DISPONIBILI
- `index.html` - Interfaccia web (APRI QUESTO)
- `style.css` - Design e stili
- `app.js` - Logica applicazione
- `README.md` - Manuale completo

## 10. CONTATTI/NOTE
- App completamente offline - funziona senza internet
- Compatibile con Chrome, Firefox, Safari, Edge
- Funziona su tablet e smartphone
- Nessuna dipendenza esterna

---

**Pronti? Apri index.html e inizia!** 🏥
