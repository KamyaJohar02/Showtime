"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const FormPage = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [numPeople, setNumPeople] = useState(2);
  const [selectedTheater, setSelectedTheater] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [selectedCake, setSelectedCake] = useState<any>(null);

  const router = useRouter();

  // Room configuration for people limit and extra pricing logic
  const roomConfig: Record<
    string,
    { maxPeople: number; extraChargeStartsAfter: number; extraChargePerPerson: number }
  > = {
    Sweet: { maxPeople: 6, extraChargeStartsAfter: 3, extraChargePerPerson: 500 },
    Galaxy: { maxPeople: 14, extraChargeStartsAfter: 4, extraChargePerPerson: 500 },
    Wonders: { maxPeople: 11, extraChargeStartsAfter: 4, extraChargePerPerson: 500 },
  };

  useEffect(() => {
    // Clear previous form data (safeguard)
    localStorage.removeItem("name");
    localStorage.removeItem("phoneNumber");
    localStorage.removeItem("email");
  
    // Reset people count and cake
    localStorage.removeItem("numPeople");
    localStorage.removeItem("selectedCake");
    setNumPeople(2);
    setSelectedCake(null);
  
    const storedTheater = JSON.parse(localStorage.getItem("selectedTheater") || "null");
    const storedSlot = JSON.parse(localStorage.getItem("selectedSlot") || "null");
  
    if (storedTheater) setSelectedTheater(storedTheater);
    if (storedSlot) setSelectedSlot(storedSlot);
  }, []);
  

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    localStorage.setItem("name", name);
    localStorage.setItem("phoneNumber", phoneNumber);
    localStorage.setItem("email", email);
    localStorage.setItem("numPeople", String(numPeople));

    router.push("/booking/occasion");
  };

  const getMaxPeopleLimit = () => {
    const config = roomConfig[selectedTheater?.name] || { maxPeople: 100 };
    return config.maxPeople;
  };

  const renderBookingSummary = () => {
    const theaterName = selectedTheater?.name || "";
    const config = roomConfig[theaterName] || {
      maxPeople: 100,
      extraChargeStartsAfter: 1000,
      extraChargePerPerson: 0,
    };

    const baseTheaterCost = selectedTheater?.price || 0;
    const extraPeopleCount = Math.max(numPeople - config.extraChargeStartsAfter, 0);
    const extraCost = extraPeopleCount * config.extraChargePerPerson;
    const finalTheaterCost = baseTheaterCost + extraCost;

    const cakeCost = selectedCake?.price || 0;
    const total = finalTheaterCost + cakeCost;
    const advance = 750;
    const due = total - advance;

    return (
      <div className="w-full md:w-1/3 bg-gray-100 p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-2">Booking summary</h3>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span>{theaterName || "Room"}</span>
            <span>₹ {finalTheaterCost}</span>
          </div>

          {selectedSlot && (
            <div className="flex justify-between">
              <span>Time Slot</span>
              <span>{selectedSlot.time}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Number of People</span>
            <span>{numPeople}</span>
          </div>

          {selectedCake && (
            <div className="flex justify-between">
              <span>{selectedCake.name}</span>
              <span>₹ {cakeCost}</span>
            </div>
          )}

          <div className="flex justify-between border-t mt-2 pt-2 font-medium">
            <span>Subtotal</span>
            <span>₹ {total}</span>
          </div>

          <div className="mt-4 font-semibold">Advance amount payable</div>
          <div className="flex justify-between">
            <span>₹ {advance}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Balance amount</span>
            <span>₹ {due}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">(Payable at the venue)</div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      <div className="w-full md:w-2/3">
        <h2 className="text-2xl font-bold mb-6">Enter Your Details</h2>
        <form className="bg-white p-6 rounded-lg shadow" onSubmit={handleNext}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Whatsapp Number *</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Email ID *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Number of People *</label>
            <input
              type="number"
              value={numPeople}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                const maxLimit = getMaxPeopleLimit();
                if (newValue <= maxLimit) {
                  setNumPeople(newValue);
                }
              }}
              className="w-full border p-2 rounded"
              min={1}
              max={getMaxPeopleLimit()}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Max allowed: {getMaxPeopleLimit()} for this room
            </p>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("selectedCake");
                router.back();
              }}
              className="bg-gray-300 text-black py-2 px-6 rounded"
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-red-700 text-white py-2 px-6 rounded"
            >
              Next
            </button>
          </div>
        </form>
      </div>

      {renderBookingSummary()}
    </div>
  );
};

export default FormPage;
