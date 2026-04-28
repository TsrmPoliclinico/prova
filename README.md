# 🩻 Gestione Ordini e Magazzino Radiologia

Una web app moderna e intuitiva per gestire l'inventario e gli ordini del magazzino radiologico con notifiche automatiche.

## ✨ Caratteristiche Principali

### 📊 Dashboard
- **Statistiche in tempo reale**: Numero totale di prodotti, prodotti in esaurimento, ordini pendenti
- **Avvisi Importanti**: Visualizzazione centralizzata di tutti gli allarmi
- **Prodotti in Esaurimento**: Elenco rapido dei prodotti sotto la soglia minima

### 📦 Gestione Inventario
- **Aggiungi Prodotti**: Carica nuovi prodotti con nome, codice, barcode, quantità e soglia minima
- **Modifica Quantità**: Aggiorna facilmente le quantità dei prodotti
- **Ricerca**: Cerca prodotti per nome o codice
- **Eliminazione**: Rimuovi prodotti non più necessari

### 📱 Scansione Barcode
- **Lettura Barcode**: Utilizza un lettore barcode o inserisci manualmente il codice
- **Operazioni Rapide**: Carico e scarico istantanei
- **Storico Movimenti**: Visualizza gli ultimi movimenti effettuati
- **Note**: Aggiungi note a ogni operazione

### 📋 Gestione Ordini
- **Crea Ordini**: Ordina nuovo materiale direttamente dall'app
- **Tracciamento**: Monitora stato, fornitore, data prevista di consegna
- **Ricezione**: Segna gli ordini come ricevuti e aggiorna automaticamente l'inventario
- **Annullamento**: Cancella ordini quando necessario

### ⚠️ Sistema di Notifiche
- **Badge in Tempo Reale**: Numero di prodotti in esaurimento sempre visibile
- **Avvisi Automatici**: Notifiche quando un prodotto scende sotto la soglia minima
- **Durata Personalizzata**: Messaggi che scompaiono dopo un tempo configurabile

### � Notifiche via Email
- **Configurazione Semplice**: Setup rapido con EmailJS
- **Avvisi Automatici**: Email quando un prodotto scende sotto la soglia
- **Controllo Frequenza**: Imposta quanto spesso ricevere gli avvisi (ogni ora, 4 ore, 8 ore, 24 ore)
- **Test Email**: Verifica che la configurazione sia corretta prima dell'uso

### 📊 Storico Movimenti
- **Registro Completo**: Tutti i movimenti di carico e scarico registrati
- **Filtri**: Filtra per data e tipo di operazione
- **Storico Ordini**: Traccia tutti gli ordini effettuati

### ⚙️ Impostazioni
- **Email Notifiche**: Configura le notifiche automatiche via email
- **Frequenza Regolabile**: Scegli quanto spesso ricevere gli avvisi
- **Test Email**: Invia un email di prova per verificare il setup
- **Stato Live**: Visualizza lo stato della configurazione

## 🚀 Come Iniziare

### 1. Apertura dell'Applicazione
Apri il file `index.html` nel tuo browser web:
- Doppio click su `index.html`, oppure
- Trascina il file nella barra degli indirizzi del browser, oppure
- Clicca destro su `index.html` → "Apri con" → Seleziona il browser

### 2. Navigazione
L'app è divisa in 5 sezioni principali accessibili dal menu in alto:

#### **Dashboard** 📊
Panoramica generale del sistema:
- Visualizza statistiche importanti
- Vedi gli avvisi attivi
- Identifica velocemente i prodotti in esaurimento

#### **Inventario** 📦
Gestione completa del magazzino:
1. **Visualizza Prodotti**: Scorri l'elenco di tutti i prodotti
2. **Aggiungi Prodotto**:
   - Nome Prodotto (es: "Mascherine Chirurgiche")
   - Codice Prodotto (es: "MASC001")
   - Barcode (es: "8901234567890")
   - Quantità Iniziale (es: "250")
   - Soglia Minima Allarme (es: "50")
   - Unità di Misura (Pezzi, Scatole, Flaconi, etc.)
3. **Modifica**: Clicca "Modifica" per aggiornare la quantità
4. **Elimina**: Rimuovi prodotti non necessari

#### **Scansione Barcode** 📱
Operazioni rapide di carico e scarico:
1. **Preparazione**: Posiziona il cursore nel campo di input (è già automaticamente focalizzato)
2. **Scansione**: Scansiona il barcode con un lettore, oppure digita manualmente il codice
3. **Seleziona Operazione**:
   - 📥 Carico: Per aggiungere stock
   - 📤 Scarico: Per prelevare dal magazzino
4. **Inserisci Quantità**: Specifica quanti articoli
5. **Aggiungi Note** (opzionale): Es "Ricevimento da fornitore XYZ"
6. **Conferma**: Clicca il pulsante per registrare

**Tip**: Se il prodotto non viene trovato, verifica che il barcode sia stato inserito nel sistema dalla sezione Inventario.

#### **Nuovo Ordine** 📋
Ordina materiale nuovo:
1. **Compila il Modulo**:
   - Data Ordine (pre-compilata con la data odierna)
   - Fornitore (nome del fornitore)
   - Seleziona Prodotto dall'elenco
   - Quantità Ordinata
   - Prezzo Unitario (€) - opzionale
   - Data Prevista di Consegna - opzionale
   - Note aggiuntive

2. **Crea l'Ordine**: Clicca "Crea Ordine"

