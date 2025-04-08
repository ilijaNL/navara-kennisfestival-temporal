import Fastify, { FastifyInstance } from 'fastify';
import { writeFile, readFile, stat } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

// Instantiate Fastify with some config
const server = Fastify({
  logger: {
    level: 'warn',
  },
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type OrderId = string;

type OrderState =
  | { type: 'validated' }
  | { type: 'paid'; paidAt: number }
  | { type: 'sent' }
  | null;

type OrderDTO = {
  orderId: string;
  state: OrderState;
};
class Order {
  #state: OrderState;

  private constructor(public readonly orderId: OrderId, state: OrderState) {
    this.#state = state;
  }

  static initialize(orderId: OrderId) {
    return new Order(orderId, null);
  }

  validate() {
    if (this.#state === null) {
      this.#state = { type: 'validated' };
    }
  }

  pay() {
    if (this.#state?.type === 'paid') {
      return;
    }

    if (this.#state === null) {
      throw new Error('order should be validated first');
    }

    if (this.#state.type === 'validated') {
      this.#state = {
        paidAt: Date.now(),
        type: 'paid',
      };
    }
  }

  send() {
    // already sent
    if (this.#state?.type === 'sent') {
      return;
    }

    if (this.#state?.type === 'paid') {
      const canBeShippedLaterThan = Date.now() - 20_000;
      if (this.#state.paidAt > canBeShippedLaterThan) {
        // let the process crash on purpose
        console.log('Woopsey - we cannot deal with this. You should wait some time before sending in this order. Bye bye!');
        process.exit(1);
      }

      this.#state = {
        type: 'sent',
      };

      return;
    }

    throw new Error(
      `Order should be validated and paid first. Current state: ${this.#state}`
    );
  }

  toJSON() {
    const data: OrderDTO = {
      orderId: this.orderId,
      state: this.#state,
    };
    return data;
  }

  static fromJSON(data: OrderDTO) {
    return new Order(data.orderId, data.state);
  }
}

const getFilePath = (orderId: OrderId) =>
  path.join(tmpdir(), `order-${orderId}`);

async function retrieveOrder(orderId: OrderId) {
  await delay(2000);

  const filePath = getFilePath(orderId);
  const fileExists = await stat(filePath)
    .then((s) => s.isFile())
    .catch(() => false);

  if (!fileExists) {
    return Order.initialize(orderId);
  }

  const file = await readFile(filePath, { encoding: 'utf8' });
  return Order.fromJSON(JSON.parse(file));
}

async function storeOrder(order: Order) {
  const filePath = getFilePath(order.orderId);
  await writeFile(filePath, JSON.stringify(order), { encoding: 'utf8' });
}



async function app(instance: FastifyInstance) {

  instance.post('/validate', async (request) => {
    const { orderId } = request.body as any;

    const order = await retrieveOrder(orderId);

    order.validate();

    await storeOrder(order);

    return {
      orderId: order.orderId,
    };
  });

  const seenOrders = new Set<string>();

  instance.post('/pay', async (request) => {
    const { orderId } = request.body as any;

    // throw on first time
    if (!seenOrders.has(orderId)) {
      seenOrders.add(orderId);
      throw new Error('Kaboom');
    }

    const order = await retrieveOrder(orderId);
    order.pay();
    await storeOrder(order);

    return {
      success: true,
    };
  });

  instance.post('/send', async (request) => {

    const { orderId } = request.body as any;

    const order = await retrieveOrder(orderId);
    order.send();
    await storeOrder(order);

    return {
      success: true,
    };
  });
}

// Register your application as a normal plugin.
server.register(app);

// Start listening.
server.listen({ port, host }, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  } else {
    console.log(`[ Flaky API ] Started on http://${host}:${port}`);
  }
});
