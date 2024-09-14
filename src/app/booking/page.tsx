"use client";

import { useState } from 'react';
import Image from 'next/image';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface Room {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

const Booking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [step, setStep] = useState<number>(1);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedCelebration, setSelectedCelebration] = useState<string | null>(null);
  const [selectedDecorations, setSelectedDecorations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedRoom(null); // Reset selected room when date changes
    setStep(2);
  };

  const handleSlotSelection = (slot: string) => {
    setSelectedSlot(slot);
    setError(null);
  };

  const handleNextStep = () => {
    if (step === 2 && !selectedSlot) {
      setError('Please select a slot');
    } else if (step === 3 && !selectedRoom) {
      setError('Please select a room');
    } else {
      setStep(step + 1);
      setError(null);
    }
  };

  const slots = [
    { time: '10:00 AM - 12:00 PM', available: true },
    { time: '12:00 PM - 02:00 PM', available: true },
    { time: '02:00 PM - 04:00 PM', available: true },
    { time: '04:00 PM - 06:00 PM', available: true },
    { time: '06:00 PM - 08:00 PM', available: true },
  ];

  const rooms: Room[] = [
    { id: 'room1', name: 'Room 1', description: 'A cozy room with a 150 inch screen.', imageUrl: '/Images/Room1.jpg' },
    { id: 'room2', name: 'Room 2', description: 'A spacious room with comfortable seating.', imageUrl: '/Images/Room2.jpg' },
    { id: 'room3', name: 'Room 3', description: 'A luxurious room with premium sound.', imageUrl: '/Images/Room3.jpg' },
  ];

  const celebrations = [
    { value: 'birthday', label: 'Birthday' },
    { value: 'anniversary', label: 'Anniversary' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'movienight', label: 'Movie Night' },
    { value: 'party', label: 'Party' },
  ];

  const decorations = [
    { value: 'balloons', label: 'Balloons', rate: 100, image: '/Images/balloons.jpg' },
    { value: 'flowers', label: 'Flowers', rate: 150, image: '/Images/flowers.jpeg' },
    { value: 'candles', label: 'Candles', rate: 200, image: '/Images/candles.jpg' },
    { value: 'fog', label: 'Fog', rate: 250, image: '/Images/smoke.jpg' },
  ];

  const renderCalendar = () => (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-md w-full">
        <div className="bg-red-500 text-white p-2 text-center text-lg font-bold rounded-t-lg">
          Select a Date
        </div>
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={handleDateChange}
          className="bg-gray-100 grid grid-cols-7 gap-1 p-2 rounded-b-lg"
        />
      </div>
    </div>
  );

  const handleRoomSelection = (roomId: string) => {
    setSelectedRoom(roomId);
    setError(null);
  };

  const renderSlots = () => (
    <div className="flex flex-col items-center min-h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Choose a Time Slot</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {slots.map((slot) => (
          <button
            key={slot.time}
            type="button"
            onClick={() => handleSlotSelection(slot.time)}
            className={`p-4 border rounded-lg ${selectedSlot === slot.time ? 'bg-red-500 text-white' : 'bg-white text-black'} ${!slot.available ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-200'}`}
            disabled={!slot.available}
          >
            {slot.time}
          </button>
        ))}
      </div>
      <div className="flex gap-4">
        <button type="button" className="p-2 border rounded bg-gray-200" onClick={() => setStep(1)}>Back</button>
        <button type="button" className="p-2 border rounded bg-red-500 text-white" onClick={handleNextStep}>Next</button>
      </div>
    </div>
  );

  const renderRooms = () => (
    <div className="flex flex-col items-center min-h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Choose a Room</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => handleRoomSelection(room.id)}
            className={`p-4 border rounded-lg cursor-pointer ${selectedRoom === room.id ? 'border-red-500 bg-red-100' : 'border-gray-300 hover:bg-gray-100'} text-center`}
          >
            {room.imageUrl && (
              <Image src={room.imageUrl} alt={room.name} width={150} height={100} className="rounded-md mb-2 object-cover" />
            )}
            <h3 className="font-bold mb-1">{room.name}</h3>
            <p>{room.description}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <button type="button" className="p-2 border rounded bg-gray-200" onClick={() => setStep(2)}>Back</button>
        <button type="button" className="p-2 border rounded bg-red-500 text-white" onClick={handleNextStep} disabled={!selectedRoom}>Next</button>
      </div>
    </div>
  );

  const renderCelebrations = () => (
    <div className="flex flex-col items-center min-h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Choose a Celebration Type</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {celebrations.map((celebration) => (
          <button
            key={celebration.value}
            type="button"
            onClick={() => setSelectedCelebration(celebration.value)}
            className={`p-4 border rounded-lg ${selectedCelebration === celebration.value ? 'bg-red-500 text-white' : 'bg-white text-black'} cursor-pointer hover:bg-gray-200`}
          >
            {celebration.label}
          </button>
        ))}
      </div>
      <div className="flex gap-4">
        <button type="button" className="p-2 border rounded bg-gray-200" onClick={() => setStep(3)}>Back</button>
        <button type="button" className="p-2 border rounded bg-red-500 text-white" onClick={() => setStep(5)}>Next</button>
      </div>
    </div>
  );

  const renderDecorations = () => (
    <div className="flex flex-col items-center min-h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Choose Decorations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {decorations.map((decoration) => (
          <div key={decoration.value} className="flex items-center p-4 border rounded-lg">
            <input
              type="checkbox"
              id={decoration.value}
              value={decoration.value}
              checked={selectedDecorations.includes(decoration.value)}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedDecorations((prev) =>
                  prev.includes(value)
                    ? prev.filter((d) => d !== value)
                    : [...prev, value]
                );
              }}
              className="mr-2"
            />
            <label htmlFor={decoration.value} className="flex items-center cursor-pointer">
              {decoration.image && (
                <Image src={decoration.image} alt={decoration.label} width={50} height={50} className="rounded-md mr-2" />
              )}
              <div>
                <div className="font-bold">{decoration.label}</div>
                <div>₹{decoration.rate}</div>
              </div>
            </label>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <button type="button" className="p-2 border rounded bg-gray-200" onClick={() => setStep(4)}>Back</button>
        <button type="button" className="p-2 border rounded bg-red-500 text-white" onClick={() => setStep(6)}>Next</button>
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="flex flex-col items-center min-h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
      <div className="bg-white p-4 border rounded-lg shadow-lg">
        <p><strong>Date:</strong> {selectedDate?.toLocaleDateString()}</p>
        <p><strong>Time Slot:</strong> {selectedSlot}</p>
        <p><strong>Room:</strong> {rooms.find(room => room.id === selectedRoom)?.name}</p>
        <p><strong>Celebration:</strong> {celebrations.find(c => c.value === selectedCelebration)?.label}</p>
        <p><strong>Decorations:</strong> {selectedDecorations.map(dec => decorations.find(d => d.value === dec)?.label).join(', ')}</p>
      </div>
      <div className="flex gap-4 mt-4">
        <button type="button" className="p-2 border rounded bg-gray-200" onClick={() => setStep(5)}>Back</button>
        <button type="button" className="p-2 border rounded bg-red-500 text-white">Confirm Booking</button>
      </div>
    </div>
  );

  return (
    <div>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {step === 1 && renderCalendar()}
      {step === 2 && renderSlots()}
      {step === 3 && renderRooms()}
      {step === 4 && renderCelebrations()}
      {step === 5 && renderDecorations()}
      {step === 6 && renderSummary()}
    </div>
  );
};

export default Booking;
