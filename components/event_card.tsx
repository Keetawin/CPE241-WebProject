type Props = {
  img: string;
  eventName: string;
  location: string;
  eventDate: string;
};

export default function EventCard({
  img,
  eventName,
  location,
  eventDate,
}: Props) {
  return (
    <main>
      <div className="border border-gray-300 rounded-lg shadow-sm">
        <div className="relative h-[300px]">
          <img
            className="w-full h-full object-cover object-center rounded-t-lg aspect-w-4 aspect-h-3"
            src={img}
            alt="Placeholder"
          />
        </div>
        <div className="p-4">
          <div className="text-red-600 mb-1 font-semibold">{eventDate}</div>
          <h3 className="text-lg font-bold relative z-10">{eventName}</h3>
          <p className="text-gray-600 mb-4">{location}</p>
        </div>
      </div>
    </main>
  );
}
