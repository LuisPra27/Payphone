const API_URL = 'https://paymentbox.payphonetodoesposible.com/api/confirm';

describe('Conectividad con la API de PayPhone', () => {
    it('el servidor de PayPhone responde a una solicitud (no hay error de red/DNS)', async () => {
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: 0, clientTxId: 'test-conectividad' }),
        });

        expect(respuesta).toBeDefined();
        expect(typeof respuesta.status).toBe('number');
    }, 15000);

    it('sin token de autorización, la API responde con un error de autenticación (401/403), no con un 5xx', async () => {
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: 0, clientTxId: 'test-sin-token' }),
        });

        expect([401, 403]).toContain(respuesta.status);
    }, 15000);
});
