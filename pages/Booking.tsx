import { useState } from 'react';
import Image from 'next/image';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import './Booking.css';
import Header from '@/components/Header';

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
    <div className="calendar-container">
      <div className="calendar">
        <div className="calendar-header">
          Select a Date
        </div>
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={handleDateChange}
          className="calendar-body"
        />
      </div>
    </div>
  );

  const handleRoomSelection = (roomId: string) => {
    setSelectedRoom(roomId);
    setError(null);
  };

  const renderSlots = () => (
    <div className="section-container">
      <h2 className="section-header">Choose a Time Slot</h2>
      <div className="grid-container">
        {slots.map((slot) => (
          <button
            key={slot.time}
            type="button"
            onClick={() => handleSlotSelection(slot.time)}
            className={`slot-button ${selectedSlot === slot.time ? 'selected' : ''}`}
          >
            {slot.time}
          </button>
        ))}
      </div>
      <div className="button-container">
        <button type="button" className="slot-button" onClick={() => setStep(1)}>Back</button>
        <button type="button" className="slot-button" onClick={handleNextStep}>Next</button>
      </div>
    </div>
  );
  const renderRooms = () => (
    <div className="section-container">
      <h2 className="section-header">Choose a Room</h2>
      <div className="grid-container">
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => handleRoomSelection(room.id)}
            className={`room-button ${selectedRoom === room.id ? 'selected' : ''}`}
          >
            {room.imageUrl && (
              <Image src={room.imageUrl} alt={room.name} width={150} height={100} className="rounded-md" />
            )}
            <h3 className="font-bold">{room.name}</h3>
            <p>{room.description}</p>
          </div>
        ))}
      </div>
      <div className="button-container">
        <button type="button" className="slot-button" onClick={() => setStep(2)}>Back</button>
        <button type="button" className="slot-button" onClick={handleNextStep} disabled={!selectedRoom}>Next</button>
      </div>
    </div>
  );

  const renderCelebrations = () => (
    <div className="section-container">
      <h2 className="section-header">Choose a Celebration Type</h2>
      <div className="grid-container">
        {celebrations.map((celebration) => (
          <button
            key={celebration.value}
            type="button"
            onClick={() => setSelectedCelebration(celebration.value)}
            className={`celebration-button ${selectedCelebration === celebration.value ? 'selected' : ''}`}
          >
            {celebration.label}
          </button>
        ))}
      </div>
      <div className="button-container">
        <button type="button" className="slot-button" onClick={() => setStep(3)}>Back</button>
        <button type="button" className="slot-button" onClick={() => setStep(5)}>Next</button>
      </div>
    </div>
  );
  const renderDecorations = () => (
    <div className="section-container">
      <h2 className="section-header">Choose Decorations</h2>
      <div className="grid-container">
        {decorations.map((decoration) => (
          <div key={decoration.value} className="decoration-item flex items-center">
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
                  width={48} 
                  height={48} 
                  className="w-12 h-12 object-cover mr-2" 
                />
              )}
              <span>{decoration.label} - ₹{decoration.rate}</span>
            </label>
          </div>
        ))}
      </div>
      <div className="button-container">
        <button type="button" className="slot-button" onClick={() => setStep(4)}>Back</button>
        <button type="button" className="slot-button" onClick={() => setStep(6)}>Next</button>
      </div>
    </div>
  ); 
  const renderSummary = () => (
    <div className="booking-summary-container">
      <h2 className="booking-summary-title">Booking Summary</h2>
      <p>Date: {selectedDate?.toLocaleDateString()}</p>
      <p>Time Slot: {selectedSlot}</p>
      <p>Room: {rooms.find(room => room.id === selectedRoom)?.name}</p>
      <p>Celebration Type: {selectedCelebration}</p>
      <p>Decorations: {selectedDecorations.join(', ')}</p>
      <div className="booking-summary-buttons">
        <button
          type="button"
          className="button"
          onClick={() => setStep(5)}
        >
          Back
        </button>
        <button
          type="button"
          className="button"
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
    <>
      <div className="min-h-screen flex flex-col justify-center items-center">
        {renderStep()}
      </div>
    </>
  );
};

export default Booking;