import { ChevronDown, Edit, Eye, Trash2, FileText, Package, DollarSign, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ActionItem = {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "destructive";
  separator?: boolean;
};

type ActionButtonProps = {
  actions: ActionItem[];
};

export function ActionButton({ actions }: ActionButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          Ações
          <ChevronDown className="ml-1 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {actions.map((action, index) => (
          <div key={index}>
            {action.separator && index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={action.onClick}
              className={
                action.variant === "destructive"
                  ? "text-red-600 focus:text-red-600 focus:bg-red-50"
                  : ""
              }
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Ícones pré-definidos para ações comuns
export const ActionIcons = {
  Edit: <Edit className="h-4 w-4" />,
  View: <Eye className="h-4 w-4" />,
  Delete: <Trash2 className="h-4 w-4" />,
  Convert: <FileText className="h-4 w-4" />,
  Stock: <Package className="h-4 w-4" />,
  Pay: <DollarSign className="h-4 w-4" />,
  Receive: <CheckCircle className="h-4 w-4" />,
};
