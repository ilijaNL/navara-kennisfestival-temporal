import { Client } from '@temporalio/client';
import { randomUUID } from 'node:crypto';
import { orderFulfillment } from './workflows';
import { TASK_QUEUE } from './constants';

async function createOrder() {
  const temporalClient = new Client();
  const orderId = `order::${randomUUID()}`;
  const orderAmount = Math.floor(Math.random() * 1000);
  const orderAddress = `Some random address`;
  await temporalClient.workflow.start(orderFulfillment, {
    args: [{ address: orderAddress, amount: orderAmount, orderId }],
    workflowId: orderId,
    taskQueue: TASK_QUEUE,
  });

  console.log(`---- Order with "${orderId}" created ----`);
}

createOrder().catch((err) => {
  console.error(err);
  process.exit(1);
});
