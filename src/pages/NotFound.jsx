import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-[60vh] flex items-center justify-center px-4">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-audible-text-primary mb-2">Page not found</h1>
      <p className="text-audible-text-secondary mb-6">The page you are looking for does not exist.</p>
      <Link to="/" className="text-audible-orange font-semibold underline">
        Back to home
      </Link>
    </div>
  </div>
);

export default NotFound;
