const post = async (path: string, body: any) => {
  const result = await fetch('http://localhost:3000' + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!result.ok) {
    throw new Error(`Failed to call ${path}: ${result.statusText}`);
  }

  return result.json();
};

export async function validateOrder(orderId: string) {
  await post('/validate', { orderId });
}

export async function payOrder(orderId: string, amountInCents: number) {
  await post('/pay', { orderId });
}

export async function sendOrder(orderId: string, address: string) {
  await post('/send', { orderId });
}
