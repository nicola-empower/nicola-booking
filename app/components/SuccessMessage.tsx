interface SuccessMessageProps {
    onReset: () => void;
}

export default function SuccessMessage({ onReset }: SuccessMessageProps) {
    return (
        <div className="text-center pt-10 animate-fadeIn">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl">
                <i className="fa-solid fa-check"></i>
            </div>
            <h2 className="text-2xl mb-0 text-secondary">Booking Confirmed!</h2>
            <p className="text-text-muted mb-5">
                A calendar invite has been sent to your email.<br />
                I look forward to chatting.
            </p>
            <button
                onClick={onReset}
                className="w-auto py-3 px-6 border border-slate-300 rounded-lg bg-white cursor-pointer hover:bg-slate-50"
            >
                Book Another
            </button>
        </div>
    );
}
