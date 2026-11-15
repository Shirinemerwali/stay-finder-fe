
import type { Booking, NewBooking } from "@/types/booking";

type CreateBookingInput = Omit<NewBooking, "user_id">;

type UpdateBookingInput = Partial<
  Pick<
    Booking,
    "guest_name" | "guest_email" | "check_in" | "check_out" | "guests" | "status"
  >
>;

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function createBooking(
  propertyId: string,
  booking: CreateBookingInput,
) {
  const response = await fetch(
    `${API_URL}/bookings/properties/${propertyId}`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("You need to log in to make a booking.");
    }
    if (response.status === 400) {
      throw new Error("Please check your booking details.");
    }
    throw new Error("Could not create booking.");
  }

  return response.json();
}

export async function getBookings(propertyId: string): Promise<Booking[]> {
  const response = await fetch(
    `${API_URL}/bookings/properties/${propertyId}`,
    { credentials: "include", cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Could not fetch bookings.");
  }

  return response.json();
}

export async function updateBooking(
  propertyId: string,
  bookingId: string,
  booking: UpdateBookingInput,
): Promise<Booking> {
  const response = await fetch(
    `${API_URL}/bookings/properties/${propertyId}/${bookingId}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    },
  );

  if (!response.ok) {
    throw new Error("Could not update booking.");
  }

  return response.json();
}

export async function deleteBooking(
  propertyId: string,
  bookingId: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/bookings/properties/${propertyId}/${bookingId}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Could not delete booking.");
  }
}
