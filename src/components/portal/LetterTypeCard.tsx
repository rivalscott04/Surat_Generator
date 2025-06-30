
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface LetterTypeCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  color: string;
}

export default function LetterTypeCard({
  title,
  description,
  icon: Icon,
  to,
  color,
}: LetterTypeCardProps) {
  return (
    <Link to={to} className="block transition-transform hover:scale-105">
      <Card className="h-full overflow-hidden border shadow-md hover:shadow-lg">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <div className={`mb-4 rounded-full p-3 ${color}`}>
            <Icon className="h-8 w-8" />
          </div>
          <h3 className="mb-2 text-xl font-bold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
