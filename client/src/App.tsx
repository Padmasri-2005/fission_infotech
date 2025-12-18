import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventDetails';
import UserDashboard from './pages/UserDashboard';

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/create-event" element={<CreateEvent />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/events/:id" element={<EventDetails />} />
            </Routes>
        </Layout>
    );
}

export default App;
