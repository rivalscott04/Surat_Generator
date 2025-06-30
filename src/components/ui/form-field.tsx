
import React, { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  children: React.ReactNode;
  label: string;
  required?: boolean;
  error?: string;
  htmlFor?: string;
  className?: string;
  description?: string;
}

const FormField = ({ 
  children, 
  label, 
  required = false, 
  error, 
  htmlFor, 
  className,
  description 
}: FormFieldProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const handleFocus = () => {
    if (error) setShowTooltip(true);
  };
  
  const handleBlur = () => {
    setShowTooltip(false);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between">
        <Label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      </div>
      
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      
      <TooltipProvider>
        <Tooltip open={error ? showTooltip : false}>
          <TooltipTrigger asChild>
            <div 
              className={cn(
                "w-full", 
                error && "ring-2 ring-red-500"
              )}
              onFocus={handleFocus}
              onBlur={handleBlur}
            >
              {children}
            </div>
          </TooltipTrigger>
          {error && (
            <TooltipContent className="bg-red-500 text-white">
              <p>{error}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default FormField;
