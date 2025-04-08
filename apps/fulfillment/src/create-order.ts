import { Client } from '@temporalio/client';
import { randomUUID } from 'node:crypto';
import { orderFulfillment } from './workflows';
import { TASK_QUEUE } from './constants';

async function createOrder() {
  const temporalClient = new Client();
  const orderId = `order::${randomUUID()}`;
  await temporalClient.workflow.start(orderFulfillment, {
    args: [orderId],
    workflowId: orderId,
    taskQueue: TASK_QUEUE,
  });

  console.log(`---- Order with "${orderId}" created ----`);
}

createOrder().catch((err) => {
  console.error(err);
  process.exit(1);
});
