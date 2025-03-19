
import { Send, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type Comment = {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
};

// Sample comments for demonstration
const sampleComments: Comment[] = [
  {
    id: '1',
    author: 'Jane Smith',
    content: 'I\'ve reviewed the regulatory requirements and found some discrepancies with our current implementation. We need to update sections 3.2 and 4.5 to align with the new guidelines.',
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    author: 'Michael Chen',
    content: 'Thanks for flagging this, Jane. I\'ll assign tasks to the respective teams to address these sections. Can you provide more specific details on what needs to be updated?',
    timestamp: '1 hour ago'
  },
  {
    id: '3',
    author: 'Sarah Johnson',
    content: 'I\'ve attached the updated guidelines document for reference. Let me know if you have any questions.',
    timestamp: '45 minutes ago'
  }
];

const CommentSection = () => {
  const [comments, setComments] = useState<Comment[]>(sampleComments);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      author: 'You',
      content: newComment,
      timestamp: 'Just now'
    };
    
    setComments([...comments, comment]);
    setNewComment('');
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">Comments</h3>
      
      <div className="space-y-4 mb-6">
        {comments.map(comment => (
          <div key={comment.id} className="flex animate-scale-in">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
              {comment.avatar ? (
                <img src={comment.avatar} alt={comment.author} className="h-8 w-8 rounded-full" />
              ) : (
                <User className="h-4 w-4 text-white" />
              )}
            </div>
            
            <div className="ml-3 flex-grow">
              <div className="flex items-baseline">
                <span className="text-sm font-medium">{comment.author}</span>
                <span className="ml-2 text-xs text-muted-foreground">{comment.timestamp}</span>
              </div>
              <p className="mt-1 text-sm">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-start">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
          <User className="h-4 w-4 text-white" />
        </div>
        
        <div className="ml-3 flex-grow">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          
          <div className="flex justify-end mt-2">
            <Button onClick={handleAddComment} disabled={!newComment.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
