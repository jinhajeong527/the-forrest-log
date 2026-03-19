import Link from "next/link";
import LogoMark from "./LogoMark";
import StarIcon from "./StarIcon";

interface PageHeaderProps {
  title: string;
  right?: React.ReactNode;
}

export default function PageHeader({ title, right }: PageHeaderProps) {
  return (
    <div className="bg-background/80 sticky top-0 z-20 backdrop-blur-sm border-b border-foreground/10">
      <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-[1fr_auto_1fr] items-center">
        <Link href="/" className="justify-self-start">
          <LogoMark />
        </Link>
        <div className="flex items-center gap-2">
          <StarIcon />
          <h1 className="font-cormorant text-5xl font-semibold tracking-wide text-secondary-foreground">
            {title}
          </h1>
          <StarIcon />
        </div>
        <div className="justify-self-end">{right}</div>
      </div>
    </div>
  );
}
