import { Link } from 'react-router-dom';
import { ErrorState } from '../components/ui';

/** NotFound: any unknown address. One sentence, two ways out. */
export default function NotFound() {
  return (
    <div className="page min-h-[60vh]">
      <ErrorState
        title="Page not found"
        description="The address may be old or mistyped. The book you were after is probably one search away."
        backTo="/"
        backLabel="Back to home"
        className="pt-16 md:pt-24"
      />
      <p className="text-sm text-ink-2">
        Or <Link to="/search" className="link">search the catalogue</Link>.
      </p>
    </div>
  );
}
