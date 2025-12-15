import { Link } from "react-router-dom";

const SiderLogo = () => {
  return (
    <div className="h-17 flex justify-between items-center p-4 md:h-22.5 py-5">
      <Link className="flex items-center relative overflow-hidden" to={"/"}>
        <img src="/vite.svg" alt="logo" className="w-12 h-12" width={48} height={48} />
        <span className="mx-4 my-0 font-bold text-lg text-white">Admin Panel</span>
      </Link>
    </div>
  );
};

export default SiderLogo;
