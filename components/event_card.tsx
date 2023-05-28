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
  let date = eventDate.split(" ")
  let day = date[0]
  let month = date[1]
  let year = date[2]
  return (
    <main>
      <div className="shadow-lg rounded-lg min-h-[425px] w-[300px] overflow-hidden ">
        <div className="relative h-[250px]">
          {img && 
            <img
              className="w-full h-full object-cover object-center rounded-t-lg aspect-w-4 aspect-h-3"
              src={img}
              alt="Placeholder"
            />
          }
          {
            !img &&
            <div className="flex w-full h-full bg-gradient-to-r from-[#b7175c] to-[#E90064] justify-center items-center text-center rounded-t-lg">
              <h1 className="text-white font-bold text-4xl rotate-[-12deg] skew-x-12">
                {eventName}
              </h1>
            </div>
          }
        </div>
        <div className="p-4 flex">
          <div className="flex flex-col justify-center items-center mx-3">
            <h4 className="font-medium text-[#3D37F1]">{month}</h4>
            <h3 className="text-3xl font-semibold">{day}</h3>
            <h3 className="text-sm">{year}</h3>
          </div>
          <div className="">
            <h3 className="text-lg font-bold relative z-10">{eventName}</h3>
            <p className="text-gray-600 text-sm ">{location}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
