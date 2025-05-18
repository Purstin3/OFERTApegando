import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, TextArea } from '../components/ui/Input';
import { Save, Trash2 } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  
  const [currentNote, setCurrentNote] = useState<Note>({
    id: '',
    title: '',
    content: '',
    date: ''
  });
  
  const [editMode, setEditMode] = useState(false);
  
  // Save notes to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);
  
  const handleAddNew = () => {
    setCurrentNote({
      id: Date.now().toString(),
      title: '',
      content: '',
      date: new Date().toISOString()
    });
    setEditMode(true);
  };
  
  const handleSave = () => {
    if (!currentNote.title.trim()) return;
    
    if (editMode) {
      // If we're editing an existing note, update it
      if (notes.some(note => note.id === currentNote.id)) {
        setNotes(notes.map(note => 
          note.id === currentNote.id ? { ...currentNote, date: new Date().toISOString() } : note
        ));
      } else {
        // Otherwise add a new note
        setNotes([...notes, { ...currentNote, date: new Date().toISOString() }]);
      }
    }
    
    setCurrentNote({ id: '', title: '', content: '', date: '' });
    setEditMode(false);
  };
  
  const handleDelete = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    
    if (currentNote.id === id) {
      setCurrentNote({ id: '', title: '', content: '', date: '' });
      setEditMode(false);
    }
  };
  
  const handleSelectNote = (note: Note) => {
    setCurrentNote(note);
    setEditMode(false);
  };
  
  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-160px)]">
      <Card className="lg:w-80 flex flex-col">
        <CardHeader 
          title="Notes" 
          action={
            <Button 
              variant="primary" 
              size="sm"
              onClick={handleAddNew}
            >
              New
            </Button>
          }
        />
        <CardBody className="flex-1 overflow-y-auto">
          {notes.length > 0 ? (
            <div className="space-y-2">
              {notes.map(note => (
                <div 
                  key={note.id}
                  className={`p-3 rounded-md cursor-pointer ${
                    currentNote.id === note.id 
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 dark:border-blue-400' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => handleSelectNote(note)}
                >
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                    {note.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {note.content}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(note.date).toLocaleDateString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 dark:text-red-400 p-1 h-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(note.id);
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 dark:text-gray-400">No notes yet</p>
              <Button 
                variant="primary" 
                className="mt-2"
                onClick={handleAddNew}
              >
                Create your first note
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
      
      <Card className="flex-1 flex flex-col">
        <CardHeader 
          title={editMode ? 'Edit Note' : 'Note Details'}
          action={
            editMode ? (
              <Button 
                variant="primary" 
                icon={<Save size={16} />}
                onClick={handleSave}
              >
                Save
              </Button>
            ) : (
              currentNote.id && (
                <Button 
                  variant="outline"
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </Button>
              )
            )
          }
        />
        <CardBody className="flex-1 overflow-y-auto">
          {editMode ? (
            <div className="space-y-4">
              <Input
                label="Title"
                value={currentNote.title}
                onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                placeholder="Note title"
                fullWidth
              />
              <TextArea
                label="Content"
                value={currentNote.content}
                onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                placeholder="Write your note here..."
                rows={12}
                fullWidth
              />
            </div>
          ) : currentNote.id ? (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {currentNote.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Last updated: {new Date(currentNote.date).toLocaleString()}
              </p>
              <div className="prose dark:prose-invert max-w-none whitespace-pre-line">
                {currentNote.content}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Select a note or create a new one
              </p>
              <Button 
                variant="primary"
                onClick={handleAddNew}
              >
                New Note
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default NotesPage;