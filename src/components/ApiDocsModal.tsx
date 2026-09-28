import React, { useState } from 'react';
import { X, Terminal, Copy, Check, Code } from 'lucide-react';

interface ApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({ isOpen, onClose }) => {
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedPython, setCopiedPython] = useState(false);

  if (!isOpen) return null;

  const curlCode = `curl -X POST "https://deepguard.neuralvision.ai/api/v1/classify" \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -F "image=@target_face.jpg" \\
  -F "sensitivity=0.75"`;

  const pythonCode = `import requests

url = "https://deepguard.neuralvision.ai/api/v1/classify"
headers = {"Authorization": "Bearer YOUR_API_TOKEN"}
files = {"image": open("target_face.jpg", "rb")}
data = {"sensitivity": 0.75}

response = requests.post(url, headers=headers, files=files, data=data)
result = response.json()

print(f"Verdict: {result['predicted_class']} ({result['confidence']}%)")`;

  const copyToClipboard = (text: string, isPython = false) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (isPython) {
        setCopiedPython(true);
        setTimeout(() => setCopiedPython(false), 2000);
      } else {
        setCopiedCurl(true);
        setTimeout(() => setCopiedCurl(false), 2000);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 border border-cyan-500/30 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 sticky top-0 bg-[#0a0f1d]/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Inference API Documentation</h3>
              <p className="text-[10px] font-mono text-cyan-400">REST INFERENCE ENDPOINT v1.4</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <p className="text-slate-300 leading-relaxed">
            Integrate DeepGuard&apos;s real-time deepfake classification engine into your backend or pipeline with standard multipart form payloads.
          </p>

          {/* cURL Example */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between font-mono text-[11px] text-slate-400">
              <span>cURL Request</span>
              <button
                onClick={() => copyToClipboard(curlCode, false)}
                className="text-cyan-300 hover:text-cyan-200 flex items-center gap-1"
              >
                {copiedCurl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCurl ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-[11px] overflow-x-auto">
              {curlCode}
            </pre>
          </div>

          {/* Python Example */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between font-mono text-[11px] text-slate-400">
              <span>Python Integration (Requests)</span>
              <button
                onClick={() => copyToClipboard(pythonCode, true)}
                className="text-cyan-300 hover:text-cyan-200 flex items-center gap-1"
              >
                {copiedPython ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPython ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-indigo-300 font-mono text-[11px] overflow-x-auto">
              {pythonCode}
            </pre>
          </div>

          {/* Response Payload */}
          <div className="space-y-1.5">
            <div className="font-mono text-[11px] text-slate-400">JSON Response (HTTP 200 OK)</div>
            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] overflow-x-auto">
{`{
  "status": "success",
  "predicted_class": "fake",
  "confidence": 98.4,
  "probabilities": {
    "real": 0.016,
    "fake": 0.984
  },
  "forensic_breakdown": {
    "frequency_fft_anomaly": true,
    "eye_blink_synchrony": "unnatural",
    "skin_warping": "gaussian_edge",
    "exif_status": "stripped"
  },
  "latency_ms": 14.2
}`}
            </pre>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
