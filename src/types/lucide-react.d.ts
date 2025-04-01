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
}
