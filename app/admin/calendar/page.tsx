import AdminCalendar from "../../components/AdminCalendar";

export default function AdminCalendarPage() {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-8 text-indigo-700">Manage Availability</h1>
            <AdminCalendar />
        </div>
    );
}
