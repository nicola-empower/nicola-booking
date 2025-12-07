import React from "react";
import { notFound } from "next/navigation";
import BookingCalendar, { BookingTheme } from "../../components/BookingCalendar";

type Props = {
    params: { site: string };
};

const SITE_CONFIG: Record<string, { title: string; theme: BookingTheme }> = {
    "virtual-assistant": {
        title: "Virtual Assistant Services",
        theme: {
            primaryColor: "#883AEA", // rgb(136, 58, 234)
            backgroundColor: "#ffffff",
            textColor: "#310A65", // rgb(49, 10, 101)
            borderColor: "#E0CCFA", // rgb(224, 204, 250)
            accentColor: "#E0CCFA",
            fontFamily: "'Inter', system-ui, sans-serif",
        },
    },
    "automation": {
        title: "Automation Solutions",
        theme: {
            primaryColor: "#F26F21", // --color-brand-orange
            backgroundColor: "#0d1117", // --color-brand-dark
            cardBackgroundColor: "#161b22", // Slightly lighter dark for card
            textColor: "#ffffff",
            borderColor: "#30363d",
            accentColor: "#C6246E", // --color-brand-magenta
            fontFamily: "'Inter', sans-serif",
        },
    },
    "digital-solutions": {
        title: "Digital Solutions",
        theme: {
            primaryColor: "#E91E63", // --color-empower-pink
            accentColor: "#C2185B", // --color-vibrant-magenta
            backgroundColor: "#121212", // Dark background
            cardBackgroundColor: "#1e1e1e", // Card background
            textColor: "#ffffff", // White text
            borderColor: "#8E24AA", // --color-deep-purple
            headingFont: "'Montserrat', sans-serif",
            bodyFont: "'Open Sans', sans-serif",
        },
    },
    "friends-and-family": {
        title: "Friends & Family",
        theme: {
            primaryColor: "#54ACBF", // Medium Light Blue
            backgroundColor: "#011C40", // Darkest Blue
            cardBackgroundColor: "#023859", // Dark Blue
            textColor: "#A7EBF2", // Lightest Blue/Cyan
            borderColor: "#26658C", // Medium Dark Blue
            accentColor: "#A7EBF2",
            headingFont: "'Playfair Display', serif", // Giving it a classy look matching 'Luna' vibe
            bodyFont: "'Inter', sans-serif",
        },
    },
};

export function generateStaticParams() {
    return Object.keys(SITE_CONFIG).map((site) => ({
        site,
    }));
}

export default function BookingPage({ params }: Props) {
    const config = SITE_CONFIG[params.site];

    if (!config) {
        notFound();
    }

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center p-4 transition-colors"
            style={{
                backgroundColor: config.theme.backgroundColor,
                color: config.theme.textColor,
                fontFamily: config.theme.bodyFont || config.theme.fontFamily,
            }}
        >
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1
                        className="text-3xl font-bold mb-2"
                        style={{ fontFamily: config.theme.headingFont }}
                    >
                        {config.title}
                    </h1>
                    <p style={{ opacity: 0.8 }}>Book your session below</p>
                </div>

                <BookingCalendar theme={config.theme} />

                <p className="text-center text-xs mt-8" style={{ opacity: 0.5 }}>
                    Powered by Empower Booking PWA
                </p>
            </div>
        </div>
    );
}
