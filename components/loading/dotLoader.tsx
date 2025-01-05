export default function DotsLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-cyan-400 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-cyan-400 rounded-full animate-bounce delay-200"></div>
        <div className="w-4 h-4 bg-cyan-400 rounded-full animate-bounce delay-400"></div>
      </div>
    </div>
  );
};

