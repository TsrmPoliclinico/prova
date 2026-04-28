// ============================================================================
// Hospital Material Management System
// ============================================================================

// Storage Keys
const STORAGE_KEYS = {
    PRODUCTS: 'hospital_products',
    MOVEMENTS: 'hospital_movements',
    ORDERS: 'hospital_orders',
    NOTIFICATIONS: 'hospital_notifications',
    EMAIL_SETTINGS: 'hospital_email_settings',
    LAST_EMAIL_SENT: 'hospital_last_email_sent'
};

// ============================================================================
// Data Management
// ============================================================================

class DataManager {
    static getProducts() {
        const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        return data ? JSON.parse(data) : [];
    }

    static saveProducts(products) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    }

    static getMovements() {
        const data = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
        return data ? JSON.parse(data) : [];
    }

    static saveMovements(movements) {
        localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(movements));
    }

    static getOrders() {
        const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
        return data ? JSON.parse(data) : [];
    }

    static saveOrders(orders) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    }

    static addProduct(product) {
        const products = this.getProducts();
        product.id = Date.now().toString();
        product.createdAt = new Date().toISOString();
        products.push(product);
        this.saveProducts(products);
        return product;
    }

    static updateProduct(id, updates) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updates };
            this.saveProducts(products);
            return products[index];
        }
        return null;
    }

    static deleteProduct(id) {
        const products = this.getProducts();
        const filtered = products.filter(p => p.id !== id);
        this.saveProducts(filtered);
    }

    static getProductByBarcode(barcode) {
        const products = this.getProducts();
        return products.find(p => p.barcode === barcode);
    }

    static getProductById(id) {
        const products = this.getProducts();
        return products.find(p => p.id === id);
    }

    static addMovement(movement) {
        const movements = this.getMovements();
        movement.id = Date.now().toString();
        movement.timestamp = new Date().toISOString();
        movements.push(movement);
        this.saveMovements(movements);
        return movement;
    }

    static addOrder(order) {
        const orders = this.getOrders();
        order.id = Date.now().toString();
        order.createdAt = new Date().toISOString();
        order.status = 'pending';
        orders.push(order);
        this.saveOrders(orders);
        return order;
    }

    static updateOrder(id, updates) {
        const orders = this.getOrders();
        const index = orders.findIndex(o => o.id === id);
        if (index !== -1) {
            orders[index] = { ...orders[index], ...updates };
            this.saveOrders(orders);
            return orders[index];
        }
        return null;
    }

    static getLowStockProducts() {
        const products = this.getProducts();
        return products.filter(p => p.quantity <= p.minThreshold);
    }

    static getMovementsByDate(date) {
        const movements = this.getMovements();
        const dateStr = date.toISOString().split('T')[0];
        return movements.filter(m => m.timestamp.split('T')[0] === dateStr);
    }

    static getEmailSettings() {
        const data = localStorage.getItem(STORAGE_KEYS.EMAIL_SETTINGS);
        return data ? JSON.parse(data) : {
            enabled: false,
            email: '',
            senderName: 'Sistema Gestione Magazzino',
            frequencyHours: 24
        };
    }

    static saveEmailSettings(settings) {
        localStorage.setItem(STORAGE_KEYS.EMAIL_SETTINGS, JSON.stringify(settings));
    }

    static getLastEmailSentTime() {
        const data = localStorage.getItem(STORAGE_KEYS.LAST_EMAIL_SENT);
        return data ? new Date(JSON.parse(data)) : null;
    }

    static setLastEmailSentTime(date) {
        localStorage.setItem(STORAGE_KEYS.LAST_EMAIL_SENT, JSON.stringify(date));
    }
}

// ============================================================================
// Notification System
// ============================================================================

