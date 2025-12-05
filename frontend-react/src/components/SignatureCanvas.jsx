import { useRef, useEffect } from "react";

export default function SignatureCanvas({ signatureData, setSignatureData, resetTrigger }) {
  const canvasRef = useRef();
  let isDrawing = false;

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDrawing = (e) => {
    isDrawing = true;
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      isDrawing = false;
      const dataURL = canvasRef.current.toDataURL("image/png");
      setSignatureData(dataURL);
    }
  };

  // Initialize canvas style
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  // Reset canvas when resetTrigger changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignatureData("");
    }
  }, [resetTrigger, setSignatureData]);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Electronic Signature</label>
      <div className="border-4 border-indigo-400 rounded-xl bg-white p-2 mb-2 shadow-inner">
        <canvas
          ref={canvasRef}
          width={600}
          height={200}
          className="w-full h-40 rounded border border-gray-200 cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        ></canvas>
      </div>
      <button
        type="button"
        className="px-3 py-1.5 bg-red-500 text-white rounded-lg"
        onClick={() => {
          const canvas = canvasRef.current;
          canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
          setSignatureData("");
        }}
      >
        Clear Signature
      </button>
    </div>
  );
}
