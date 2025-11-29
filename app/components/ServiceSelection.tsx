import { Service } from '../types/booking';
import ServiceCard from './ServiceCard';

interface ServiceSelectionProps {
    onSelectService: (service: Service) => void;
    selectedService: Service | null;
}

const services: Service[] = [
    {
        name: 'Virtual Assistant',
        price: 40,
        duration: 60,
        type: 'paid',
        description: 'General admin, email management, and ad-hoc support.',
    },
    {
        name: 'Automation Build',
        price: 100,
        duration: 45,
        type: 'paid',
        description: 'Google Apps Script & Workflow automation scoping.',
    },
    {
        name: 'Web Discovery',
        price: 0,
        duration: 15,
        type: 'free',
        description: 'Initial chat for website projects.',
    },
    {
        name: 'Friends & Family',
        price: 0,
        duration: 60,
        type: 'friend',
        description: 'Lunch, coffee, or general chaos coordination.',
    },
];

export default function ServiceSelection({ onSelectService, selectedService }: ServiceSelectionProps) {
    return (
        <div className="animate-fadeIn">
            <h2 className="text-2xl mb-6 text-secondary">Select Service</h2>
            <div className="grid grid-cols-2 gap-4">
                {services.map((service) => (
                    <ServiceCard
                        key={service.name}
                        service={service}
                        isSelected={selectedService?.name === service.name}
                        onSelect={() => onSelectService(service)}
                    />
                ))}
            </div>
        </div>
    );
}
