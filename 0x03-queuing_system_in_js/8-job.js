import kue from 'kue';

function createPushNotificationsJobs(jobs, queue) {
    // Validate input
    if (!Array.isArray(jobs)) {
        throw new Error('Jobs is not an array');
    }

    // Create jobs in the queue
    jobs.forEach((jobData) => {
        const job = queue.create('push_notification_code_3', jobData)
            .save((err) => {
                if (!err) {
                    console.log(`Notification job created: ${job.id}`);
                }
            });

        // Event listeners for job events
        job.on('complete', () => {
            console.log(`Notification job ${job.id} completed`);
        });

        job.on('failed', (err) => {
            console.log(`Notification job ${job.id} failed: ${err}`);
        });

        job.on('progress', (progress) => {
            console.log(`Notification job ${job.id} ${progress}% complete`);
        });
    });
}

export default createPushNotificationsJobs;
