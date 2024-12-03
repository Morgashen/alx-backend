import express from 'express';
import redis from 'redis';
import { promisify } from 'util';
import kue from 'kue';

// Redis client setup
const client = redis.createClient();
const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);

// Initialize seats and reservation status
let reservationEnabled = true;

// Reserve seats function
async function reserveSeat(number) {
    await setAsync('available_seats', number);
}

// Get current available seats
async function getCurrentAvailableSeats() {
    const seats = await getAsync('available_seats');
    return seats ? parseInt(seats) : 0;
}

// Initialize available seats to 50
reserveSeat(50);

// Create Kue queue
const queue = kue.createQueue();

// Express server setup
const app = express();
const PORT = 1245;

// Available seats route
app.get('/available_seats', async (req, res) => {
    const numberOfAvailableSeats = await getCurrentAvailableSeats();
    res.json({ numberOfAvailableSeats: numberOfAvailableSeats.toString() });
});

// Reserve seat route
app.get('/reserve_seat', (req, res) => {
    if (!reservationEnabled) {
        return res.json({ status: 'Reservation are blocked' });
    }

    const job = queue.create('reserve_seat').save((err) => {
        if (err) {
            return res.json({ status: 'Reservation failed' });
        }
        res.json({ status: 'Reservation in process' });
    });

    job.on('complete', () => {
        console.log(`Seat reservation job ${job.id} completed`);
    });

    job.on('failed', (errorMessage) => {
        console.log(`Seat reservation job ${job.id} failed: ${errorMessage}`);
    });
});

// Process seats route
app.get('/process', (req, res) => {
    res.json({ status: 'Queue processing' });

    queue.process('reserve_seat', async (job, done) => {
        const availableSeats = await getCurrentAvailableSeats();
        
        if (availableSeats <= 0) {
            reservationEnabled = false;
            return done(new Error('Not enough seats available'));
        }

        await reserveSeat(availableSeats - 1);

        if (availableSeats - 1 === 0) {
            reservationEnabled = false;
        }

        done();
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
