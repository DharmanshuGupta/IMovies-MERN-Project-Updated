import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, Movie, Show, Booking } from './models.js';

await mongoose.connect(process.env.MONGO_URI);
await Promise.all([User.deleteMany({}), Movie.deleteMany({}), Show.deleteMany({}), Booking.deleteMany({})]);
const [admin, user] = await User.create([
  { name: 'Demo Admin', email: 'admin@imovies.demo', password: await bcrypt.hash('Admin123!', 12), role: 'admin' },
  { name: 'Demo User', email: 'user@imovies.demo', password: await bcrypt.hash('User123!', 12), role: 'user' }
]);
const movies = await Movie.create([
  { title: 'one piece god valley', synopsis: 'Its a journey about a 17 year boy becoming the king of the pirates', genre: ['action', 'Adventure'], language: 'English', durationMinutes: 136, rating: 8.4, posterUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80' },
  { title: 'Chennai express', synopsis: 'Two artists discover a new beginning during a city-wide monsoon.', genre: ['Romance', 'Drama'], language: 'English', durationMinutes: 124, rating: 7.8, posterUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80' },
  { title: 'How to loose a guy in 10 days', synopsis: 'A sharp investigator races through a neon-lit city to stop a high-tech heist.', genre: ['Romance', 'comady'], language: 'English', durationMinutes: 118, rating: 8.1, posterUrl: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80' },
  { title: 'Ramayan', synopsis: 'A curious kid discovers a miniature universe full of unexpected adventures.', genre: ['Adeventure', 'Historical'], language: 'English', durationMinutes: 96, rating: 8.7, posterUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80' }
]);
const seats = Array.from({ length: 40 }, (_, i) => ({ code: `${String.fromCharCode(65 + Math.floor(i / 8))}${(i % 8) + 1}`, status: 'available' }));
const now = Date.now();
for (const movie of movies) {
  await Show.create([
    { movie: movie._id, theatre: 'IMovies Central', city: 'Indore', startsAt: new Date(now + 3 * 60 * 60 * 1000), price: 180, seats: seats.map(s => ({ ...s })) },
    { movie: movie._id, theatre: 'IMovies Premium', city: 'Indore', startsAt: new Date(now + 7 * 60 * 60 * 1000), price: 260, seats: seats.map(s => ({ ...s })) }
  ]);
}
console.log('Seed complete. Demo accounts: admin@imovies.demo / Admin123! and user@imovies.demo / User123!');
await mongoose.disconnect();
