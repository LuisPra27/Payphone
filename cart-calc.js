function calcularTotales(carrito) {
    let sumaBase = 0;
    let sumaGravado = 0;
    let sumaIva = 0;
    let sumaTotal = 0;

    carrito.forEach((item) => {
        sumaBase += item.baseCents;
        sumaGravado += item.gravadoCents;
        sumaIva += item.ivaCents;
        sumaTotal += item.totalCents;
    });

    return { sumaBase, sumaGravado, sumaIva, sumaTotal };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calcularTotales };
}
