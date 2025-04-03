import loaderImage from "./loader.webp";

const Loader = () => {
  return (
    <div className="flex flex-col space-y-4 h-screen justify-center items-center bg-black text-white font-mono font-bold px-4">
      <img src={loaderImage} alt="Loading..." className="w-20" />
    </div>
  );
};

export default Loader;
