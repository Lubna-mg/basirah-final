import { useRef, useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";

export default function DoctorVideoRecorder() {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;

    let chunks = [];
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => chunks.push(e.data);

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      setVideoURL(url);
      chunks = [];
    };

    recorder.start();
    setRecording(true);
  }

  function stopRecording() {
    mediaRecorderRef.current.stop();
    setRecording(false);
  }

  return (
    <DoctorLayout>
      <div className="max-w-3xl mx-auto p-6 text-center">

        <h1 className="text-3xl font-bold text-[#0A2A43] mb-6">
          تسجيل فيديو التتبع
        </h1>

        <video ref={videoRef} autoPlay className="w-full rounded"></video>

        <div className="mt-6 flex justify-center gap-4">
          {!recording && (
            <button
              onClick={startRecording}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              بدء التسجيل
            </button>
          )}

          {recording && (
            <button
              onClick={stopRecording}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
            >
              إيقاف
            </button>
          )}
        </div>

        {videoURL && (
          <div className="mt-8">
            <h2 className="font-bold text-xl mb-4">الفيديو المسجل:</h2>
            <video src={videoURL} controls className="w-full rounded shadow"></video>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}
