// API Route: Create Payment Intent
// This will handle Stripe payment creation on the server side

/*
TODO: Uncomment when Stripe is configured

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  try {
    const { amount, serviceId, serviceName } = await req.json();

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'gbp',
      metadata: {
        serviceId,
        serviceName,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
*/

// Placeholder - will be implemented with Stripe integration
export async function POST() {
    return new Response('Stripe not yet configured', { status: 501 });
}
