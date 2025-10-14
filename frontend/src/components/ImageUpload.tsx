import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface ImageUploadProps {
  user: any;
  onUploadComplete: () => void;
}

interface UploadResponse {
  success: boolean;
  data?: {
    id: string;
    screenTime: string;
    totalMinutes: number;
    date: string;
    extractedData?: {
      unlocks?: number;
      notifications?: number;
      apps?: string[];
      screenOn?: { formatted: string };
      screenOff?: { formatted: string };
    };
  };
  error?: string;
}

export default function ImageUpload({
  user,
  onUploadComplete,
}: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [extractedData, setExtractedData] = useState<any>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus({ type: null, message: "" });
      setExtractedData(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus({
        type: "error",
        message: "Please select an image first",
      });
      return;
    }

    setUploading(true);
    setUploadStatus({ type: null, message: "" });

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("userId", user.id);
      formData.append("date", new Date().toISOString());

      const response = await fetch(
        "http://localhost:5000/api/uploads/extract",
        {
          method: "POST",
          body: formData,
        }
      );

      const result: UploadResponse = await response.json();

      if (result.success && result.data) {
        setUploadStatus({
          type: "success",
          message: `Screen time extracted: ${result.data.screenTime}`,
        });
        setExtractedData(result.data.extractedData);

        // Update localStorage
        const storedUser = JSON.parse(
          localStorage.getItem("digitalDetoxUser") || "{}"
        );

        if (storedUser.id === user.id) {
          const newUpload = {
            id: result.data.id,
            date: result.data.date,
            screenTime: result.data.totalMinutes / 60, // Convert to hours
          };

          storedUser.uploads = storedUser.uploads || [];
          storedUser.uploads.push(newUpload);

          localStorage.setItem("digitalDetoxUser", JSON.stringify(storedUser));
        }

        // Call parent callback to refresh dashboard
        if (onUploadComplete && typeof onUploadComplete === "function") {
          onUploadComplete();
        }

        // Reset form after 3 seconds
        setTimeout(() => {
          setSelectedFile(null);
          setPreview(null);
          setExtractedData(null);
          setUploadStatus({ type: null, message: "" });
        }, 3000);
      } else {
        setUploadStatus({
          type: "error",
          message: result.error || "Failed to extract screen time from image",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus({
        type: "error",
        message: "Failed to upload image. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="shadow-xl hover:shadow-2xl transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Screen Time Report
        </CardTitle>
        <CardDescription>
          Upload a screenshot of your screen time to track your progress
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Input */}
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            disabled={uploading}
          />
          <label
            htmlFor="file-upload"
            className={`
              flex flex-col items-center justify-center w-full h-48 
              border-2 border-dashed rounded-lg cursor-pointer 
              transition-all duration-200
              ${
                preview
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 bg-gray-50 hover:bg-gray-100"
              }
              ${uploading ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {preview ? (
              <div className="relative w-full h-full p-2">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain rounded"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, WEBP (MAX. 10MB)
                </p>
              </div>
            )}
          </label>
        </div>

        {/* Upload Button */}
        <motion.button
          whileHover={{ scale: selectedFile && !uploading ? 1.02 : 1 }}
          whileTap={{ scale: selectedFile && !uploading ? 0.98 : 1 }}
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className={`
            w-full py-3 px-4 rounded-lg font-medium transition-all
            flex items-center justify-center gap-2
            ${
              selectedFile && !uploading
                ? "bg-green-600 hover:bg-green-700 text-white shadow-md"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Upload & Extract Screen Time
            </>
          )}
        </motion.button>

        <AnimatePresence>
          {uploadStatus.type && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`
                p-4 rounded-lg flex items-start gap-3
                ${
                  uploadStatus.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }
              `}
            >
              {uploadStatus.type === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-medium">{uploadStatus.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-xs text-gray-500 space-y-1 pt-2 border-t">
          <p className="font-medium">Tips for best results:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-2">
            <li>Use a clear, high-resolution screenshot</li>
            <li>Ensure screen time text is visible and not cropped</li>
            <li>Avoid blurry or low-light images</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
