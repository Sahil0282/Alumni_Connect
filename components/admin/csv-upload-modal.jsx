"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  X,
  Download,
} from "lucide-react";

export function CSVUploadModal({ open, onOpenChange }) {
  const [step, setStep] = useState("upload"); // upload, processing, complete
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [duplicates, setDuplicates] = useState([]);
  const [importResults, setImportResults] = useState(null);
  const fileInputRef = useRef(null);

  const requiredFields = [
    { key: "email", label: "Email", required: true },
    { key: "name", label: "Full Name", required: false },
    { key: "graduation_year", label: "Graduation Year/Batch", required: false },
    { key: "department", label: "Department/Branch", required: false },
    { key: "company", label: "Current Company", required: false },
    { key: "position", label: "Current Position", required: false },
    { key: "phone", label: "Phone Number", required: false },
    { key: "linkedin", label: "LinkedIn Profile", required: false },
  ];

  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      
      // Validate file type
      if (!uploadedFile.name.endsWith('.csv')) {
        alert('Please select a CSV file');
        return;
      }
      
      // Go directly to processing and upload
      setStep("processing");
      await handleImport(uploadedFile);
    }
  };


  const handleImport = async (uploadedFile) => {
    setStep("processing");
    setProgress(0);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', uploadedFile);

      // Start progress simulation
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      // Call the API
      const response = await fetch('http://localhost:8000/api/admin/alumni/upload-csv', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const result = await response.json();
      
      // Set the results from API response
      setImportResults({
        total: result.total_records,
        imported: result.successful_imports,
        duplicates: result.failed_imports,
        errors: 0,
        emails_sent: result.emails_sent || 0,
        emails_failed: result.emails_failed || 0,
      });

      // Combine failed records and email errors for display
      const allFailures = [
        ...result.failed_records.map(record => ({
          name: record.email,
          email: record.email,
          reason: record.error
        })),
        ...result.email_errors.map(record => ({
          name: record.email,
          email: record.email,
          reason: `Email failed: ${record.error}`
        }))
      ];
      
      setDuplicates(allFailures);

      setStep("complete");

    } catch (error) {
      console.error('Error uploading CSV:', error);
      setImportResults({
        total: 0,
        imported: 0,
        duplicates: 0,
        errors: 1,
      });
      setDuplicates([{
        name: "Upload Error",
        email: uploadedFile.name,
        reason: error.message || "Failed to upload file"
      }]);
      setStep("complete");
    }
  };

  const handleReset = () => {
    setStep("upload");
    setFile(null);
    setCsvData([]);
    setProgress(0);
    setDuplicates([]);
    setImportResults(null);
  };

  const downloadSampleTemplate = () => {
    const csvContent = "email,name,graduation_year,department,company,position,phone,linkedin\n" +
                      "john.doe@example.com,John Doe,2020,Computer Science,Google,Software Engineer,+1234567890,https://linkedin.com/in/johndoe\n" +
                      "jane.smith@example.com,Jane Smith,2019,Electrical Engineering,Microsoft,Senior Developer,+1234567891,https://linkedin.com/in/janesmith";
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alumni_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileSpreadsheet className="w-6 h-6 text-green-600" />
            Upload CSV/Excel File
          </DialogTitle>
          <DialogDescription>
            Import alumni data from CSV or Excel files
          </DialogDescription>
        </DialogHeader>

        {step === "upload" && (
          <div className="space-y-6">
            <Card className="border-dashed border-2 border-muted-foreground/25">
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Upload your file</h3>
                    <p className="text-muted-foreground">
                      Drag and drop or click to select CSV/Excel files
                    </p>
                  </div>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Required Format</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Your CSV file should contain the following columns. Only <strong>Email</strong> is required:
                  </p>
                  <div className="text-xs text-muted-foreground mb-4 space-y-1">
                    <p>💡 <strong>Account Setup:</strong> Username will be set to email, password will be email@123</p>
                    <p>📧 <strong>Auto Email:</strong> Login credentials will be automatically sent to each alumni's email</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {requiredFields.map((field) => (
                      <div key={field.key} className="flex items-center gap-2">
                        <Badge
                          variant={field.required ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {field.required ? "Required" : "Optional"}
                        </Badge>
                        <span className="text-sm">{field.label}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" onClick={downloadSampleTemplate}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Sample Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}


        {step === "processing" && (
          <div className="space-y-6 py-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Processing Import</h3>
                <p className="text-muted-foreground">
                  Uploading and processing {file?.name}...
                </p>
              </div>
              <div className="w-full max-w-md mx-auto">
                <Progress value={progress} className="h-3" />
                <p className="text-sm text-muted-foreground mt-2">
                  {progress}% complete
                </p>
              </div>
            </div>
          </div>
        )}

        {step === "complete" && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Import Complete</h3>
                <p className="text-muted-foreground">
                  {importResults?.errors > 0 
                    ? "Import completed with errors" 
                    : importResults?.duplicates > 0 
                      ? "Import completed with some issues" 
                      : importResults?.emails_sent > 0
                        ? `Alumni data imported successfully. ${importResults.emails_sent} credential emails sent.`
                        : "Alumni data has been successfully imported"
                  }
                </p>
              </div>
            </div>

            {importResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Import Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-gray-700 mb-3">Import Statistics</h4>
                      <div className="flex justify-between">
                        <span>Total Records:</span>
                        <span className="font-medium">{importResults.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Successfully Imported:</span>
                        <span className="font-medium text-green-600">
                          {importResults.imported}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Failed Imports:</span>
                        <span className="font-medium text-red-600">
                          {importResults.duplicates}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>System Errors:</span>
                        <span className="font-medium text-red-600">
                          {importResults.errors}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-gray-700 mb-3">Email Notifications</h4>
                      <div className="flex justify-between">
                        <span>Credentials Sent:</span>
                        <span className="font-medium text-green-600">
                          {importResults.emails_sent || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Email Failures:</span>
                        <span className="font-medium text-yellow-600">
                          {importResults.emails_failed || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Success Rate:</span>
                        <span className="font-medium text-blue-600">
                          {importResults.imported > 0 
                            ? Math.round(((importResults.emails_sent || 0) / importResults.imported) * 100)
                            : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {duplicates.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    Issues & Errors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {duplicates.map((duplicate, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{duplicate.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {duplicate.email}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-yellow-700">
                          {duplicate.reason}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <DialogFooter>
          {step === "upload" && (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          )}
          {step === "complete" && (
            <>
              <Button variant="outline" onClick={handleReset}>
                Import More
              </Button>
              <Button onClick={() => onOpenChange(false)}>Done</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
