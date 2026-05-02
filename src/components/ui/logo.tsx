import Image from "next/image";

interface LogoProps {
  className?: string;
  dark?: boolean;
}

export function Logo({ className = "", dark }: LogoProps) {
  return (
    <Image src={dark ? "/logo-dark.svg" : "/logo.svg"} alt="CashFlow" width={180} height={40} priority className={className} />
  );
}

export function LogoMark({ className = "" }: LogoProps) {
  return (
    <Image src="/logo-mark.svg" alt="CashFlow" width={40} height={40} priority className={className} />
  );
}
