import Image from "next/image";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <Image src="/logo.svg" alt="CashFlow" width={180} height={40} priority className={className} />
  );
}

export function LogoMark({ className = "" }: LogoProps) {
  return (
    <Image src="/logo-mark.svg" alt="CashFlow" width={40} height={40} priority className={className} />
  );
}
