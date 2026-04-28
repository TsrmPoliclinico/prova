# 📧 Configurazione Notifiche Email - SETUP EMAILJS

Questa guida spiega come configurare le notifiche email per il sistema di gestione ordinazioni ospedaliero.

## ⚙️ Prerequisiti

- Account gratuito su [EmailJS](https://www.emailjs.com)
- Un indirizzo email valido (mittente)
- 5 minuti per completare la configurazione

## 📋 Step-by-Step Setup

### 1️⃣ Registrati su EmailJS

1. Vai a https://www.emailjs.com
2. Clicca su "Sign Up Free"
3. Completa la registrazione con:
   - Email
   - Password
   - Nome

### 2️⃣ Aggiungi un Provider Email (Gmail)

1. Nel dashboard EmailJS, vai a **Email Services**
2. Clicca **"Add Service"**
3. Seleziona **Gmail** (o il provider che preferisci)
4. Clicca **"Connect Gmail Account"**
5. Segui le istruzioni per autorizzare EmailJS ad accedere al tuo account Gmail
6. Salva il service - **prendi nota del Service ID**

**Esempio di Service ID:** `service_abc123xyz`

### 3️⃣ Crea un Template Email

1. Nel dashboard EmailJS, vai a **Email Templates**
2. Clicca **"Create New Template"**
3. Compila i campi:

#### Mittente
```
From Email: {{from_email}} (opzionale)
From Name: {{from_name}}
Subject: {{subject}}
```

#### Corpo Email (HTML)
```html
<h2>🚨 {{subject}}</h2>

<p>Caro operatore,</p>

<p>{{message}}</p>

<h3>Dettagli Prodotti:</h3>
<pre>{{products_list}}</pre>

<p><strong>Data/Ora:</strong> {{timestamp}}</p>

<p>---<br/>
Sistema di Gestione Ordinazioni Ospedaliero<br/>
https://your-hospital.local/magazzino
</p>
```

#### Destinatario
```
To Email: {{to_email}}
```

4. Clicca **"Create Template"**
5. Prendi nota del **Template ID** (es: `template_abc123xyz`)

### 4️⃣ Ottieni la Public Key

1. Nel dashboard EmailJS, vai a **Integration** (o Account Settings)
2. Copia la **Public Key** (es: `aBcDeFg1h2i3J4k5l6m7n8o9`)

### 5️⃣ Aggiorna il Codice dell'App

Apri il file `app.js` e trova questa sezione:

```javascript
class EmailNotificationManager {
    static init() {
        // Inizializza EmailJS
        emailjs.init("YOUR_EMAILJS_PUBLIC_KEY");
```

**Sostituisci i valori:**

```javascript
static init() {
    emailjs.init("aBcDeFg1h2i3J4k5l6m7n8o9"); // Inserisci qui la tua Public Key
```

Poi trova questa riga:

```javascript
await emailjs.send(
    "YOUR_EMAILJS_SERVICE_ID",
    "YOUR_EMAILJS_TEMPLATE_ID",
    emailParams
);
```

**Sostituisci con i tuoi IDs:**

```javascript
await emailjs.send(
    "service_abc123xyz",           // Il tuo Service ID
    "template_abc123xyz",          // Il tuo Template ID
    emailParams
);
```

**Salva il file!**

### 6️⃣ Configura le Impostazioni nell'App

1. Apri il file `index.html` nel browser
2. Vai al tab **⚙️ Impostazioni**
3. Compila il form:
   - **Email per Ricevere Notifiche:** La tua email (dove riceverai gli avvisi)
   - **Nome Mittente:** Es "Sistema Magazzino Ospedale"
   - **Frequenza:** Ogni 24 ore (o come preferisci)
4. Spunta la checkbox **"✅ Abilita Notifiche Email"**
5. Clicca **"Salva Impostazioni Email"**

### 7️⃣ Test della Configurazione

1. Rimani nel tab **⚙️ Impostazioni**
2. Scorri fino a **🧪 Test Email**
3. Clicca il pulsante **"Invia Email di Test"**
4. Controlla la tua inbox - dovresti ricevere un'email di prova entro 30 secondi

✅ **Se ricevi l'email di test, la configurazione è corretta!**

## 🧪 Test Pratico

Per testare le notifiche automatiche:

1. Vai al tab **Inventario**
2. Modifica un prodotto per portare la quantità sotto la soglia minima
3. L'app controllerà ogni 5 minuti
4. Entro la frequenza impostata (es: 24 ore), riceverai un'email di avviso

**Nota:** Nel test, la frequenza potrebbe essere ignorata per il primo avviso.

## 📊 Come Funziona

### Timeline di una Notifica

1. **Controllo:** App verifica ogni 5 minuti
2. **Rilevamento:** Se un prodotto è sotto soglia
3. **Limite Frequenza:** Se sono passate X ore dall'ultimo avviso
4. **Invio:** Invia email con lista prodotti
5. **Registrazione:** Salva timestamp del movimento

### Esempio Email Ricevuta

```
Oggetto: 🚨 ALLARME MAGAZZINO - 2 prodotto(i) in esaurimento

Corpo:
Attenzione! I seguenti prodotti hanno raggiunto o superato la soglia minima di allarme:

- Guanti Nitrile Blu: 45/100 pezzi
- Disinfettante Mani: 20/30 flaconi
```

## ⚠️ Problemi Comuni

### 1. "EmailJS is not defined"
**Soluzione:** La libreria EmailJS non è stata caricata correttamente. Verifica che nel file `index.html` sia presente:
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
```

### 2. "Invalid Service ID"
**Soluzione:** Controlla di aver copiato correttamente il Service ID da EmailJS. Non deve contenere spazi.

### 3. "Invalid Template ID"
**Soluzione:** Verifica il Template ID. Deve essere lo stesso che hai creato nel dashboard EmailJS.

### 4. "Invalid Public Key"
**Soluzione:** Assicurati di aver copiato la PUBLIC KEY (non la Private Key) dal dashboard EmailJS.

### 5. "Email non ricevuta"
**Soluzioni:**
- Controlla la cartella SPAM della tua email
- Verifica che l'indirizzo email sia corretto (senza spazi)
- Controlla il limite di invii giornalieri di EmailJS (free tier: 200/giorno)
- Verifica che Gmail abbia autorizzato EmailJS

### 6. "CORS Error"
**Soluzione:** Usa solo l'URL locale (file://) o un hosting supportato. EmailJS funziona meglio con HTTPS.

## 🔐 Sicurezza

⚠️ **Importante:** La Public Key di EmailJS è visibile nel codice JavaScript. Questo è normale e sicuro:
- La Public Key può essere visualizzata (non è un segreto)
- Per inviare email è richiesta l'autenticazione del Service ID
- Gmail richiede autorizzazione esplicita

Per maggiore sicurezza:
1. Limita il dominio autorizzato nel dashboard EmailJS
2. Monitora gli invii dal dashboard
3. Usa una Gmail dedicata per il magazzino (non personale)

## 📱 Disabilitare le Notifiche

Per disabilitare temporaneamente le notifiche:

1. Vai al tab **⚙️ Impostazioni**
2. Spunta la checkbox per **disabilitare** le notifiche
3. Clicca **"Salva Impostazioni Email"**

Le notifiche rimarranno disattivate finché non le abiliti di nuovo.

## 📞 Supporto Adiconale

- [Documentazione EmailJS](https://www.emailjs.com/docs)
- [Template EmailJS](https://www.emailjs.com/docs/templates/)
- [Troubleshooting](https://www.emailjs.com/docs/faq/)

## ✅ Checklist Finale

- ✅ Account EmailJS creato
- ✅ Email Service (Gmail) configurato - Service ID salvato
- ✅ Template email creato - Template ID salvato
- ✅ Public Key copiata
- ✅ Codice app.js aggiornato con i tuoi IDs
- ✅ Impostazioni salvate nell'app
- ✅ Email di test ricevuta
- ✅ Notifiche abilitate

**Sei pronto!** La tua app ora invierà automaticamente email quando un prodotto scende sotto la soglia minima! 🚀

---

**Versione:** 1.0
**Ultimo aggiornamento:** Aprile 2026
**Sistema:** EmailJS
