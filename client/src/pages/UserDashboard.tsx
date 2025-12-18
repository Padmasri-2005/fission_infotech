import { useEffect, useState } from 'react';
import API from '../services/api';

import EventCard from '../components/EventCard';
import type { Event } from '../types';

interface UserProfile {
    _id: string;
    name: string;
    email: string;
    createdEvents: Event[];
    joinedEvents: Event[];
}

const UserDashboard = () => {
    // const { user } = useAuth(); // User not needed if purely relying on API
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await API.get('/auth/profile');
                setProfile(data);
            } catch (error) {
                console.error('Failed to fetch profile', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <div className="loading">Loading dashboard...</div>;
    if (!profile) return <div>Error loading profile</div>;

    return (
        <div className="dashboard-container">
            <h1 className="page-title">Welcome, {profile.name}</h1>

            <section className="dashboard-section">
                <h2 className="section-title">Events You've Joined</h2>
                {profile.joinedEvents.length > 0 ? (
                    <div className="events-grid">
                        {profile.joinedEvents.map(event => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                ) : (
                    <p className="empty-text">You haven't joined any events yet.</p>
                )}
            </section>

            <section className="dashboard-section">
                <h2 className="section-title">Events You've Created</h2>
                {profile.createdEvents.length > 0 ? (
                    <div className="events-grid">
                        {profile.createdEvents.map(event => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                ) : (
                    <p className="empty-text">You haven't created any events yet.</p>
                )}
            </section>

            <style>{`
                .section-title {
                    font-size: 1.5rem;
                    margin-bottom: 1.5rem;
                    color: var(--primary-color);
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    padding-bottom: 0.5rem;
                }
                .dashboard-section {
                    margin-bottom: 4rem;
                }
                .events-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 2rem;
                }
                .empty-text {
                    color: var(--text-secondary);
                    font-style: italic;
                }
            `}</style>
        </div>
    );
};

export default UserDashboard;
