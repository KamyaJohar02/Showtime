import Image from 'next/image';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Booking: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [step, setStep] = useState<number>(1);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedCelebration, setSelectedCelebration] = useState<string | null>(null);
  const [selectedDecorations, setSelectedDecorations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDateChange = (date: Date | null) => {
    setStartDate(date);
    setStep(2);
  };

  const handleSlotSelection = (slot: string) => {
    setSelectedSlot(slot);
    setError(null);
  };

  const handleNextStep = () => {
    if (step === 2 && !selectedSlot) {
      setError('Please select a slot');
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

  const rooms = [
    { id: 'room1', name: 'Room 1', description: 'A cozy room with a 150 inch screen.' },
    { id: 'room2', name: 'Room 2', description: 'A spacious room with comfortable seating.' },
    { id: 'room3', name: 'Room 3', description: 'A luxurious room with premium sound.' },
  ];

  const celebrations = [
    { value: 'birthday', label: 'Birthday' },
    { value: 'anniversary', label: 'Anniversary' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'movienight', label: 'Movie Night' },
    { value: 'party', label: 'Party' },
  ];

  const decorations = [
    { value: 'balloons', label: 'Balloons', rate: 100, image: 'path/to/balloons.jpg' },
    { value: 'flowers', label: 'Flowers', rate: 150, image: 'path/to/flowers.jpg' },
    { value: 'candles', label: 'Candles', rate: 200, image: 'path/to/candles.jpg' },
    { value: 'fog', label: 'Fog', rate: 250, image: 'path/to/fog.jpg' },
  ];

  const renderCalendar = () => (
    <div className="flex flex-col justify-center items-center">
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        className="p-2 border border-gray-300 rounded bg-black text-white"
        calendarClassName="bg-black text-white"
        dayClassName={() => 'bg-black text-white'}
      />
    </div>
  );

  const renderSlots = () => (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-xl font-bold mb-4 text-red-500">Choose a Time Slot</h2>
      <div className="grid grid-cols-1 gap-2">
        {slots.map((slot, index) => (
          <button
            key={index}
            onClick={() => handleSlotSelection(slot.time)}
            className={`p-2 border rounded ${selectedSlot === slot.time ? 'bg-red-600' : 'bg-red-500 hover:bg-red-600'}`}
          >
            {slot.time}
          </button>
        ))}
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <div className="mt-4">
        <button
          className="p-2 border rounded bg-white text-black hover:bg-gray-200 mr-2"
          onClick={() => setStep(1)}
        >
          Back
        </button>
        <button
          className="p-2 border rounded bg-white text-black hover:bg-gray-200"
          onClick={handleNextStep}
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderRooms = () => (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-xl font-bold mb-4 text-red-500">Choose a Room</h2>
      <div className="flex flex-col gap-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => setSelectedRoom(room.id)}
            className={`p-4 border rounded ${selectedRoom === room.id ? 'bg-red-600' : 'bg-red-500 hover:bg-red-600'}`}
          >
            <h3 className="font-bold">{room.name}</h3>
            <p>{room.description}</p>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <button
          className="p-2 border rounded bg-white text-black hover:bg-gray-200 mr-2"
          onClick={() => setStep(2)}
        >
          Back
        </button>
        <button
          className="p-2 border rounded bg-white text-black hover:bg-gray-200"
          onClick={() => setStep(4)}
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderCelebrations = () => (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-xl font-bold mb-4 text-red-500">Choose a Celebration Type</h2>
      <div className="flex flex-col gap-4">
        {celebrations.map((celebration) => (
          <button
            key={celebration.value}
            onClick={() => setSelectedCelebration(celebration.value)}
            className={`p-2 border rounded ${selectedCelebration === celebration.value ? 'bg-red-600' : 'bg-red-500 hover:bg-red-600'}`}
          >
            {celebration.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <button
          className="p-2 border rounded bg-white text-black hover:bg-gray-200 mr-2"
          onClick={() => setStep(3)}
        >
          Back
        </button>
        <button
          className="p-2 border rounded bg-white text-black hover:bg-gray-200"
          onClick={() => setStep(5)}
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderDecorations = () => (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-xl font-bold mb-4 text-red-500">Choose Decorations</h2>
      <div className="flex flex-col gap-4">
        {decorations.map((decoration) => (
          <div key={decoration.value} className="flex items-center">
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
            <label htmlFor={decoration.value} className="flex items-center">
              <Image src={decoration.image} alt={decoration.label} className="w-12 h-12 object-cover mr-2" />
              <span>{decoration.label} - ₹{decoration.rate}</span>
            </label>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <button
          className="p-2 border rounded bg-white text-black hover:bg-gray-200 mr-2"
          onClick={() => setStep(4)}
        >
          Back
        </button>
        <button
          className="p-2 border rounded bg-white text-black hover:bg-gray-200"
          onClick={() => alert('Booking Complete')}
        >
          Finish
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative h-screen flex flex-col justify-center items-center bg-gray-800 text-white">
      <div className="p-4 max-w-md w-full bg-black shadow-lg rounded-lg">
        {step === 1 && renderCalendar()}
        {step === 2 && renderSlots()}
        {step === 3 && renderRooms()}
        {step === 4 && renderCelebrations()}
        {step === 5 && renderDecorations()}
      </div>
    </div>
  );
};

export default Booking;
