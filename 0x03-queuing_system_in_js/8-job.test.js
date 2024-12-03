import { expect } from 'chai';
import kue from 'kue';
import createPushNotificationsJobs from './8-job.js';

describe('createPushNotificationsJobs', () => {
    let queue;

    beforeEach(() => {
        // Enter test mode before each test
        queue = kue.createQueue();
        queue.testMode.enter();
    });

    afterEach(() => {
        // Clear the queue and exit test mode after each test
        queue.testMode.clear();
        queue.testMode.exit();
    });

    it('should throw an error if jobs is not an array', () => {
        expect(() => createPushNotificationsJobs('not an array', queue)).to.throw('Jobs is not an array');
    });

    it('should create jobs in the queue', () => {
        const jobs = [
            { phoneNumber: '4153518780', message: 'Test message 1' },
            { phoneNumber: '4153518781', message: 'Test message 2' }
        ];

        createPushNotificationsJobs(jobs, queue);

        // Check if jobs are created in the queue
        const queuedJobs = queue.testMode.jobs;
        expect(queuedJobs).to.have.lengthOf(2);
        expect(queuedJobs[0].type).to.equal('push_notification_code_3');
        expect(queuedJobs[0].data).to.deep.equal(jobs[0]);
        expect(queuedJobs[1].data).to.deep.equal(jobs[1]);
    });

    it('should handle an empty jobs array', () => {
        const jobs = [];

        createPushNotificationsJobs(jobs, queue);

        // Check if no jobs are created
        const queuedJobs = queue.testMode.jobs;
        expect(queuedJobs).to.have.lengthOf(0);
    });
});
