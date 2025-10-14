import { useState, useRef } from "react";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Upload, X, Calendar, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  user: any;
  onUploadComplete: () => void;
}

export default function ImageUpload({ user }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadDate, setUploadDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [screenTime, setScreenTime] = useState("");
  const [uploads, setUploads] = useState<any[]>(() => {
    const users = JSON.parse(localStorage.getItem("digitalDetoxUsers") || "[]");
    const currentUser = users.find((u: any) => u.id === user.id);
    return currentUser?.uploads || [];
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("File size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !screenTime) {
      toast.error("Please select an image and enter screen time");
      return;
    }

    // Check if already uploaded for this date
    if (uploads.some((u) => u.date === uploadDate)) {
      toast.error("You have already uploaded a report for this date");
      return;
    }

    const newUpload = {
      id: Date.now().toString(),
      date: uploadDate,
      screenTime: parseFloat(screenTime),
      imageUrl: previewUrl,
      fileName: selectedFile.name,
      uploadedAt: new Date().toISOString(),
    };

    const updatedUploads = [...uploads, newUpload];
    setUploads(updatedUploads);

    // Update localStorage
    const users = JSON.parse(localStorage.getItem("digitalDetoxUsers") || "[]");
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex].uploads = updatedUploads;
      localStorage.setItem("digitalDetoxUsers", JSON.stringify(users));
      localStorage.setItem(
        "digitalDetoxUser",
        JSON.stringify(users[userIndex])
      );
    }

    toast.success("Screen time report uploaded successfully!");

    // Reset form
    setSelectedFile(null);
    setPreviewUrl(null);
    setScreenTime("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteUpload = (uploadId: string) => {
    const updatedUploads = uploads.filter((u) => u.id !== uploadId);
    setUploads(updatedUploads);

    // Update localStorage
    const users = JSON.parse(localStorage.getItem("digitalDetoxUsers") || "[]");
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex].uploads = updatedUploads;
      localStorage.setItem("digitalDetoxUsers", JSON.stringify(users));
      localStorage.setItem(
        "digitalDetoxUser",
        JSON.stringify(users[userIndex])
      );
    }

    toast.success("Upload deleted successfully");
  };

  return (
    <div className="space-y-6">
      {/* Instructions Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02, y: -5 }}
        className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
      >
        <h3 className="text-blue-900 mb-3 flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Upload className="w-5 h-5" />
          </motion.div>
          How to Upload Your Screen Time Report
        </h3>
        <div className="space-y-2 text-sm text-blue-800">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="font-medium">📱 For Android:</span> Go to Settings
            → Digital Wellbeing & parental controls → Dashboard → Take
            screenshot
          </motion.p>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="font-medium">🍎 For iOS:</span> Go to Settings →
            Screen Time → See All Activity → Take screenshot
          </motion.p>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-blue-700 mt-3"
          >
            💡 Upload your screenshot daily to track your progress throughout
            the 10-day program!
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ y: -5 }}
      >
        <Card className="border-2 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-green-50/30">
          <CardHeader>
            <CardTitle>Upload Digital Wellbeing Report</CardTitle>
            <CardDescription>
              Upload a screenshot of your daily screen time from your device's
              Digital Wellbeing or Screen Time settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="date"
                  type="date"
                  value={uploadDate}
                  onChange={(e) => setUploadDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="screenTime">Total Screen Time (hours)</Label>
              <Input
                id="screenTime"
                type="number"
                step="0.1"
                placeholder="e.g., 5.5"
                value={screenTime}
                onChange={(e) => setScreenTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Screenshot</Label>
              {!previewUrl ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-green-300 rounded-lg p-12 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-10 h-10 text-green-600" />
                  </div>
                  <p className="text-gray-900 mb-2">
                    Click to upload your screen time screenshot
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    PNG, JPG, or JPEG up to 5MB
                  </p>
                  <p className="text-xs text-green-600">
                    Drag and drop also works!
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative border-2 border-green-200 rounded-lg overflow-hidden bg-gray-50">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-auto max-h-96 object-contain"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="bg-white/90 backdrop-blur-sm hover:bg-white"
                      onClick={handleRemove}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Ready to upload
                  </div>
                </div>
              )}
            </div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleUpload}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all"
                disabled={!selectedFile || !screenTime}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Report
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upload History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        whileHover={{ y: -5 }}
      >
        <Card className="border-2 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-emerald-50/30">
          <CardHeader>
            <CardTitle>Upload History</CardTitle>
            <CardDescription>
              Your uploaded screen time reports ({uploads.length} uploads)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {uploads.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No reports uploaded yet</p>
                <p className="text-sm">Upload your first report above</p>
              </div>
            ) : (
              <div className="space-y-4">
                {uploads
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .map((upload, index) => (
                    <motion.div
                      key={upload.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="flex items-center gap-4 p-4 border-2 border-green-100 rounded-xl hover:bg-green-50 hover:border-green-300 transition-all shadow-md hover:shadow-lg"
                    >
                      <img
                        src={upload.imageUrl}
                        alt={`Screen time for ${upload.date}`}
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <p>
                            {new Date(upload.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">
                          Screen Time:{" "}
                          <span className="text-green-600">
                            {upload.screenTime} hours
                          </span>
                        </p>
                        <p className="text-xs text-gray-400">
                          Uploaded{" "}
                          {new Date(upload.uploadedAt).toLocaleString()}
                        </p>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUpload(upload.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
