import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const CreateEvent = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const onSubmit = async (data: any) => {
        setLoading(true);
        setServerError('');

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('date', data.date);
        formData.append('location', data.location);
        formData.append('capacity', data.capacity);
        if (data.image[0]) {
            formData.append('image', data.image[0]);
        }

        try {
            await API.post('/events', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/');
        } catch (error: any) {
            setServerError(error.response?.data?.message || 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-event-container">
            <div className="card">
                <h1 className="page-title">Create New Event</h1>
                {serverError && <div className="error-message">{serverError}</div>}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-group">
                        <label className="input-label">Event Title</label>
                        <input
                            type="text"
                            className="input-field"
                            {...register('title', { required: 'Title is required' })}
                        />
                        {errors.title && <span className="field-error">{errors.title.message as string}</span>}
                    </div>

                    <div className="input-group">
                        <label className="input-label">Description</label>
                        <textarea
                            className="input-field"
                            rows={4}
                            {...register('description', { required: 'Description is required' })}
                        />
                        {errors.description && <span className="field-error">{errors.description.message as string}</span>}
                    </div>

                    <div className="row">
                        <div className="input-group col">
                            <label className="input-label">Date & Time</label>
                            <input
                                type="datetime-local"
                                className="input-field"
                                {...register('date', { required: 'Date is required' })}
                            />
                            {errors.date && <span className="field-error">{errors.date.message as string}</span>}
                        </div>
                        <div className="input-group col">
                            <label className="input-label">Capacity (Max Attendees)</label>
                            <input
                                type="number"
                                className="input-field"
                                {...register('capacity', { required: 'Capacity is required', min: 1 })}
                            />
                            {errors.capacity && <span className="field-error">{errors.capacity.message as string}</span>}
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Location</label>
                        <input
                            type="text"
                            className="input-field"
                            {...register('location', { required: 'Location is required' })}
                        />
                        {errors.location && <span className="field-error">{errors.location.message as string}</span>}
                    </div>

                    <div className="input-group">
                        <label className="input-label">Event Image</label>
                        <input
                            type="file"
                            className="input-field"
                            accept="image/*"
                            {...register('image')}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary full-width" disabled={loading}>
                        {loading ? 'Creating Event...' : 'Create Event'}
                    </button>
                </form>
            </div>
            <style>{`
                .create-event-container {
                    max-width: 800px;
                    margin: 0 auto;
                }
                .row {
                    display: flex;
                    gap: 1.5rem;
                }
                .col {
                    flex: 1;
                }
                .input-field[type="file"] {
                    padding: 0.5rem;
                }
                .error-message {
                    color: var(--error);
                    background: rgba(239, 68, 68, 0.1);
                    padding: 0.75rem;
                    border-radius: var(--radius-sm);
                    margin-bottom: 1.5rem;
                }
                .field-error {
                    color: var(--error);
                    font-size: 0.8rem;
                    margin-top: 0.25rem;
                }
                .full-width {
                    width: 100%;
                }
            `}</style>
        </div>
    );
};

export default CreateEvent;