3. **Ordini Attivi**: 
   - Visualizza tutti gli ordini in sospeso
   - Clicca **"Segna come Ricevuto"** quando il materiale arriva (aggiorna automaticamente l'inventario)
   - Clicca **"Annulla Ordine"** per cancellare

#### **Storico Movimenti** 📊
Consulta il registro di tutte le operazioni:
1. **Filtri Disponibili**:
   - Filtra per data specifica
   - Filtra per tipo (Carico/Scarico)
2. **Reset**: Clicca per eliminare i filtri
3. **Visualizzazione**: Vedi data, ora, prodotto, tipo operazione, quantità e note

#### **Impostazioni** ⚙️
Configura le notifiche via email:
1. **Inserisci Email**: Dove riceverai gli avvisi
2. **Nome Mittente**: Es "Sistema Magazzino"
3. **Frequenza**: Scegli quanto spesso ricevere gli avvisi:
   - Ogni ora
   - Ogni 4 ore
   - Ogni 8 ore
   - Una volta al giorno
4. **Abilita Notifiche**: Spunta la checkbox per attivare
5. **Salva**: Clicca il pulsante
6. **Test**: Prova con il pulsante "Invia Email di Test"

**Setup Email:** Leggi [SETUP_EMAIL.md](file:///Users/ordine/Desktop/prova/SETUP_EMAIL.md) per istruzioni complete su come configurare EmailJS.

## 💾 Dati e Archiviazione

Tutti i dati sono salvati automaticamente nel browser:
- **Prodotti**: Elenco completo dell'inventario
- **Movimenti**: Storico di tutti i carichi/scarichi
- **Ordini**: Registro di tutti gli ordini effettuati

⚠️ **Importante**: I dati vengono salvati nel browser locale. Se cancelli i dati di navigazione, perderai tutto. Considera di fare backup periodici.

### Esportazione Dati (per browser avanzati)
Puoi accedere ai dati via console del browser:
1. Apri Console (F12 o Cmd+Option+I)
2. Digita:
   ```javascript
   console.log(localStorage)
   ```
3. Copia i dati per il backup

## ⚠️ Sistema di Notifiche

### Avvisi Automatici in App
- ✅ L'app controlla ogni 5 minuti se ci sono prodotti in esaurimento
- 🔔 Ricevi notifiche quando un prodotto scende sotto il 50% della soglia minima
- 📍 Il badge in alto mostrerà il numero di prodotti critici

### Notifiche Email
- ✅ L'app invia email automaticamente quando prodotti scendono sotto soglia
- 📧 Configura la frequenza degli avvisi (da ogni ora a ogni 24 ore)
- 🚫 Puoi disabilitare in qualsiasi momento dalle Impostazioni

### Gestire le Notifiche
- Le notifiche in app scompaiono automaticamente dopo 7 secondi
- Le email vengono inviate una volta raggiunta la frequenza impostata
- Puoi leggere il badge rosso in alto a destra
- Vai alla Dashboard per una vista completa degli avvisi

### Setup Email
Per ricevere notifiche via email, devi configurare EmailJS (gratuito):

1. **Quick Setup:**
   - Crea account su https://www.emailjs.com (gratuito)
   - Collega Gmail
   - Crea un template email
   - Copia Public Key e IDs
   - Aggiorna il file app.js
   - Abilita dalle Impostazioni

2. **Per dettagli completi:** Leggi [SETUP_EMAIL.md](file:///Users/ordine/Desktop/prova/SETUP_EMAIL.md)

## 🎯 Workflow Consigliato

### Mattina - Controllo Inventario
1. Vai alla **Dashboard**: Verifica gli avvisi
2. **Storico**: Controlla i movimenti della giornata precedente
3. **Inventario**: Rivedi i prodotti critici

### Durante la Giornata - Operazioni
1. **Scansione Barcode**: Registra carichi e scarichi in tempo reale
2. **Ordini**: Crea nuovi ordini quando necessario
3. **Inventario**: Modifica quantità in caso di discrepanze

### Fine Giornata - Controllo Finale
1. **Storico**: Verifica tutte le operazioni del giorno
2. **Dashboard**: Prendi nota dei prodotti in esaurimento per domani

## 🔧 Troubleshooting

### Il barcode non viene trovato
**Soluzione**: Vai a **Inventario** e verifica che:
- Il prodotto sia stato aggiunto al sistema
- Il barcode sia stato inserito esattamente come nella scansione
- Non ci siano spazi o caratteri aggiuntivi

### La quantità non si aggiorna
**Soluzione**: 
- Ricarica la pagina (Ctrl+R o Cmd+R)
- Verifica che il browser supporti localStorage
- Controlla che non sia in modalità privata/anonima

### Ho perso i dati
**Purtroppo**: Se hai cancellato i dati di navigazione, non è possibile recuperarli.
**Prevenzione**: Fai backup regolari esportando i dati dalla console

### Il lettore barcode non funziona
**Soluzioni**:
- Verifica che il lettore sia collegato correttamente
- Prova a digitare manualmente il barcode nel campo
- Assicurati che il campo barcode sia focalizzato (cursore visibile)

## 📱 Compatibilità

- ✅ Chrome, Edge, Firefox, Safari (versioni recenti)
- ✅ Tablets e dispositivi mobili
- ✅ Lettori barcode USB e Bluetooth
- ✅ Funziona offline (dati salvati localmente)

## 🎨 Personalizzazione Futura

Possibili miglioramenti:
- Integrazione con database cloud
- Esportazione dati in Excel/PDF
- Statistiche avanzate e grafici
- Sincronizzazione multi-dispositivo
- Accesso multi-utente con login
- API per integrazioni esterne

## 📞 Note Tecniche

- **Tecnologia**: HTML5, CSS3, JavaScript vanilla
- **Storage**: Browser LocalStorage
- **Nessuna dipendenza esterna**: Funziona completamente offline
- **Dimensione**: Leggera e veloce (~100KB)

---

**Versione**: 1.0
**Ultimo aggiornamento**: Aprile 2026
**Sviluppato per**: Gestione materiale ospedaliero
