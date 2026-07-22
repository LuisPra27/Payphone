// 1. Nuestra "Base de datos"
const inventario = [
    { id: 1, nombre: "Laptop HP Victus", icono: "💻", baseCents: 0, gravadoCents: 80000, ivaCents: 12000, totalCents: 92000 },
    { id: 2, nombre: "PlayStation 4", icono: "🎮", baseCents: 0, gravadoCents: 50000, ivaCents: 7500, totalCents: 57500 },
    { id: 3, nombre: "Juego: Helldivers 2", icono: "💿", baseCents: 0, gravadoCents: 4000, ivaCents: 600, totalCents: 4600 },
    { id: 4, nombre: "Monitor Gamer 144Hz", icono: "🖥️", baseCents: 0, gravadoCents: 20000, ivaCents: 3000, totalCents: 23000 },
    { id: 5, nombre: "Juego: EA SPORTS FC 26", icono: "⚽", baseCents: 0, gravadoCents: 7000, ivaCents: 1050, totalCents: 8050 },
    { id: 6, nombre: "Juego: Red Dead Redemption 2", icono: "🤠", baseCents: 0, gravadoCents: 3000, ivaCents: 450, totalCents: 3450 },
    { id: 7, nombre: "Juego: No Man's Sky", icono: "🚀", baseCents: 0, gravadoCents: 4000, ivaCents: 600, totalCents: 4600 },
    { id: 8, nombre: "PlayStation Plus (12 Meses)", icono: "➕", baseCents: 0, gravadoCents: 8000, ivaCents: 1200, totalCents: 9200 },
    { id: 9, nombre: "Teclado Mecánico RGB", icono: "⌨️", baseCents: 0, gravadoCents: 6000, ivaCents: 900, totalCents: 6900 },
    { id: 10, nombre: "Mouse Inalámbrico", icono: "🖱️", baseCents: 0, gravadoCents: 4000, ivaCents: 600, totalCents: 4600 }
];

// 2. Estado del carrito
let carrito = [];

// 3. Inicializar la página
window.addEventListener('DOMContentLoaded', () => {
    renderizarCatalogo();
});

// 4. Dibujar los productos en la cuadrícula
function renderizarCatalogo() {
    const contenedor = document.getElementById('catalogo-productos');
    inventario.forEach(producto => {
        const precioDolares = (producto.totalCents / 100).toFixed(2);
        
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-icon">${producto.icono}</div>
            <h3>${producto.nombre}</h3>
            <div class="product-price">$${precioDolares}</div>
            <button class="btn-add" onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
        `;
        contenedor.appendChild(card);
    });
}

// 5. Lógica para agregar productos
function agregarAlCarrito(idProducto) {
    const producto = inventario.find(p => p.id === idProducto);
    carrito.push(producto);
    actualizarInterfazCarrito();
}

//* 6. Recalcular todo y actualizar la pantalla
function actualizarInterfazCarrito() {
    const contenedorLista = document.getElementById('lista-carrito');
    
    // Si el carrito está vacío
    if (carrito.length === 0) {
        contenedorLista.innerHTML = '<div class="empty-cart">Tu carrito está vacío</div>';
        document.getElementById('pp-button').innerHTML = ''; 
        // Reiniciar los textos a cero
        document.getElementById('res-base').innerText = '$0.00';
        document.getElementById('res-gravado').innerText = '$0.00';
        document.getElementById('res-iva').innerText = '$0.00';
        document.getElementById('res-total').innerText = '$0.00';
        return;
    }

    // Limpiar lista actual
    contenedorLista.innerHTML = '';

    const { sumaBase, sumaGravado, sumaIva, sumaTotal } = calcularTotales(carrito);

    // Recorrer carrito
    carrito.forEach((item, index) => {
        // Agregar a la lista visual con el botón de eliminar
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="item-details">
                <span>${item.nombre}</span>
                <span class="item-price">$${(item.totalCents / 100).toFixed(2)}</span>
            </div>
            <button class="btn-remove" onclick="eliminarDelCarrito(${index})" title="Quitar producto">❌</button>
        `;
        contenedorLista.appendChild(div);
    });

    // Actualizar textos de resumen
    document.getElementById('res-base').innerText = `$${(sumaBase / 100).toFixed(2)}`;
    document.getElementById('res-gravado').innerText = `$${(sumaGravado / 100).toFixed(2)}`;
    document.getElementById('res-iva').innerText = `$${(sumaIva / 100).toFixed(2)}`;
    document.getElementById('res-total').innerText = `$${(sumaTotal / 100).toFixed(2)}`;

    // Generar nuevo botón de Payphone
    renderizarBotonPayphone(sumaTotal, sumaBase, sumaGravado, sumaIva);
}

//* 7. Lógica para quitar productos
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarInterfazCarrito();
}

//* 8. El motor de pagos dinámico
function renderizarBotonPayphone(total, base, gravado, iva) {    const contenedorBoton = document.getElementById('pp-button');
    contenedorBoton.innerHTML = '';

    const transactionIdDinamico = 'FACT-' + Date.now();

    new PPaymentButtonBox({
        token: 'MH6_LOtu5OI4o4qmPxT70VGVeeT181uPdbeb4oIFBDlkzKckD7p6s0TMc4a-F5EIU3_aE7rmbhn2SnBb4mt0qvGGkJBpvTpSEvHdoStJgnusCLrMB3JTXXknaVwfGbue8FJYWp2hSyImwHODeDxGnDjq63Lsmn7Op0VSBBtR5sua81v15wj1mZ6PDvv9gLfNOCZBcPVKqXVLYHkwLn5UzMWUP6Hl-KQ2UMFEND4ogzFShWxrikoDSBqvbCcq6yfetBwODnLiF7dPatPC5Mf-lTYCD-y85tSSjIZcp-UwUXFChJB2ozAWp4CuCrJU0nBfaqriCcaCi5Fq0j97_oBiCY-IiyU',
        clientTransactionId: transactionIdDinamico, 
        amount: total,            
        amountWithoutTax: base,  
        amountWithTax: gravado,     
        tax: iva,                
        service: 0, tip: 0, currency: "USD",    
        storeId: "02908629-8bfa-4f30-a3ea-4811490881d1", 
        reference: "Compra de tecnología - Tienda Principal",        
        lang: "es", defaultMethod: "card", timeZone: -5,   
        lat: "-1.831239", lng: "-78.183406",  
        phoneNumber: "+593999999999", email: "aloy@mail.com", documentId: "1234567890", identificationType: 1
    }).render('pp-button');
}