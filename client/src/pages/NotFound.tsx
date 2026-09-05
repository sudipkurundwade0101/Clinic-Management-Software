import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Stethoscope, Home, ArrowLeft } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Visual Element */}
        <div className="relative flex justify-center items-center">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl size-48 mx-auto -z-10 animate-pulse" />
          <div className="relative bg-card border border-border shadow-lg rounded-2xl p-6 flex flex-col items-center">
            <div className="p-4 rounded-full bg-primary/10 text-primary mb-3">
              <Stethoscope className="size-12 animate-bounce" />
            </div>
            <span className="text-6xl font-extrabold tracking-tight text-primary">
              404
            </span>
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Page Not Found
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Oops! The clinic page or medical record you are searching for doesn&apos;t exist, was moved, or you don&apos;t have permission to view it.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto gap-2"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </Button>
          <Link
            to={ROUTES.DASHBOARD}
            className={cn(buttonVariants({ variant: 'default' }), "w-full sm:w-auto gap-2")}
          >
            <Home className="size-4" />
            Return to Dashboard
          </Link>
        </div>

        {/* Helpful Links Box */}
        <div className="pt-6 border-t border-border/60">
          <p className="text-xs text-muted-foreground mb-3 font-medium">Quick Directory Navigation:</p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <Link
              to={ROUTES.APPOINTMENTS}
              className="px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-foreground transition-colors"
            >
              Appointments
            </Link>
            <Link
              to={ROUTES.PATIENTS}
              className="px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-foreground transition-colors"
            >
              Patients
            </Link>
            <Link
              to={ROUTES.DOCTORS}
              className="px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-foreground transition-colors"
            >
              Doctors
            </Link>
            <Link
              to={ROUTES.SETTINGS}
              className="px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-foreground transition-colors"
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
