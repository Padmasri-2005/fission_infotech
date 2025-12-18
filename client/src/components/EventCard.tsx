import { Link } from 'react-router-dom';
import type { Event } from '../types';
import { FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';

interface EventCardProps {
    event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
    const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const isFull = event.attendees.length >= event.capacity;

    return (
        <div className="card event-card">
            <div className="event-image-container">
                {event.imageUrl ? (
                    <img src={event.imageUrl} alt={event.title} className="event-image" />
                ) : (
                    <div className="placeholder-image" />
                )}
                <div className="event-capacity-badge">
                    {event.attendees.length} / {event.capacity}
                </div>
            </div>
            <div className="event-content">
                <h3 className="event-title">{event.title}</h3>
                <div className="event-meta">
                    <div className="meta-item">
                        <FaCalendar className="meta-icon" /> {formattedDate}
                    </div>
                    <div className="meta-item">
                        <FaMapMarkerAlt className="meta-icon" /> {event.location}
                    </div>
                </div>
                <p className="event-description">
                    {event.description.length > 100
                        ? `${event.description.substring(0, 100)}...`
                        : event.description}
                </p>
                <Link
                    to={`/events/${event._id}`}
                    className={`btn btn-primary full-width ${isFull ? 'disabled' : ''}`}
                >
                    {isFull ? 'Sold Out' : 'View Details'}
                </Link>
            </div>

            <style>{`
        .event-card {
            padding: 0;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            height: 100%;
            transition: transform 0.3s ease;
        }
        .event-card:hover {
            transform: translateY(-5px);
        }
        .event-image-container {
            height: 200px;
            position: relative;
            background: #334155;
        }
        .event-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .placeholder-image {
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, var(--surface), var(--surface-hover));
        }
        .event-capacity-badge {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: rgba(0,0,0,0.7);
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            backdrop-filter: blur(4px);
        }
        .event-content {
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            flex: 1;
        }
        .event-title {
            font-size: 1.25rem;
            margin-bottom: 0.5rem;
            color: white;
        }
        .event-meta {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-bottom: 1rem;
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
        .meta-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .meta-icon {
            color: var(--primary-color);
        }
        .event-description {
            color: var(--text-secondary);
            font-size: 0.95rem;
            margin-bottom: 1.5rem;
            flex: 1;
        }
        .full-width {
            width: 100%;
            text-decoration: none;
            text-align: center;
        }
        .disabled {
            opacity: 0.7;
            pointer-events: none;
            background: var(--surface-hover);
        }
      `}</style>
        </div>
    );
};

export default EventCard;
