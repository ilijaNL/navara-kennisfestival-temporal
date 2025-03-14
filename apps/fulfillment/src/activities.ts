import axios from 'axios';

const client = axios.create({ baseURL: 'http://localhost:3000' });

export async function validateOrder(orderId: string) {
  const { data } = await client.post('/validate', { orderId });
}

export async function payOrder(orderId: string, amountInCents: number) {
  const { data } = await client.post('/pay', { orderId });
}

export async function sendOrder(orderId: string, address: string) {
  const { data } = await client.post('/send', { orderId });
}
