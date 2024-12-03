import kue from 'kue';

// Function to send notification
function sendNotification(phoneNumber, message) {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

// Create a queue
const queue = kue.createQueue();

// Process jobs in the push_notification_code queue
queue.process('push_notification_code', (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message);
  done();
});
