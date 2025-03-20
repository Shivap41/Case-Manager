
import { FileText, Download, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type Document = {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedDate: string;
};

interface DocumentAttachmentProps {
  documents: Document[];
  onDelete?: (id: string) => void;
}

const DocumentAttachment = ({ documents, onDelete }: DocumentAttachmentProps) => {
  const getFileIcon = (fileType: string) => {
    // You can add more file type icons here
    return <FileText className="h-10 w-10 text-primary" />;
  };

  return (
    <div className="space-y-4">
      {documents.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No documents attached to this case.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="glass-card p-4 rounded-lg flex flex-col">
              <div className="flex items-start mb-3">
                {getFileIcon(doc.type)}
                <div className="ml-3 flex-grow">
                  <h4 className="font-medium text-base mb-1 break-all">{doc.name}</h4>
                  <p className="text-xs text-muted-foreground">{doc.size}</p>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground mb-4">
                <p>Uploaded by: {doc.uploadedBy}</p>
                <p>Date: {doc.uploadedDate}</p>
              </div>
              
              <div className="mt-auto flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
                {onDelete && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => onDelete(doc.id)}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentAttachment;
