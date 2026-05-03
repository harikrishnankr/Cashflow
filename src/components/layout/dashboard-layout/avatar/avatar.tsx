import { AvatarProps } from "../dashboard-layout.type";

export function Avatar(props: AvatarProps) {
  return (
    <>
      {props.isMobile ? (
        <div className="w-7 h-7 rounded-full bg-(--orange) flex items-center justify-center text-white text-[11px] font-semibold select-none">
          {props.initials}
        </div>
      ) : (
        <>
          <div className="w-7 h-7 rounded-full bg-(--orange) flex items-center justify-center text-white text-[11px] font-semibold flex-none">
            {props.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-medium text-(--ink) leading-tight truncate">
              {props.name}
            </div>
            <div className="text-[11px] text-(--ink-3) truncate">
              {props.email}
            </div>
          </div>
        </>
      )}
    </>
  );
}
