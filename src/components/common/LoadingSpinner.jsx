export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-28 h-28 border-[10px] border-gray-900/80 border-t-transparent rounded-full animate-spin 
                       [animation-duration:1.2s] ease-[cubic-bezier(0.65,0.05,0.36,1)]"></div>
        <span className="text-gray-700 text-lg font-medium tracking-wider">Loading...</span>
      </div>
    </div>
  );
}
