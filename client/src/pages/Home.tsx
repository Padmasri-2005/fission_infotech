import { useEffect, useState } from 'react';
import API from '../services/api';
import type { Event } from '../types';
import EventCard from '../components/EventCard';
import { FaSpinner } from 'react-icons/fa';

const Home = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await API.get('/events');
                setEvents(data);
            } catch (err: any) {
                setError('Failed to load events');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <FaSpinner className="spinner" />
            </div>
        );
    }

    return (
        <div className="home-page">
            <header className="home-header">
                <h1 className="page-title">Discover Events</h1>
                <p className="subtitle">Join the community and explore upcoming tech meetups.</p>
            </header>

            {error && <div className="error-message">{error}</div>}

            <div className="events-grid">
                {events.map((event) => (
                    <EventCard key={event._id} event={event} />
                ))}
            </div>

            {events.length === 0 && !error && (
                <div className="empty-state">
                    <p>No events found. Be the first to create one!</p>
                </div>
            )}

            <style>{`
        .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 50vh;
        }
        .spinner {
            animation: spin 1s linear infinite;
            font-size: 2rem;
            color: var(--primary-color);
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .home-header {
            text-align: center;
            margin-bottom: 3rem;
        }
        .subtitle {
            font-size: 1.1rem;
            color: var(--text-secondary);
            max-width: 600px;
            margin: 0 auto;
        }
        .events-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
        }
        .error-message {
            background: rgba(239, 68, 68, 0.1);
            color: var(--error);
            padding: 1rem;
            border-radius: var(--radius-md);
            margin-bottom: 2rem;
            text-align: center;
        }
        .empty-state {
            text-align: center;
            padding: 4rem;
            color: var(--text-secondary);
            background: var(--surface);
            border-radius: var(--radius-md);
            border: var(--glass-border);
        }
      `}</style>
        </div>
    );
};

export default Home;
