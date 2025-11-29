// API Route: Stripe Webhook Handler
// This handles Stripe webhook events (payment confirmations, etc.)

/*
TODO: Uncomment when Stripe is configured

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/app/utils/firebase';
import { collection, addDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      // Save booking to Firestore
      await addDoc(collection(db, 'bookings'), {
        stripePaymentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        status: 'completed',
        serviceId: paymentIntent.metadata.serviceId,
        serviceName: paymentIntent.metadata.serviceName,
        createdAt: new Date(),
      });
      
      console.log('Payment succeeded:', paymentIntent.id);
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      console.log('Payment failed:', failedPayment.id);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
*/

// Placeholder - will be implemented with Stripe integration
export async function POST() {
    return new Response('Stripe webhooks not yet configured', { status: 501 });
}