class NotificationSystem {
    static show(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    static checkLowStock() {
        const lowStockProducts = DataManager.getLowStockProducts();
        if (lowStockProducts.length > 0) {
            const badge = document.getElementById('notificationBadge');
            badge.textContent = lowStockProducts.length;
            
            lowStockProducts.forEach(product => {
                const message = `⚠️ ${product.name} - Quantità: ${product.quantity} ${product.unit} (Soglia: ${product.minThreshold})`;
                // Only show notification if quantity is very low
                if (product.quantity <= product.minThreshold * 0.5) {
                    this.show(message, 'warning', 7000);
                }
            });
        }
    }

    static updateNotificationsBadge() {
        const lowStockProducts = DataManager.getLowStockProducts();
        const badge = document.getElementById('notificationBadge');
        badge.textContent = lowStockProducts.length;
    }
}

// ============================================================================
// Email Notification Manager
// ============================================================================

class EmailNotificationManager {
    static init() {
        // Inizializza EmailJS
        emailjs.init("RIfMF2p0khTxUzfmx");
        
        // Setup event listeners
        document.getElementById('emailSettingsForm').addEventListener('submit', (e) => this.handleSaveSettings(e));
        document.getElementById('testEmailBtn').addEventListener('click', () => this.sendTestEmail());
        
        // Carica e mostra lo stato
        this.updateStatusDisplay();
    }

    static handleSaveSettings(e) {
        e.preventDefault();

        const email = document.getElementById('emailAddress').value.trim();
        const enabled = document.getElementById('emailEnabled').checked;
        const senderName = document.getElementById('emailSender').value.trim();
        const frequencyHours = parseInt(document.getElementById('emailThreshold').value);

        if (!email) {
            NotificationSystem.show('❌ Inserisci un indirizzo email valido', 'error');
            return;
        }

        if (!this.isValidEmail(email)) {
            NotificationSystem.show('❌ Indirizzo email non valido', 'error');
            return;
        }

        // Salva le impostazioni
        const settings = {
            enabled,
            email,
            senderName,
            frequencyHours
        };

        DataManager.saveEmailSettings(settings);
        NotificationSystem.show('✅ Impostazioni email salvate con successo!', 'success');
        this.updateStatusDisplay();
    }

    static isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static updateStatusDisplay() {
        const settings = DataManager.getEmailSettings();
        const statusEl = document.getElementById('emailStatus');

        if (!settings.email) {
            statusEl.innerHTML = '<p class="placeholder">Nessuna configurazione salvata</p>';
            return;
        }

        const status = settings.enabled ? '✅ ATTIVO' : '❌ DISATTIVO';
        const lastSent = DataManager.getLastEmailSentTime();
        const lastSentText = lastSent ? new Date(lastSent).toLocaleString('it-IT') : 'Mai';

        statusEl.innerHTML = `
            <p><strong>Email Destinatario:</strong> ${settings.email}</p>
            <p><strong>Nome Mittente:</strong> ${settings.senderName}</p>
            <p><strong>Frequenza Notifiche:</strong> Ogni ${settings.frequencyHours} ore</p>
            <p><strong>Stato:</strong> ${status}</p>
            <p><strong>Ultimo Avviso Inviato:</strong> ${lastSentText}</p>
        `;
    }

    static async sendTestEmail() {
        const settings = DataManager.getEmailSettings();

        if (!settings.email) {
            NotificationSystem.show('❌ Configura prima l\'indirizzo email', 'error');
            return;
        }

        const lowStockProducts = DataManager.getLowStockProducts();

        const emailParams = {
            to_email: settings.email,
            from_name: settings.senderName,
            subject: '🏥 Test Email - Gestione Magazzino Ospedale',
            message: `Questo è un email di test del sistema di notifiche.\n\nProdotti in esaurimento: ${lowStockProducts.length}`,
            products_list: lowStockProducts.length > 0 ? 
                lowStockProducts.map(p => `- ${p.name}: ${p.quantity}/${p.minThreshold} ${p.unit}`).join('\n') :
                'Nessun prodotto in esaurimento'
        };

        try {
            const btn = document.getElementById('testEmailBtn');
            btn.disabled = true;
            btn.textContent = 'Invio in corso...';

            const response = await emailjs.send(
                "service_1o2k1bf",
                "template_3kp7utg",
                emailParams
            );

            if (response.status === 200) {
                UIManager.showMessage('testEmailResult', '✅ Email di test inviata con successo!', 'success');
                NotificationSystem.show('✅ Email di test inviata a ' + settings.email, 'success');
            }
        } catch (error) {
            console.error('Errore nell\'invio email:', error);
            UIManager.showMessage('testEmailResult', '❌ Errore nell\'invio email: ' + error.text, 'error');
            NotificationSystem.show('❌ Errore: ' + error.text, 'error');
        } finally {
            const btn = document.getElementById('testEmailBtn');
            btn.disabled = false;
            btn.textContent = 'Invia Email di Test';
        }
    }

