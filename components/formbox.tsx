export default function Frombox(props: { label: any; }) {
    const { label } = props
  return (
    <div className="flex flex-col">
        <label htmlFor="judul" className="text-black font-medium mt-1 sm:mt-5 text-lg sm:text-md" >
            {label}
        </label>
        <input
        name="judul"
        type="text"
        className="
                        w-[80%]
                        h-4
                        sm:h-9
                        rounded
                        border-2 border-gray-300
                        focus:border-[#E90064]
                    "
        />
    </div>
  );
}