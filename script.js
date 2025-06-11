document.addEventListener('DOMContentLoaded', () => {
    const addCustomerBtn = document.getElementById('add-customer-btn');
    const searchCustomersBtn = document.getElementById('search-customers-btn');
    const manageCustomersBtn = document.getElementById('manage-customers-btn');

    const addCustomerSection = document.getElementById('add-customer-section');
    const searchCustomersSection = document.getElementById('search-customers-section');
    const manageCustomersSection = document.getElementById('manage-customers-section');

    const saveCustomerBtn = document.getElementById('save-customer-btn');
    const cancelAddBtn = document.getElementById('cancel-add-btn');
    const performSearchBtn = document.getElementById('perform-search-btn');
    const searchResultsDiv = document.getElementById('search-results');
    const cancelSearchBtn = document.getElementById('cancel-search-btn');
    const customerListDiv = document.getElementById('customer-list');
    const cancelManageBtn = document.getElementById('cancel-manage-btn');

    // Elementi del modal di modifica
    const editCustomerModal = document.getElementById('edit-customer-modal');
    const closeEditModalBtn = editCustomerModal.querySelector('.close-button');
    const editNameInput = document.getElementById('edit-name');
    const editPhoneInput = document.getElementById('edit-phone');
    const editStreetInput = document.getElementById('edit-street');
    const editCountryInput = document.getElementById('edit-country');
    const editDirectionsInput = document.getElementById('edit-directions');
    const updateCustomerBtn = document.getElementById('update-customer-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');

    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    let currentEditingCustomerId = null; // Terrà traccia dell'ID del cliente che stiamo modificando

    function showSection(section) {
        addCustomerSection.classList.add('hidden');
        searchCustomersSection.classList.add('hidden');
        manageCustomersSection.classList.add('hidden');
        // Nascondi il modal se è aperto quando cambi sezione
        editCustomerModal.classList.add('hidden');

        if (section) {
            section.classList.remove('hidden');
        }
    }

    addCustomerBtn.addEventListener('click', () => showSection(addCustomerSection));
    searchCustomersBtn.addEventListener('click', () => showSection(searchCustomersSection));
    manageCustomersBtn.addEventListener('click', () => {
        displayCustomers(); // Ricarica la lista dei clienti ogni volta che entri in questa sezione
        showSection(manageCustomersSection);
    });

    cancelAddBtn.addEventListener('click', () => showSection(null));
    cancelSearchBtn.addEventListener('click', () => showSection(null));
    cancelManageBtn.addEventListener('click', () => showSection(null));

    // Funzione per generare un ID univoco (timestamp)
    function generateUniqueId() {
        return Date.now().toString();
    }

    saveCustomerBtn.addEventListener('click', () => {
        const name = document.getElementById('name').value.trim(); // .trim() per rimuovere spazi bianchi
        const phone = document.getElementById('phone').value.trim();
        const street = document.getElementById('street').value.trim();
        const country = document.getElementById('country').value.trim();
        const directions = document.getElementById('directions').value.trim();

        if (name && street) {
            const newCustomer = {
                id: generateUniqueId(), // Aggiungi un ID unico
                name,
                phone,
                street,
                country,
                directions
            };
            customers.push(newCustomer);
            localStorage.setItem('customers', JSON.stringify(customers));
            alert('Cliente salvato!');
            // Resetta i campi del form
            document.getElementById('name').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('street').value = '';
            document.getElementById('country').value = '';
            document.getElementById('directions').value = '';

            showSection(null);
        } else {
            alert('Nome e Via sono obbligatori.');
        }
    });

    performSearchBtn.addEventListener('click', () => {
        const searchTerm = document.getElementById('search-street').value.toLowerCase().trim();
        const results = customers.filter(customer => customer.street.toLowerCase().includes(searchTerm));
        displaySearchResults(results);
    });

    function displaySearchResults(results) {
        searchResultsDiv.innerHTML = '';
        if (results.length === 0) {
            searchResultsDiv.textContent = 'Nessun cliente trovato con questa via.';
        } else {
            results.forEach(customer => {
                const customerDiv = document.createElement('div');
                customerDiv.classList.add('customer-info');
                customerDiv.innerHTML = `
                    <h3>${customer.name}</h3>
                    <p>Via: ${customer.street}</p>
                    <p>Paese: ${customer.country || 'N.D.'}</p>
                    <p>Indicazioni: ${customer.directions || 'N.D.'}</p>
                    <p>Telefono: ${customer.phone || 'N.D.'}</p>
                `;
                searchResultsDiv.appendChild(customerDiv);
            });
        }
    }

    function displayCustomers() {
        customerListDiv.innerHTML = '';
        if (customers.length === 0) {
            customerListDiv.textContent = 'Nessun cliente salvato.';
        } else {
            customers.forEach(customer => {
                const customerDiv = document.createElement('div');
                customerDiv.classList.add('customer-info');
                // Ho aggiunto data-id per identificare il cliente specifico
                customerDiv.innerHTML = `
                    <h3>${customer.name}</h3>
                    <p>Via: ${customer.street}</p>
                    <p>Telefono: ${customer.phone || 'N.D.'}</p>
                    <button class="edit-btn" data-id="${customer.id}">Modifica</button>
                    <button class="delete-btn" data-id="${customer.id}">Elimina</button>
                `;
                customerListDiv.appendChild(customerDiv);
            });
        }
    }

    // Aggiungi event listener per i pulsanti Modifica ed Elimina (delegazione eventi)
    // Questo è più efficiente perché aggiungi l'event listener al genitore
    // e poi controlli quale pulsante è stato cliccato
    customerListDiv.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-btn')) {
            const customerId = event.target.dataset.id;
            openEditModal(customerId);
        } else if (event.target.classList.contains('delete-btn')) {
            const customerId = event.target.dataset.id;
            deleteCustomer(customerId);
        }
    });

    // Funzione per aprire il modal di modifica
    function openEditModal(customerId) {
        currentEditingCustomerId = customerId;
        const customerToEdit = customers.find(c => c.id === customerId);

        if (customerToEdit) {
            editNameInput.value = customerToEdit.name;
            editPhoneInput.value = customerToEdit.phone;
            editStreetInput.value = customerToEdit.street;
            editCountryInput.value = customerToEdit.country;
            editDirectionsInput.value = customerToEdit.directions;

            editCustomerModal.classList.remove('hidden'); // Mostra il modal
        }
    }

    // Funzione per chiudere il modal di modifica
    closeEditModalBtn.addEventListener('click', () => {
        editCustomerModal.classList.add('hidden');
    });

    cancelEditBtn.addEventListener('click', () => {
        editCustomerModal.classList.add('hidden');
    });

    // Clic fuori dal modal per chiuderlo
    window.addEventListener('click', (event) => {
        if (event.target === editCustomerModal) {
            editCustomerModal.classList.add('hidden');
        }
    });

    // Funzione per salvare le modifiche del cliente
    updateCustomerBtn.addEventListener('click', () => {
        if (currentEditingCustomerId) {
            const index = customers.findIndex(c => c.id === currentEditingCustomerId);

            if (index !== -1) {
                const updatedName = editNameInput.value.trim();
                const updatedStreet = editStreetInput.value.trim();

                if (updatedName && updatedStreet) {
                    customers[index] = {
                        id: currentEditingCustomerId, // Mantiene l'ID originale
                        name: updatedName,
                        phone: editPhoneInput.value.trim(),
                        street: updatedStreet,
                        country: editCountryInput.value.trim(),
                        directions: editDirectionsInput.value.trim()
                    };
                    localStorage.setItem('customers', JSON.stringify(customers));
                    alert('Cliente modificato con successo!');
                    editCustomerModal.classList.add('hidden'); // Nascondi il modal
                    displayCustomers(); // Aggiorna la lista
                } else {
                    alert('Nome e Via sono obbligatori per la modifica.');
                }
            }
        }
    });

    // Funzione per eliminare un cliente
    function deleteCustomer(customerId) {
        if (confirm('Sei sicuro di voler eliminare questo cliente? Questa operazione non può essere annullata.')) {
            customers = customers.filter(c => c.id !== customerId);
            localStorage.setItem('customers', JSON.stringify(customers));
            alert('Cliente eliminato con successo!');
            displayCustomers(); // Aggiorna la lista
        }
    }

    // Inizializza la visualizzazione se necessario (anche se `manageCustomersBtn` lo fa già)
    // displayCustomers(); // Puoi chiamarlo qui se vuoi mostrare i clienti all'avvio
});

