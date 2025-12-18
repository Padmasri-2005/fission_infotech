import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: any) => {
        setLoading(true);
        setServerError('');
        try {
            const response = await API.post('/auth/login', data);
            login(response.data);
            navigate('/');
        } catch (error: any) {
            setServerError(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="card auth-card">
                <h2 className="page-title text-center">Welcome Back</h2>
                {serverError && <div className="error-message">{serverError}</div>}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <input
                            type="email"
                            className="input-field"
                            {...register('email', { required: 'Email is required' })}
                        />
                        {errors.email && <span className="field-error">{errors.email.message as string}</span>}
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            {...register('password', { required: 'Password is required' })}
                        />
                        {errors.password && <span className="field-error">{errors.password.message as string}</span>}
                    </div>

                    <button type="submit" className="btn btn-primary full-width" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account? <Link to="/register" className="link">Sign up</Link>
                </p>
            </div>
            <style>{`
        .auth-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 80vh;
        }
        .auth-card {
            width: 100%;
            max-width: 400px;
        }
        .text-center {
            text-align: center;
        }
        .full-width {
            width: 100%;
        }
        .field-error {
            color: var(--error);
            font-size: 0.8rem;
            margin-top: 0.25rem;
            display: block;
        }
        .auth-footer {
            margin-top: 1.5rem;
            text-align: center;
            color: var(--text-secondary);
        }
        .link {
            color: var(--primary-color);
            font-weight: 600;
        }
        .link:hover {
            text-decoration: underline;
        }
        .error-message {
            background: rgba(239, 68, 68, 0.1);
            color: var(--error);
            padding: 0.75rem;
            border-radius: var(--radius-sm);
            margin-bottom: 1.5rem;
            text-align: center;
            font-size: 0.9rem;
        }
      `}</style>
        </div>
    );
};

export default Login;
