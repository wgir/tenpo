import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:8080';

export const handlers = [
    // Tenpistas
    http.get(`${API_URL}/tenpistas`, () => {
        return HttpResponse.json([
            { id: 1, name: 'Tenpista 1', rut: '33333333-3' },
            { id: 2, name: 'Tenpista 2', rut: '44444444-4' },
        ]);
    }),

    http.post(`${API_URL}/tenpistas`, async ({ request }) => {
        const newTenpista = await request.json() as any;
        return HttpResponse.json({ id: 3, ...newTenpista }, { status: 201 });
    }),

    // Transactions
    http.get(`${API_URL}/transaction`, () => {
        return HttpResponse.json([]);
    }),

    http.post(`${API_URL}/transaction`, async ({ request }) => {
        const newTransaction = await request.json() as any;
        return HttpResponse.json({ id: 1, ...newTransaction }, { status: 201 });
    }),
];
