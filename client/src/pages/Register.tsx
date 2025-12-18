import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const password = watch('password');

    const onSubmit = async (data: any) => {
        setLoading(true);
        setServerError('');
        try {
            const response = await API.post('/auth/register', data);
            login(response.data);
            navigate('/');
        } catch (error: any) {
            setServerError(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="card auth-card">
                <h2 className="page-title text-center">Create Account</h2>
                {serverError && <div className="error-message">{serverError}</div>}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-group">
                        <label className="input-label">Full Name</label>
                        <input
                            type="text"
                            className="input-field"
                            {...register('name', { required: 'Name is required' })}
                        />
                        {errors.name && <span className="field-error">{errors.name.message as string}</span>}
                    </div>

                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <input
                            type="email"
                            className="input-field"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                        />
                        {errors.email && <span className="field-error">{errors.email.message as string}</span>}
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Password must be at least 6 characters' }
                            })}
                        />
                        {errors.password && <span className="field-error">{errors.password.message as string}</span>}
                    </div>

                    <div className="input-group">
                        <label className="input-label">Confirm Password</label>
                        <input
                            type="password"
                            className="input-field"
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: value => value === password || "Passwords do not match"
                            })}
                        />
                        {errors.confirmPassword && <span className="field-error">{errors.confirmPassword.message as string}</span>}
                    </div>

                    <button type="submit" className="btn btn-primary full-width" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login" className="link">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