    static async checkAndSendEmailNotifications() {
        const settings = DataManager.getEmailSettings();

        // Se le notifiche email sono disattivate, non fare nulla
        if (!settings.enabled || !settings.email) {
            return;
        }

        // Controlla se è passato abbastanza tempo dall'ultimo invio
        const lastSent = DataManager.getLastEmailSentTime();
        const now = new Date();
        const frequencyMs = settings.frequencyHours * 60 * 60 * 1000;

        if (lastSent && (now - lastSent) < frequencyMs) {
            return;
        }

        // Ottieni i prodotti in esaurimento
        const lowStockProducts = DataManager.getLowStockProducts();

        if (lowStockProducts.length === 0) {
            return;
        }

        // Prepara l'email
        const productsList = lowStockProducts
            .map(p => `- ${p.name}: ${p.quantity}/${p.minThreshold} ${p.unit}`)
            .join('\n');

        const emailParams = {
            to_email: settings.email,
            from_name: settings.senderName,
            subject: `🚨 ALLARME MAGAZZINO - ${lowStockProducts.length} prodotto(i) in esaurimento`,
            message: `Attenzione! I seguenti prodotti hanno raggiunto o superato la soglia minima di allarme:\n\n${productsList}`,
            products_list: productsList
        };

        try {
            await emailjs.send(
                "service_1o2k1bf",
                "template_3kp7utg",
                emailParams
            );

            DataManager.setLastEmailSentTime(now);
            console.log('Email di avviso inviata con successo');
        } catch (error) {
            console.error('Errore nell\'invio email di avviso:', error);
        }
    }
}

// ============================================================================
// UI Manager
// ============================================================================

class UIManager {
    static initTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.getAttribute('data-tab');
                this.showTab(tabName);
            });
        });
    }

    static showTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Remove active class from all buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab
        document.getElementById(tabName).classList.add('active');

        // Add active class to clicked button
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    }

    static showMessage(elementId, message, type = 'success') {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.className = `message show ${type}`;
            setTimeout(() => {
                element.classList.remove('show');
            }, 5000);
        }
    }

    static renderInventory() {
        const products = DataManager.getProducts();
        const container = document.getElementById('productsContainer');

        if (products.length === 0) {
            container.innerHTML = '<p class="placeholder">Nessun prodotto in magazzino</p>';
            return;
        }

        container.innerHTML = products.map(product => {
            const isLowStock = product.quantity <= product.minThreshold;
            const statusClass = isLowStock ? 'warning' : '';

            return `
                <div class="inventory-row ${statusClass}">
                    <div class="col">
                        <strong>${product.name}</strong>
                        <div class="inventory-subtitle">${product.company || 'Azienda non specificata'}</div>
                        ${isLowStock ? ' <span style="color: var(--warning-color);">⚠️ Basso Stock</span>' : ''}
                    </div>
                    <div class="col">${product.code}</div>
                    <div class="col"><strong>${product.quantity}</strong> ${product.unit}</div>
                    <div class="col">${product.minThreshold} ${product.unit}</div>
                    <div class="col">
                        <button class="btn btn-small btn-secondary" onclick="InventoryManager.editQuantity('${product.id}')">Modifica</button>
                        <button class="btn btn-small btn-danger" onclick="InventoryManager.deleteProduct('${product.id}')">Elimina</button>
                    </div>
                </div>
            `;
        }).join('');

        // Update order form product list
        this.updateOrderProductsList();
    }

    static renderLowStockAlert() {
        const lowStockProducts = DataManager.getLowStockProducts();
        const container = document.getElementById('lowStockList');

        if (lowStockProducts.length === 0) {
            container.innerHTML = '<p class="placeholder">Nessun prodotto in esaurimento</p>';
            return;
        }

        container.innerHTML = lowStockProducts.map(product => `
            <div class="product-card">
                <h4>${product.name}</h4>
                <p><strong>Codice:</strong> ${product.code}</p>
                <p><strong>Quantità:</strong> ${product.quantity} ${product.unit}</p>
                <p><strong>Soglia Minima:</strong> ${product.minThreshold} ${product.unit}</p>
                <p style="color: var(--danger-color); font-weight: bold;">⚠️ Prodotto in esaurimento!</p>
            </div>
        `).join('');
    }

    static renderAlerts() {
        const lowStockProducts = DataManager.getLowStockProducts();
        const container = document.getElementById('alertsList');

        if (lowStockProducts.length === 0) {
            container.innerHTML = '<p class="placeholder">Nessun avviso</p>';
            return;
        }

        container.innerHTML = lowStockProducts.map(product => `
            <div class="alert-item">
                <strong>⚠️ ${product.name}</strong>
                <div>Quantità: ${product.quantity} / Minimo: ${product.minThreshold}</div>
            </div>
        `).join('');
    }

    static renderDashboard() {
        const products = DataManager.getProducts();
        const lowStockProducts = DataManager.getLowStockProducts();
        const orders = DataManager.getOrders();
        const pendingOrders = orders.filter(o => o.status === 'pending').length;

        document.getElementById('totalProducts').textContent = products.length;
        document.getElementById('lowStockCount').textContent = lowStockProducts.length;
        document.getElementById('pendingOrders').textContent = pendingOrders;

        this.renderLowStockAlert();
        this.renderAlerts();
    }

    static renderRecentMovements() {
        const movements = DataManager.getMovements();
        const recent = movements.slice(-10).reverse();
        const container = document.getElementById('recentMovements');

        if (recent.length === 0) {
            container.innerHTML = '<p class="placeholder">Nessun movimento recente</p>';
            return;
        }

        container.innerHTML = recent.map(movement => {
            const date = new Date(movement.timestamp);
            const icon = movement.type === 'carico' ? '📥' : '📤';
            
            return `
                <div class="movement-item ${movement.type}">
                    <div class="movement-header">
                        <div>
                            <strong>${icon} ${movement.productName}</strong>
                        </div>
                        <span class="movement-time">${date.toLocaleString('it-IT')}</span>
                    </div>
                    <div>Quantità: <strong>${movement.quantity} ${movement.unit}</strong></div>
                    ${movement.note ? `<div>Note: ${movement.note}</div>` : ''}
                </div>
            `;
        }).join('');
    }

    static renderActiveOrders() {
        const orders = DataManager.getOrders();
        const activeOrders = orders.filter(o => o.status === 'pending');
        const container = document.getElementById('activeOrdersList');

        if (activeOrders.length === 0) {
            container.innerHTML = '<p class="placeholder">Nessun ordine attivo</p>';
            return;
        }

        container.innerHTML = activeOrders.map(order => {
            const total = (order.quantity * (order.unitPrice || 0)).toFixed(2);
            const date = new Date(order.createdAt).toLocaleDateString('it-IT');
            
            return `
                <div class="order-item pending">
                    <div class="order-header">
                        <div>
                            <strong>${order.productName}</strong>
                            <div style="font-size: 0.85rem; color: var(--text-secondary);">Ordine del ${date}</div>
                        </div>
                        <span class="order-status">In Sospeso</span>
                    </div>
                    <div class="order-details">
                        <div class="order-detail-item">
                            <strong>Quantità</strong>
                            ${order.quantity} ${order.unit}
                        </div>
                        <div class="order-detail-item">
                            <strong>Fornitore</strong>
                            ${order.supplier}
                        </div>
                        <div class="order-detail-item">
                            <strong>Prezzo Totale</strong>
                            €${total}
                        </div>
                        <div class="order-detail-item">
                            <strong>Consegna Prevista</strong>
                            ${order.deliveryDate || 'Non specificata'}
                        </div>
                    </div>
                    <div style="margin-top: 1rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
                        <button class="btn btn-primary btn-small" onclick="OrderManager.printOrder('${order.id}')">Stampa Ordine</button>
                        <button class="btn btn-success btn-small" onclick="OrderManager.markAsReceived('${order.id}')">Segna come Ricevuto</button>
                        <button class="btn btn-danger btn-small" onclick="OrderManager.cancelOrder('${order.id}')">Annulla Ordine</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    static updateOrderProductsList() {
        const products = DataManager.getProducts();
        const select = document.getElementById('orderProduct');
        const currentValue = select.value;

        select.innerHTML = '<option value="">Seleziona un prodotto...</option>' +
            products.map(p => `<option value="${p.id}">${p.name} (${p.code}) - ${p.quantity} ${p.unit}</option>`).join('');

        select.value = currentValue;
    }

    static renderHistory() {
        const movements = DataManager.getMovements();
        const container = document.getElementById('historyList');

        if (movements.length === 0) {
            container.innerHTML = '<p class="placeholder">Nessun movimento nel storico</p>';
            return;
        }

        const filtered = this.getFilteredMovements(movements);
        
        if (filtered.length === 0) {
            container.innerHTML = '<p class="placeholder">Nessun risultato corrispondente ai filtri</p>';
            return;
        }

        container.innerHTML = `
            <div class="table-header" style="grid-template-columns: repeat(6, 1fr);">
                <div>Data</div>
                <div>Ora</div>
                <div>Prodotto</div>
                <div>Tipo</div>
                <div>Quantità</div>
                <div>Note</div>
            </div>
            ${filtered.map(movement => {
                const date = new Date(movement.timestamp);
                return `
                    <div class="history-row">
                        <div>${date.toLocaleDateString('it-IT')}</div>
                        <div>${date.toLocaleTimeString('it-IT')}</div>
                        <div>${movement.productName}</div>
                        <div>${movement.type === 'carico' ? '📥 Carico' : '📤 Scarico'}</div>
                        <div><strong>${movement.quantity}</strong></div>
                        <div>${movement.note || '-'}</div>
                    </div>
                `;
            }).join('')}
        `;
    }

    static getFilteredMovements(movements) {
        const dateFilter = document.getElementById('filterDate').value;
        const typeFilter = document.getElementById('filterType').value;

        return movements.filter(m => {
            const movementDate = m.timestamp.split('T')[0];
            let matchesDate = true;
            let matchesType = true;

            if (dateFilter) {
                matchesDate = movementDate === dateFilter;
            }

            if (typeFilter) {
                matchesType = m.type === typeFilter;
            }

            return matchesDate && matchesType;
        });
    }
}

// ============================================================================
// Inventory Manager
// ============================================================================

class InventoryManager {
    static init() {
        document.getElementById('addProductForm').addEventListener('submit', (e) => this.handleAddProduct(e));
        document.getElementById('searchProduct').addEventListener('input', (e) => this.handleSearch(e));
        this.loadInitialData();
        UIManager.renderInventory();
    }

    static loadInitialData() {
        // Initialize with sample data if empty
        if (DataManager.getProducts().length === 0) {
            const sampleProducts = [
                { name: 'Mascherine Chirurgiche', code: 'MASC001', barcode: '8901234567890', company: 'Medica Italia', quantity: 250, minThreshold: 50, unit: 'pezzi' },
                { name: 'Guanti Nitrile Blu', code: 'GUAN001', barcode: '8901234567891', company: 'SafeHands', quantity: 45, minThreshold: 100, unit: 'pezzi' },
                { name: 'Disinfettante Mani', code: 'DISF001', barcode: '8901234567892', company: 'CleanCare', quantity: 80, minThreshold: 30, unit: 'flaconi' },
                { name: 'Garze Sterili 10x10', code: 'GARZ001', barcode: '8901234567893', company: 'SterilTec', quantity: 500, minThreshold: 100, unit: 'pezzi' },
            ];

            sampleProducts.forEach(p => DataManager.addProduct(p));
        }
    }

    static handleAddProduct(e) {
        e.preventDefault();

        const product = {
            name: document.getElementById('productName').value.trim(),
            code: document.getElementById('productCode').value.trim(),
            company: document.getElementById('productCompany').value.trim(),
            barcode: document.getElementById('productBarcode').value.trim(),
            quantity: parseInt(document.getElementById('productQuantity').value),
            minThreshold: parseInt(document.getElementById('productMinThreshold').value),
            unit: document.getElementById('productUnit').value
        };

        if (!product.name || !product.code || !product.company || !product.barcode) {
            NotificationSystem.show('Compila tutti i campi obbligatori', 'error');
            return;
        }

        // Check for duplicate barcode
        if (DataManager.getProductByBarcode(product.barcode)) {
            NotificationSystem.show('Un prodotto con questo barcode esiste già', 'error');
            return;
        }

        DataManager.addProduct(product);
        NotificationSystem.show('✅ Prodotto aggiunto con successo!', 'success');
        document.getElementById('addProductForm').reset();
        UIManager.renderInventory();
        UIManager.renderDashboard();
        NotificationSystem.updateNotificationsBadge();
    }

    static handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const products = DataManager.getProducts();
        const container = document.getElementById('productsContainer');

        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(searchTerm) ||
            p.code.toLowerCase().includes(searchTerm)
        );

        if (filtered.length === 0) {
            container.innerHTML = '<p class="placeholder">Nessun prodotto trovato</p>';
            return;
        }

        container.innerHTML = filtered.map(product => {
            const isLowStock = product.quantity <= product.minThreshold;
            const statusClass = isLowStock ? 'warning' : '';

            return `
                <div class="inventory-row ${statusClass}">
                    <div class="col">
                        <strong>${product.name}</strong>
                        ${isLowStock ? ' <span style="color: var(--warning-color);">⚠️ Basso Stock</span>' : ''}
                    </div>
                    <div class="col">${product.code}</div>
                    <div class="col"><strong>${product.quantity}</strong> ${product.unit}</div>
                    <div class="col">${product.minThreshold} ${product.unit}</div>
                    <div class="col">
                        <button class="btn btn-small btn-secondary" onclick="InventoryManager.editQuantity('${product.id}')">Modifica</button>
                        <button class="btn btn-small btn-danger" onclick="InventoryManager.deleteProduct('${product.id}')">Elimina</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    static editQuantity(productId) {
        const product = DataManager.getProductById(productId);
        if (!product) return;

        const newQuantity = prompt(
            `Modifica quantità di "${product.name}"\nQuantità attuale: ${product.quantity}\n\nNuova quantità:`,
            product.quantity
        );

        if (newQuantity !== null && newQuantity !== '') {
            const quantity = parseInt(newQuantity);
            if (isNaN(quantity) || quantity < 0) {
                NotificationSystem.show('Inserisci una quantità valida', 'error');
                return;
            }

            const oldQuantity = product.quantity;
            DataManager.updateProduct(productId, { quantity });
            
            // Record movement
            const movement = {
                productId,
                productName: product.name,
                unit: product.unit,
                type: quantity > oldQuantity ? 'carico' : 'scarico',
                quantity: Math.abs(quantity - oldQuantity),
                note: 'Modifica manuale quantità'
            };
            DataManager.addMovement(movement);

            NotificationSystem.show('✅ Quantità aggiornata!', 'success');
            UIManager.renderInventory();
            UIManager.renderDashboard();
            UIManager.renderRecentMovements();
            NotificationSystem.updateNotificationsBadge();
        }
    }

    static deleteProduct(productId) {
        const product = DataManager.getProductById(productId);
        if (!product) return;

        if (confirm(`Sei sicuro di voler eliminare "${product.name}"?`)) {
            DataManager.deleteProduct(productId);
            NotificationSystem.show('✅ Prodotto eliminato!', 'success');
            UIManager.renderInventory();
            UIManager.renderDashboard();
        }
    }
}

// ============================================================================
// Barcode Manager
// ============================================================================

class BarcodeManager {
    static init() {
        const barcodeInput = document.getElementById('barcodeInput');
        barcodeInput.addEventListener('keypress', (e) => this.handleBarcodeScan(e));
        
        document.getElementById('confirmOperation').addEventListener('click', () => this.confirmOperation());
        document.getElementById('cancelOperation').addEventListener('click', () => this.cancelOperation());
    }

    static handleBarcodeScan(e) {
        if (e.key !== 'Enter') return;

        const barcode = e.target.value.trim();
        if (!barcode) return;

        const product = DataManager.getProductByBarcode(barcode);
        if (!product) {
            NotificationSystem.show('❌ Prodotto non trovato. Verifica il barcode.', 'error');
            e.target.value = '';
            return;
        }

        this.displayScannedProduct(product);
        e.target.value = '';
    }

    static displayScannedProduct(product) {
        const panel = document.getElementById('scannedProduct');
        document.getElementById('scannedName').textContent = product.name;
        document.getElementById('scannedCode').textContent = product.code;
        document.getElementById('scannedBarcode').textContent = product.barcode;
        document.getElementById('scannedQuantity').textContent = `${product.quantity} ${product.unit}`;
        document.getElementById('scannedUnit').textContent = product.unit;
        document.getElementById('quantityChange').value = 1;
        document.getElementById('operationType').value = 'carico';
        document.getElementById('operationNote').value = '';

        // Store current product for operation
        window.currentScannedProduct = product;

        panel.classList.remove('hidden');
        document.getElementById('operationResult').classList.add('hidden');
    }

    static confirmOperation() {
        const product = window.currentScannedProduct;
        if (!product) return;

        const quantity = parseInt(document.getElementById('quantityChange').value);
        const operationType = document.getElementById('operationType').value;
        const note = document.getElementById('operationNote').value.trim();

        if (isNaN(quantity) || quantity <= 0) {
            NotificationSystem.show('Inserisci una quantità valida', 'error');
            return;
        }

        // Calculate new quantity
        let newQuantity = product.quantity;
        if (operationType === 'carico') {
            newQuantity += quantity;
        } else {
            if (product.quantity < quantity) {
                NotificationSystem.show(
                    `❌ Quantità insufficiente. Disponibile: ${product.quantity}`,
                    'error'
                );
                return;
            }
            newQuantity -= quantity;
        }

        // Update product
        DataManager.updateProduct(product.id, { quantity: newQuantity });

        // Record movement
        const movement = {
            productId: product.id,
            productName: product.name,
            unit: product.unit,
            type: operationType,
            quantity,
            note: note || (operationType === 'carico' ? 'Carico da fornitore' : 'Scarico')
        };
        DataManager.addMovement(movement);

        // Show success message
        const resultMsg = operationType === 'carico' ? '📥 Carico' : '📤 Scarico';
        const icon = operationType === 'carico' ? '✅' : '✅';
        this.showOperationResult(
            `${icon} ${resultMsg} completato! ${product.name}: ${quantity} ${product.unit}`,
            'success'
        );

        // Update UI
        UIManager.renderDashboard();
        UIManager.renderRecentMovements();
        NotificationSystem.updateNotificationsBadge();
        NotificationSystem.checkLowStock();

        // Clear panel after 2 seconds
        setTimeout(() => {
            this.clearScannedProduct();
        }, 2000);
    }

    static showOperationResult(message, type) {
        const resultEl = document.getElementById('operationResult');
        resultEl.textContent = message;
        resultEl.className = `message show ${type}`;
    }

    static cancelOperation() {
        this.clearScannedProduct();
    }

    static clearScannedProduct() {
        document.getElementById('scannedProduct').classList.add('hidden');
        window.currentScannedProduct = null;
        document.getElementById('barcodeInput').focus();
    }
}

// ============================================================================
// Order Manager
// ============================================================================

class OrderManager {
    static init() {
        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('orderDate').value = today;

        document.getElementById('orderForm').addEventListener('submit', (e) => this.handleCreateOrder(e));
        UIManager.updateOrderProductsList();
        this.renderOrders();
    }

    static handleCreateOrder(e) {
        e.preventDefault();

        const productId = document.getElementById('orderProduct').value;
        const product = DataManager.getProductById(productId);

        if (!product) {
            NotificationSystem.show('Seleziona un prodotto valido', 'error');
            return;
        }

        const order = {
            productId,
            productName: product.name,
            unit: product.unit,
            quantity: parseInt(document.getElementById('orderQuantity').value),
            supplier: document.getElementById('orderSupplier').value.trim(),
            unitPrice: parseFloat(document.getElementById('orderUnitPrice').value) || 0,
            orderDate: document.getElementById('orderDate').value,
            deliveryDate: document.getElementById('orderDeliveryDate').value,
            notes: document.getElementById('orderNotes').value.trim()
        };

        if (!order.supplier || order.quantity <= 0) {
            NotificationSystem.show('Compila tutti i campi obbligatori', 'error');
            return;
        }

        DataManager.addOrder(order);
        NotificationSystem.show('✅ Ordine creato con successo!', 'success');
        
        document.getElementById('orderForm').reset();
        document.getElementById('orderDate').value = new Date().toISOString().split('T')[0];
        
        this.renderOrders();
        UIManager.renderDashboard();
    }

    static renderOrders() {
        UIManager.renderActiveOrders();
    }

    static markAsReceived(orderId) {
        const order = DataManager.updateOrder(orderId, { status: 'received' });
        if (!order) return;

        // Update product quantity
        const product = DataManager.getProductById(order.productId);
        if (product) {
            const newQuantity = product.quantity + order.quantity;
            DataManager.updateProduct(product.id, { quantity: newQuantity });

            // Record movement
            const movement = {
                productId: product.id,
                productName: product.name,
                unit: product.unit,
                type: 'carico',
                quantity: order.quantity,
                note: `Ricevimento ordine da ${order.supplier}`
            };
            DataManager.addMovement(movement);
        }

        NotificationSystem.show('✅ Ordine ricevuto e inventario aggiornato!', 'success');
        this.renderOrders();
        UIManager.renderInventory();
        UIManager.renderDashboard();
        UIManager.renderRecentMovements();
        NotificationSystem.updateNotificationsBadge();
    }

    static cancelOrder(orderId) {
        if (confirm('Sei sicuro di voler annullare questo ordine?')) {
            DataManager.updateOrder(orderId, { status: 'cancelled' });
            NotificationSystem.show('✅ Ordine annullato', 'success');
            this.renderOrders();
            UIManager.renderDashboard();
        }
    }

    static printOrder(orderId) {
        const order = DataManager.getOrders().find(o => o.id === orderId);
        if (!order) {
            NotificationSystem.show('Ordine non trovato', 'error');
            return;
        }

        const total = (order.quantity * (order.unitPrice || 0)).toFixed(2);
        const printContainer = document.getElementById('printOrderContainer');
        printContainer.innerHTML = `
            <div class="print-area">
                <div class="print-header">
                    <img src="logo.svc.png" alt="Logo Radiologia" class="print-logo">
                    <div>
                        <h1>Ordine #${order.id}</h1>
                        <p class="print-subtitle">Gestione Ordini e Magazzino Radiologia</p>
                    </div>
                </div>
                <div class="print-meta">
                    <div><strong>Data ordine:</strong> ${new Date(order.createdAt).toLocaleDateString('it-IT')}</div>
                    <div><strong>Stato:</strong> In sospeso</div>
                </div>
                <table class="print-table">
                    <tr><th>Prodotto</th><td>${order.productName}</td></tr>
                    <tr><th>Quantità</th><td>${order.quantity} ${order.unit}</td></tr>
                    <tr><th>Fornitore</th><td>${order.supplier}</td></tr>
                    <tr><th>Prezzo unitario</th><td>€${order.unitPrice.toFixed(2)}</td></tr>
                    <tr><th>Totale</th><td>€${total}</td></tr>
                    <tr><th>Consegna prevista</th><td>${order.deliveryDate || 'Non specificata'}</td></tr>
                    <tr><th>Note</th><td>${order.notes || 'Nessuna'}</td></tr>
                </table>
            </div>
        `;

        window.print();

        setTimeout(() => {
            printContainer.innerHTML = '';
        }, 1000);
    }
}

// ============================================================================
// History Manager
// ============================================================================

class HistoryManager {
    static init() {
        document.getElementById('filterDate').addEventListener('change', () => this.applyFilters());
        document.getElementById('filterType').addEventListener('change', () => this.applyFilters());
        document.getElementById('resetFilters').addEventListener('click', () => this.resetFilters());
        this.renderHistory();
    }

    static renderHistory() {
        UIManager.renderHistory();
    }

    static applyFilters() {
        this.renderHistory();
    }

    static resetFilters() {
        document.getElementById('filterDate').value = '';
        document.getElementById('filterType').value = '';
        this.renderHistory();
    }
}

// ============================================================================
// Main App Initialization
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    UIManager.initTabs();
    InventoryManager.init();
    BarcodeManager.init();
    OrderManager.init();
    HistoryManager.init();
    EmailNotificationManager.init();

    // Initial dashboard rendering
    UIManager.renderDashboard();
    UIManager.renderRecentMovements();

    // Check for low stock on load
    NotificationSystem.updateNotificationsBadge();
    NotificationSystem.checkLowStock();

    // Periodic checks
    setInterval(() => {
        NotificationSystem.checkLowStock();
        EmailNotificationManager.checkAndSendEmailNotifications();
    }, 5 * 60 * 1000); // Check every 5 minutes

    // Show welcome notification
    NotificationSystem.show('🏥 Sistema di gestione ordinazioni avviato con successo!', 'success', 4000);
});

// Prevent accidental data loss
window.addEventListener('beforeunload', (e) => {
    // Only show warning if there's unsaved form data
    const forms = document.querySelectorAll('form');
    let hasUnsubmittedData = false;

    forms.forEach(form => {
        if (form.querySelector('input:not([type="hidden"]):not([type="submit"])')?.value) {
            hasUnsubmittedData = true;
        }
    });

    if (hasUnsubmittedData) {
        e.preventDefault();
        e.returnValue = '';
    }
});
