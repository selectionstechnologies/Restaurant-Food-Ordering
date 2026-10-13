import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { usePageMeta } from '../hooks/usePageMeta';

export function NotFoundPage() {
  usePageMeta('Page not found');
  return (
    <div className="container-page py-16">
      <EmptyState
        icon={Compass}
        title="This page wandered off the menu"
        description="The page you’re looking for doesn’t exist or has moved."
        action={
          <>
            <Link to="/" className="btn-primary">
              Back to home
            </Link>
            <Link to="/menu" className="btn-outline">
              View menu
            </Link>
          </>
        }
      />
    </div>
  );
}
