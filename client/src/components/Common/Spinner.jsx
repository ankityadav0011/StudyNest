// components/Common/Spinner.jsx
export default function Spinner() {
  return (
    <div className="flex items-center justify-center h-full py-10">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent"></div>
    </div>
  );
}
