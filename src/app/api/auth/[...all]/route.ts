// Better Auth API Route Handler

import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400",
};

// Add CORS headers to response
function addCorsHeaders(response: Response): Response {
  const newHeaders = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

export async function GET(request: NextRequest) {
  const response = await auth.handler(request);
  return addCorsHeaders(response);
}

export async function POST(request: NextRequest) {
  const response = await auth.handler(request);
  return addCorsHeaders(response);
}

export async function PUT(request: NextRequest) {
  const response = await auth.handler(request);
  return addCorsHeaders(response);
}

export async function DELETE(request: NextRequest) {
  const response = await auth.handler(request);
  return addCorsHeaders(response);
}

export async function PATCH(request: NextRequest) {
  const response = await auth.handler(request);
  return addCorsHeaders(response);
}

export async function HEAD(request: NextRequest) {
  const response = await auth.handler(request);
  return addCorsHeaders(response);
}

export async function OPTIONS() {
  // Handle preflight requests
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
