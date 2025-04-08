import * as wf from '@temporalio/workflow';
import type * as activities from './activities';

const {
  //
  payOrder,
  shipOrder,
  validateOrder,
} = wf.proxyActivities<typeof activities>({
  // every activity will timeout after 1 day
  scheduleToCloseTimeout: '1 day',
  // Retry policy for all proxied activities
  retry: {
    maximumAttempts: 10000,
    initialInterval: '1 second',
    maximumInterval: '10 seconds',
  },
});

export async function orderFulfillment(orderId: string) {
  // To be implemented
}
