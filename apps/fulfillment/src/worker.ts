import {
  DefaultLogger,
  NativeConnection,
  Runtime,
  Worker,
} from '@temporalio/worker';
import { TASK_QUEUE } from './constants';
import * as activities from './activities';

export async function startWorker() {
  Runtime.install({
    logger: new DefaultLogger('WARN'),
  });
  const connection = await NativeConnection.connect();
  try {
    const worker = await Worker.create({
      workflowsPath: require.resolve('./workflows'),
      activities: activities,
      connection,
      taskQueue: TASK_QUEUE,
    });

    console.log('Worker started');

    await worker.run();
  } finally {
    // Close the connection once the worker has stopped
    await connection.close();
  }
}
