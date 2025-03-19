
import { Upload, File, Archive, Image, FileText, AlertCircle, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type DocumentType = 'pdf' | 'image' | 'document' | 'archive' | 'other';

type AttachedDocument = {
  id: string;
  name: string;
  size: string;
  type: DocumentType;
  uploadDate: string;
};

// Sample documents for demonstration
const sampleDocuments: AttachedDocument[] = [
  {
    id: '1',
    name: 'Compliance_Report_Q2_2023.pdf',
    size: '2.4 MB',
    type: 'pdf',
    uploadDate: 'Jul 12, 2023'
  },
  {
    id: '2',
    name: 'Risk_Assessment_Template.docx',
    size: '845 KB',
    type: 'document',
    uploadDate: 'Jul 15, 2023'
  },
  {
    id: '3',
    name: 'Signature_Verification.jpg',
    size: '1.2 MB',
    type: 'image',
    uploadDate: 'Jul 20, 2023'
  }
];

const getFileIcon = (type: DocumentType) => {
  switch (type) {
    case 'pdf':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case 'image':
      return <Image className="h-5 w-5 text-blue-500" />;
    case 'document':
      return <FileText className="h-5 w-5 text-blue-700" />;
    case 'archive':
      return <Archive className="h-5 w-5 text-orange-500" />;
    default:
      return <File className="h-5 w-5 text-gray-500" />;
  }
};

const DocumentAttachment = () => {
  const [documents, setDocuments] = useState<AttachedDocument[]>(sampleDocuments);
  const [isDragging, setIsDragging] = useState(false);

  const handleDelete = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // In a real application, you would handle file upload here
    // For demo purposes, we're just showing the UI
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-3">Documents</h3>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-6 transition-colors flex flex-col items-center justify-center mb-4
          ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className={`h-10 w-10 mb-3 ${isDragging ? 'text-primary' : 'text-muted-foreground/60'}`} />
        <p className="text-sm text-center text-muted-foreground mb-2">
          <span className="font-medium">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-center text-muted-foreground">
          PDF, DOC, DOCX, JPG, PNG up to 10MB
        </p>
        <input 
          type="file" 
          className="hidden" 
          id="file-upload" 
          multiple 
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
        />
        <label htmlFor="file-upload">
          <Button variant="outline" size="sm" className="mt-4">
            Select Files
          </Button>
        </label>
      </div>
      
      <div className="space-y-3">
        {documents.map(doc => (
          <div 
            key={doc.id}
            className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center">
              {getFileIcon(doc.type)}
              <div className="ml-3">
                <p className="text-sm font-medium">{doc.name}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-muted-foreground">{doc.size}</span>
                  <span className="mx-2 text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{doc.uploadDate}</span>
                </div>
              </div>
            </div>
            
            <button 
              className="text-muted-foreground hover:text-destructive transition-colors"
              onClick={() => handleDelete(doc.id)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      
      {documents.length === 0 && (
        <div className="text-center py-6 text-muted-foreground text-sm border border-dashed border-muted-foreground/20 rounded-lg">
          No documents attached
        </div>
      )}
    </div>
  );
};

export default DocumentAttachment;
