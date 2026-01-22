import { HiBell, HiMagnifyingGlass } from "react-icons/hi2";

export default function CenterTopbar({ title }) {
  return (
    <header className="h-[86px] bg-white border-b border-gray-200 flex items-center px-8">
      <div className="flex-1 flex items-center gap-4">
        {/* Search */}
        <div className="relative w-[420px] max-w-full">
          <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
            <HiMagnifyingGlass className="text-xl" />
          </span>
          <input
            className="w-full h-[44px] rounded-xl border border-gray-200 bg-gray-50 pr-10 pl-4 outline-none focus:border-gray-300"
            placeholder="بحث..."
          />
        </div>

        {/* Bell */}
        <button className="h-[44px] w-[44px] rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition">
          <HiBell className="text-2xl text-slate-700" />
        </button>
      </div>

      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-800">
            {title || "أهلاً بك"}
          </div>
        </div>
      </div>
    </header>
  );
}
