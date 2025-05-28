declare module "*.svg?react" {
  import { FC, SVGProps } from "react";
  interface SVGComponentProps extends SVGProps<SVGElement> {
    width?: SVGProps<SVGElement>["width"] | null;
    height?: SVGProps<SVGElement>["height"] | null;
  }
  const content: FC<SVGComponentProps>;
  export default content;
}
