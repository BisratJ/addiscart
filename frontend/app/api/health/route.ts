import { NextResponse } from 'next/server';

export async function GET() {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
  };

  try {
    return NextResponse.json(healthcheck, { status: 200 });
  } catch (error) {
    healthcheck.message = 'ERROR';
    return NextResponse.json(healthcheck, { status: 503 });
  }
}
