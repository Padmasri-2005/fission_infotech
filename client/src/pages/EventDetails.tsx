import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import type { Event } from '../types';
import { useAuth } from '../context/AuthContext';
import { FaCalendar, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';

const EventDetails = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        try {
            const { data } = await API.get(`/events/${id}`);
            setEvent(data);
        } catch (err) {
            setError('Failed to load event details');
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setProcessing(true);
        setError('');
        setSuccessMsg('');
        try {
            await API.post(`/events/${id}/join`);
            setSuccessMsg('Successfully joined the event!');
            fetchEvent(); // Refresh data
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to join event');
        } finally {
            setProcessing(false);
        }
    };

    const handleLeave = async () => {
        setProcessing(true);
        setError('');
        setSuccessMsg('');
        try {
            await API.post(`/events/${id}/leave`);
            setSuccessMsg('Successfully left the event.');
            fetchEvent(); // Refresh data
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to leave event');
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        try {
            await API.delete(`/events/${id}`);
            navigate('/');
        } catch (err: any) {
            setError('Failed to delete event');
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!event) return <div className="error">Event not found</div>;

    const isCreator = user?._id === (typeof event.creator === 'string' ? event.creator : event.creator._id);
    const isJoined = user && event.attendees.includes(user._id);
    const isFull = event.attendees.length >= event.capacity;
    const formattedDate = new Date(event.date).toLocaleString();

    return (
        <div className="event-details-container">
            <div className="hero-image" style={{ backgroundImage: `url(${event.imageUrl || 'https://via.placeholder.com/800x400'})` }}>
                <div className="overlay">
                    <h1 className="hero-title">{event.title}</h1>
                </div>
            </div>

            <div className="details-content">
                <div className="main-info">
                    <div className="meta-row">
                        <div className="meta-item">
                            <FaCalendar className="meta-icon" /> {formattedDate}
                        </div>
                        <div className="meta-item">
                            <FaMapMarkerAlt className="meta-icon" /> {event.location}
                        </div>
                        <div className="meta-item">
                            <FaUsers className="meta-icon" /> {event.attendees.length} / {event.capacity} Attendees
                        </div>
                    </div>

                    <div className="card description-card">
                        <h3>About Event</h3>
                        <p>{event.description}</p>
                    </div>

                    {user && (
                        <div className="actions-card card">
                            {error && <div className="error-message">{error}</div>}
                            {successMsg && <div className="success-message">{successMsg}</div>}

                            <div className="action-buttons">
                                {isCreator ? (
                                    <>
                                        <button className="btn btn-secondary" onClick={() => navigate(`/edit-event/${id}`)} disabled={processing}>Edit Event</button>
                                        <button className="btn btn-danger" onClick={handleDelete} disabled={processing}>Delete Event</button>
                                    </>
                                ) : (
                                    <>
                                        {isJoined ? (
                                            <button className="btn btn-danger" onClick={handleLeave} disabled={processing}>
                                                {processing ? 'Processing...' : 'Cancel RSVP (Leave)'}
                                            </button>
                                        ) : (
                                            <button
                                                className={`btn btn-primary ${isFull ? 'disabled' : ''}`}
                                                onClick={handleJoin}
                                                disabled={processing || isFull}
                                            >
                                                {processing ? 'Processing...' : isFull ? 'Event Full' : 'RSVP Now (Join)'}
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .hero-image {
                    height: 300px;
                    background-size: cover;
                    background-position: center;
                    position: relative;
                    border-radius: var(--radius-md);
                    margin-bottom: 2rem;
                    overflow: hidden;
                }
                .overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
                    padding: 2rem;
                }
                .hero-title {
                    color: white;
                    font-size: 2.5rem;
                    margin: 0;
                }
                .meta-row {
                    display: flex;
                    gap: 2rem;
                    margin-bottom: 2rem;
                    font-size: 1.1rem;
                    color: var(--text-secondary);
                }
                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .meta-icon {
                    color: var(--primary-color);
                }
                .description-card {
                    margin-bottom: 2rem;
                }
                .description-card h3 {
                    margin-bottom: 1rem;
                    color: var(--text-primary);
                }
                .action-buttons {
                    display: flex;
                    gap: 1rem;
                    justify-content: flex-end;
                }
                .btn-danger {
                    background: rgba(239, 68, 68, 0.2);
                    color: var(--error);
                    border: 1px solid var(--error);
                    padding: 0.75rem 1.5rem;
                    border-radius: var(--radius-md);
                }
                .btn-danger:hover {
                    background: var(--error);
                    color: white;
                }
                .success-message {
                    background: rgba(34, 197, 94, 0.1);
                    color: var(--success);
                    padding: 0.75rem;
                    border-radius: var(--radius-sm);
                    margin-bottom: 1rem;
                }
                .error-message {
                    background: rgba(239, 68, 68, 0.1);
                    color: var(--error);
                    padding: 0.75rem;
                    border-radius: var(--radius-sm);
                    margin-bottom: 1rem;
                }
            `}</style>
        </div>
    );
};

export default EventDetails;
