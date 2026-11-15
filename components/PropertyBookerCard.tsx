
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import type { Booking, BookingDates } from "@/types/booking";
import type { Property } from "@/types/property";
import { useAuth } from "@/contexts/auth";
import {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking,
} from "@/utils/bookingService";
import BookingPicker from "./BookingPicker";

type PropertyBookerCardProps = {
  property: Property;
};

export default function PropertyBookerCard({
  property,
}: PropertyBookerCardProps) {
  const { user, isPending } = useAuth();
  const [bookingDates, setBookingDates] = useState<BookingDates>();
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guests, setGuests] = useState(1);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editCheckIn, setEditCheckIn] = useState("");
  const [editCheckOut, setEditCheckOut] = useState("");
  const [editGuests, setEditGuests] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nights = bookingDates
    ? Math.round(
        (new Date(`${bookingDates.check_out}T00:00:00`).getTime() -
          new Date(`${bookingDates.check_in}T00:00:00`).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : 0;

  const totalPrice = nights * property.price_per_night;

  useEffect(() => {
    if (!user) {
      setBookings([]);
      return;
    }

    let active = true;

    getBookings(property.property_id)
      .then((data) => {
        if (active) setBookings(data);
      })
      .catch(() => {
        if (active) setError("Could not load bookings.");
      });

    return () => {
      active = false;
    };
  }, [user, property.property_id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!bookingDates || nights <= 0) {
      setError("Please select valid check-in and check-out dates.");
      return;
    }

    if (guests < 1 || guests > property.max_guests) {
      setError(`Choose between 1 and ${property.max_guests} guests.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const booking = await createBooking(property.property_id, {
        property_id: property.property_id,
        guest_name: guestName,
        guest_email: guestEmail,
        check_in: bookingDates.check_in,
        check_out: bookingDates.check_out,
        guests,
        status: "pending",
      });

      setBookings((current) => [...current, booking]);
      setSuccess("Your booking was created successfully!");
      setGuestName("");
      setGuestEmail("");
      setGuests(1);
      setBookingDates(undefined);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create booking.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEditing(booking: Booking) {
    setEditingId(booking.booking_id);
    setEditName(booking.guest_name);
    setEditEmail(booking.guest_email);
    setEditCheckIn(booking.check_in);
    setEditCheckOut(booking.check_out);
    setEditGuests(booking.guests);
    setError("");
    setSuccess("");
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingId) return;

    if (editCheckIn >= editCheckOut) {
      setError("Check-out must be later than check-in.");
      return;
    }

    if (editGuests < 1 || editGuests > property.max_guests) {
      setError(`Choose between 1 and ${property.max_guests} guests.`);
      return;
    }

    setError("");
    setSuccess("");

    try {
      const updated = await updateBooking(property.property_id, editingId, {
        guest_name: editName,
        guest_email: editEmail,
        check_in: editCheckIn,
        check_out: editCheckOut,
        guests: editGuests,
      });

      setBookings((current) =>
        current.map((booking) =>
          booking.booking_id === editingId ? updated : booking,
        ),
      );

      setEditingId(null);
      setSuccess("Booking updated successfully!");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update booking.");
    }
  }

  async function handleDelete(bookingId: string) {
    setError("");
    setSuccess("");

    try {
      await deleteBooking(property.property_id, bookingId);
      setBookings((current) =>
        current.filter((booking) => booking.booking_id !== bookingId),
      );
      setSuccess("Booking deleted successfully!");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete booking.");
    }
  }

  return (
    <div className="block rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600">
      <h2 className="mb-4 text-xl font-semibold">Book this stay</h2>

      <BookingPicker
        initialDates={bookingDates}
        selectDates={setBookingDates}
      />

      {bookingDates && nights > 0 && (
        <div className="mt-4 rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
          <p>{nights} nights</p>
          <p>
            Total price: <strong>{totalPrice} kr</strong>
          </p>
        </div>
      )}

      {isPending ? (
        <p className="mt-4">Checking login...</p>
      ) : !user ? (
        <div className="mt-4">
          <p>You need to log in to book this stay.</p>
          <Link
            href="/auth/login"
            className="mt-2 inline-block rounded-lg bg-black px-4 py-2 text-white"
          >
            Log in
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="guestName" className="mb-1 block">
                Full name
              </label>
              <input
                id="guestName"
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                minLength={2}
                required
                className="w-full rounded-lg border border-zinc-300 p-2 dark:bg-zinc-900"
              />
            </div>

            <div>
              <label htmlFor="guestEmail" className="mb-1 block">
                Email
              </label>
              <input
                id="guestEmail"
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-300 p-2 dark:bg-zinc-900"
              />
            </div>

            <div>
              <label htmlFor="guests" className="mb-1 block">
                Number of guests
              </label>
              <input
                id="guests"
                type="number"
                min={1}
                max={property.max_guests}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                required
                className="w-full rounded-lg border border-zinc-300 p-2 dark:bg-zinc-900"
              />
              <p className="mt-1 text-sm text-zinc-500">
                Maximum {property.max_guests} guests
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-black px-4 py-3 text-white disabled:opacity-50"
            >
              {isSubmitting ? "Booking..." : "Book now"}
            </button>
          </form>

          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold">Your bookings</h2>

            {bookings.length === 0 ? (
              <p>You have no bookings for this stay.</p>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.booking_id}
                    className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
                  >
                    {editingId === booking.booking_id ? (
                      <form onSubmit={handleUpdate} className="space-y-3">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          required
                          minLength={2}
                          aria-label="Guest name"
                          className="w-full rounded-lg border p-2 dark:bg-zinc-900"
                        />
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          required
                          aria-label="Guest email"
                          className="w-full rounded-lg border p-2 dark:bg-zinc-900"
                        />
                        <label className="block">
                          Check-in
                          <input
                            type="date"
                            value={editCheckIn}
                            onChange={(e) => setEditCheckIn(e.target.value)}
                            required
                            className="w-full rounded-lg border p-2 dark:bg-zinc-900"
                          />
                        </label>
                        <label className="block">
                          Check-out
                          <input
                            type="date"
                            value={editCheckOut}
                            onChange={(e) => setEditCheckOut(e.target.value)}
                            required
                            className="w-full rounded-lg border p-2 dark:bg-zinc-900"
                          />
                        </label>
                        <label className="block">
                          Guests
                          <input
                            type="number"
                            min={1}
                            max={property.max_guests}
                            value={editGuests}
                            onChange={(e) =>
                              setEditGuests(Number(e.target.value))
                            }
                            required
                            className="w-full rounded-lg border p-2 dark:bg-zinc-900"
                          />
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="rounded-lg bg-black px-4 py-2 text-white"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="rounded-lg border px-4 py-2"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <p className="font-semibold">{booking.guest_name}</p>
                        <p>{booking.guest_email}</p>
                        <p>
                          {booking.check_in} – {booking.check_out}
                        </p>
                        <p>{booking.guests} guests</p>
                        <p>Status: {booking.status}</p>
                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => startEditing(booking)}
                            className="rounded-lg bg-black px-4 py-2 text-white"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(booking.booking_id)}
                            className="rounded-lg border border-red-500 px-4 py-2 text-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {error && <p className="mt-4 text-red-600">{error}</p>}
      {success && <p className="mt-4 text-green-600">{success}</p>}
    </div>
  );
}
