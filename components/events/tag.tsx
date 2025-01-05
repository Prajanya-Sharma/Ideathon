export default function Tag({ tag }: { tag: string }) {
  return (
    <div className="inline-block px-3 py-1 font-medium text-center text-gray-400 bg-gradient-to-br from-cyan-800 to-blue-700 rounded-md shadow-sm hover:shadow-md transition-all duration-300">
      {tag}
    </div>
  );
}
