import { type TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-xs font-medium text-muted">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "flex min-h-[120px] w-full rounded-md border border-border bg-[#09090b] px-3 py-2 text-sm text-text transition-colors placeholder:text-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50 resize-y",
            error ? "border-danger focus-visible:ring-danger" : "",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-danger font-medium mt-1">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
