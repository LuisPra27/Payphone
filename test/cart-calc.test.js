const test = require('node:test');
const assert = require('node:assert');
const { calcularTotales } = require('../cart-calc.js');

test('carrito vacio retorna todos los totales en cero', () => {
    const resultado = calcularTotales([]);
    assert.strictEqual(resultado.sumaBase, 0);
    assert.strictEqual(resultado.sumaGravado, 0);
    assert.strictEqual(resultado.sumaIva, 0);
    assert.strictEqual(resultado.sumaTotal, 0);
});

test('suma correctamente un solo producto', () => {
    const carrito = [
        { baseCents: 0, gravadoCents: 80000, ivaCents: 12000, totalCents: 92000 },
    ];
    const resultado = calcularTotales(carrito);
    assert.strictEqual(resultado.sumaGravado, 80000);
    assert.strictEqual(resultado.sumaIva, 12000);
    assert.strictEqual(resultado.sumaTotal, 92000);
});

test('suma correctamente varios productos', () => {
    const carrito = [
        { baseCents: 0, gravadoCents: 80000, ivaCents: 12000, totalCents: 92000 },
        { baseCents: 0, gravadoCents: 50000, ivaCents: 7500, totalCents: 57500 },
        { baseCents: 0, gravadoCents: 4000, ivaCents: 600, totalCents: 4600 },
    ];
    const resultado = calcularTotales(carrito);
    assert.strictEqual(resultado.sumaGravado, 134000);
    assert.strictEqual(resultado.sumaIva, 20100);
    assert.strictEqual(resultado.sumaTotal, 154100);
});

test('el IVA calculado corresponde al 15% del monto gravado', () => {
    const carrito = [
        { baseCents: 0, gravadoCents: 20000, ivaCents: 3000, totalCents: 23000 },
    ];
    const resultado = calcularTotales(carrito);
    assert.strictEqual(resultado.sumaIva, Math.round(resultado.sumaGravado * 0.15));
});
