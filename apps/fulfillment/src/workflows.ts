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


/**
 * 1. Validate order
 * 2. Pay order
 * 3. Wait at least 20 seconds before sending the order (using durable sleep)
 * 4. Ship order
 */
export async function orderFulfillment(orderId: string) {
  // To be implemented
}
