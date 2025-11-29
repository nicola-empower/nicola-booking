interface DateCardProps {
    dayName: string;
    dateNum: number;
    isActive: boolean;
    onClick: () => void;
}

export default function DateCard({ dayName, dateNum, isActive, onClick }: DateCardProps) {
    return (
        <div
            onClick={onClick}
            className={`
        min-w-[70px] py-4 px-2.5 rounded-xl text-center border cursor-pointer
        ${isActive
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white border-slate-200'
                }
      `}
        >
            <span className="text-xs block mb-1 uppercase">{dayName}</span>
            <span className="text-xl font-bold">{dateNum}</span>
        </div>
    );
}
