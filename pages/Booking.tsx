import { useState } from 'react';
import Image from 'next/image'; // Assuming you're using Next.js for Image component
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import './Booking.css';

interface Room {
  id: string;
  name: string;
  description: string;
  imageUrl?: string; // Make imageUrl optional if it can be undefined
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
    <div className="flex justify-center items-center fixed top-4 left-0 right-0 z-50">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={handleDateChange}
        className="bg-black text-white"
      />
    </div>
  );

  const handleRoomSelection = (roomId: string) => {
    setSelectedRoom(roomId);
    setError(null);
  };

  const renderSlots = () => (
    <div className="flex flex-col justify-center items-center px-4 md:px-8">
      <h2 className="text-xl font-bold mb-4 text-red-500">Choose a Time Slot</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {slots.map((slot) => (
          <button
            key={slot.time}
            type="button"
            onClick={() => handleSlotSelection(slot.time)}
            className={`p-2 border rounded ${selectedSlot === slot.time ? 'bg-red-600' : 'bg-red-500 hover:bg-red-600'}`}
          >
            {slot.time}
          </button>
        ))}
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          className="p-2 border rounded-full bg-black text-white hover:bg-red-200 mr-12"
          onClick={() => setStep(1)}
        >
          Back
        </button>
        <button
          type="button"
          className="p-2 border rounded bg-white text-black hover:bg-gray-200"
          onClick={handleNextStep}
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderRooms = () => (
    <div className="flex flex-col justify-center items-center px-4 md:px-8">
      <h2 className="text-xl font-bold mb-4 text-red-500">Choose a Room</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {rooms.map((room) => (
          <div
          key={room.id}
          onClick={() => handleRoomSelection(room.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleRoomSelection(room.id);
            }
          }}
          role="button"
          tabIndex={0}
          className={`p-4 border rounded cursor-pointer ${selectedRoom === room.id ? 'bg-red-600' : 'bg-red-500 hover:bg-red-600'}`}
          style={{ maxWidth: '300px' }}
        >
        
            <div className="flex items-center justify-center mb-2">
              {room.imageUrl && (
                <Image src={room.imageUrl} alt={room.name} width={150} height={100} className="rounded-md" />
              )}
            </div>
            <h3 className="font-bold text-center">{room.name}</h3>
            <p className="text-center">{room.description}</p>
          </div>
        ))}
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          className="p-2 border rounded bg-white text-black hover:bg-gray-200 mr-2"
          onClick={() => setStep(2)}
        >
          Back
        </button>
        <button
          type="button"
          className="p-2 border rounded bg-white text-black hover:bg-gray-200"
          onClick={handleNextStep}
          disabled={!selectedRoom}
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
            type="button"
            onClick={() => setSelectedCelebration(celebration.value)}
            className={`p-2 border rounded ${selectedCelebration === celebration.value ? 'bg-red-600' : 'bg-red-500 hover:bg-red-600'}`}
          >
            {celebration.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <button
          type="button"
          className="p-2 border rounded bg-white text-black hover:bg-gray-200 mr-2"
          onClick={() => setStep(3)}
        >
          Back
        </button>
        <button
          type="button"
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
              {decoration.image && (
                <Image 
                  src={decoration.image} 
                  alt={decoration.label} 
                  width={100} 
                  height={100} 
                  className="w-12 h-12 object-cover mr-2" 
                />
              )}
              <span>{decoration.label} - ₹{decoration.rate}</span>
            </label>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <button
          type="button"
          className="p-2 border rounded bg-white text-black hover:bg-gray-200 mr-2"
          onClick={() => setStep(4)}
        >
          Back
        </button>
        <button
          type="button"
          className="p-2 border rounded bg-white text-black hover:bg-gray-200"
          onClick={() => setStep(6)}
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-xl font-bold mb-4 text-red-500">Booking Summary</h2>
      <p>Date: {selectedDate?.toLocaleDateString()}</p>
      <p>Time Slot: {selectedSlot}</p>
      <p>Room: {rooms.find(room => room.id === selectedRoom)?.name}</p>
      <p>Celebration Type: {selectedCelebration}</p>
      <p>Decorations: {selectedDecorations.join(', ')}</p>
      <div className="mt-4">
        <button
          type="button"
          className="p-2 border rounded bg-white text-black hover:bg-gray-200 mr-2"
          onClick={() => setStep(5)}
        >
          Back
        </button>
        <button
          type="button"
          className="p-2 border rounded bg-white text-black hover:bg-gray-200"
          onClick={() => alert('Booking confirmed!')}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return renderCalendar();
      case 2:
        return renderSlots();
      case 3:
        return renderRooms();
      case 4:
        return renderCelebrations();
      case 5:
        return renderDecorations();
      case 6:
        return renderSummary();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      {renderStep()}
    </div>
  );
};

export default Booking;
