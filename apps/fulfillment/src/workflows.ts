import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './activities';

const {
  //
  payOrder,
  sendOrder,
  validateOrder,
} = proxyActivities<typeof activities>({
  // every activity will timeout after 1 day
  scheduleToCloseTimeout: '1 day',
  retry: {
    maximumInterval: '10 seconds',
  },
});

export async function orderFulfillment(orderId: string) {
  await validateOrder(orderId);

  await payOrder(orderId, 30_00);

  await sendOrder(orderId, 'Hoofdstraat 244, 3972 LK Driebergen-Rijsenburg');
}
