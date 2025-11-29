export type ServiceType = 'paid' | 'free' | 'friend';

export interface Service {
    name: string;
    price: number;
    duration: number;
    type: ServiceType;
    description: string;
}

export type UserRole = 'client' | 'admin';

export interface BookingState {
    currentStep: number;
    selectedService: Service | null;
    selectedDate: string | null;
    selectedTime: string | null;
    userRole: UserRole;
}
