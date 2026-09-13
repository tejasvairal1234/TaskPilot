import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";

const NotFoundPage = () => (
  <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
    <div className="text-center max-w-md animate-fade-in">
      <div className="text-8xl font-extrabold text-primary/20 mb-4 select-none">404</div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Page not found</h1>
      <p className="text-muted-foreground text-sm mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/dashboard">
        <Button variant="primary">
          ← Back to Dashboard
        </Button>
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
