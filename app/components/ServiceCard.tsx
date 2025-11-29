import { Service } from '../types/booking';

interface ServiceCardProps {
    service: Service;
    isSelected: boolean;
    onSelect: () => void;
}

export default function ServiceCard({ service, isSelected, onSelect }: ServiceCardProps) {
    const getBadgeStyles = () => {
        if (service.type === 'paid') {
            return 'bg-emerald-100 text-emerald-800';
        } else if (service.type === 'friend') {
            return 'bg-amber-100 text-amber-800';
        }
        return 'bg-slate-200 text-slate-600';
    };

    const getBadgeText = () => {
        if (service.type === 'paid') {
            return service.name.includes('Automation') ? 'Deposit' : 'Paid';
        } else if (service.type === 'friend') {
            return 'Social';
        }
        return 'Free';
    };

    return (
        <div
            onClick={onSelect}
            className={`
        bg-white border-2 rounded-2xl p-5 cursor-pointer shadow-card
        hover:-translate-y-1 hover:shadow-card-hover
        ${isSelected ? 'border-primary bg-teal-50' : 'border-transparent'}
      `}
        >
            <span className="font-semibold mb-1 block">
                {service.name}{' '}
                <span className={`text-xs py-0.5 px-2 rounded-xl ${getBadgeStyles()}`}>
                    {getBadgeText()}
                </span>
            </span>
            <span className="text-sm text-text-muted flex items-center gap-1">
                {service.price === 0
                    ? `${service.duration} Mins`
                    : `£${service.price}.00 / ${service.name.includes('VA') ? 'hour' : 'deposit'}`
                }
            </span>
            <p className="text-xs mt-2 text-gray-600">{service.description}</p>
        </div>
    );
}
