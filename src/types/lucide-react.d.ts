declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';
  
  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
  }
  
  export type Icon = FC<IconProps>;
  
  export const MessageSquare: Icon;
  export const Tool: Icon;
  export const LayoutDashboard: Icon;
  export const ShoppingBag: Icon;
  export const MessageCircle: Icon;
  export const Send: Icon;
  export const Loader2: Icon;
  export const Search: Icon;
  export const Brain: Icon;
  export const Cpu: Icon;
  export const ExternalLink: Icon;
  export const Check: Icon;
  export const ChevronDown: Icon;
  export const ChevronUp: Icon;
}
