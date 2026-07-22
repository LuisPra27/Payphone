const { calcularTotales } = require('../cart-calc.js');

describe('Calculo de totales del carrito', () => {
    it('Carrito vacio retorna todos los totales en cero', () => {
        const resultado = calcularTotales([]);
        expect(resultado.sumaBase).toBe(0);
        expect(resultado.sumaGravado).toBe(0);
        expect(resultado.sumaIva).toBe(0);
        expect(resultado.sumaTotal).toBe(0);
    });

    it('Suma correctamente un solo producto', () => {
        const carrito = [
            { baseCents: 0, gravadoCents: 80000, ivaCents: 12000, totalCents: 92000 },
        ];
        const resultado = calcularTotales(carrito);
        expect(resultado.sumaGravado).toBe(80000);
        expect(resultado.sumaIva).toBe(12000);
        expect(resultado.sumaTotal).toBe(92000);
    });

    it('Suma correctamente varios productos', () => {
        const carrito = [
            { baseCents: 0, gravadoCents: 80000, ivaCents: 12000, totalCents: 92000 },
            { baseCents: 0, gravadoCents: 50000, ivaCents: 7500, totalCents: 57500 },
            { baseCents: 0, gravadoCents: 4000, ivaCents: 600, totalCents: 4600 },
        ];
        const resultado = calcularTotales(carrito);
        expect(resultado.sumaGravado).toBe(134000);
        expect(resultado.sumaIva).toBe(20100);
        expect(resultado.sumaTotal).toBe(154100);
    });

    it('El IVA calculado corresponde al 15% del monto gravado', () => {
        const carrito = [
            { baseCents: 0, gravadoCents: 20000, ivaCents: 3000, totalCents: 23000 },
        ];
        const resultado = calcularTotales(carrito);
        expect(resultado.sumaIva).toBe(Math.round(resultado.sumaGravado * 0.15));
    });

    it('Suma correctamente un carrito mixto con producto exento y producto gravado', () => {
        const carrito = [
            { baseCents: 15000, gravadoCents: 0, ivaCents: 0, totalCents: 15000 },
            { baseCents: 0, gravadoCents: 40000, ivaCents: 6000, totalCents: 46000 },
        ];
        const resultado = calcularTotales(carrito);
        expect(resultado.sumaBase).toBe(15000);
        expect(resultado.sumaGravado).toBe(40000);
        expect(resultado.sumaIva).toBe(6000);
        expect(resultado.sumaTotal).toBe(61000);
    });
});
