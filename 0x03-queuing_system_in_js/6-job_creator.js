import kue from 'kue';

// Create a queue
const queue = kue.createQueue();

// Job data
const jobData = {
  phoneNumber: '+1234567890',
  message: 'Account verification'
};

// Create a job in the push_notification_code queue
const job = queue.create('push_notification_code', jobData)
  .save((err) => {
    if (!err) {
      console.log(`Notification job created: ${job.id}`);
    }
  });

// Job completion handler
job.on('complete', () => {
  console.log('Notification job completed');
});

// Job failure handler
job.on('failed', () => {
  console.log('Notification job failed');
});
