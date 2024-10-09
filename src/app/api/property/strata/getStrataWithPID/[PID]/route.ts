import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  req: NextRequest,
  { params } : { params: { PID: string } }
) {
  console.log(`GET /api/property/strata/getStrataWithPID/${params.PID}`);
  const pid = params.PID;
  if (!pid) {
    return new NextResponse("PID is required", { status: 400 });
  }

  try {
    const apiUrl = `${process.env.API_GATEWAY_URL_PROD}/strata/getStrata?PID=${pid}`;
    const { data } = await axios.get(apiUrl);
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = status === 500 ? "Internal Server Error" : error.response?.data?.message || "An error occurred";
      return new NextResponse(message, { status });
    } else {
      return new NextResponse("An unexpected error occurred", { status: 500 });
    }
  }
}