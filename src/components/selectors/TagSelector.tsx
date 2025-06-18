
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from 'lucide-react';
import { useTags } from '@/hooks/useTags';
import { Tag } from '@/types/global';

interface TagSelectorProps {
  selectedTagIds: string[];
  onTagsChange: (tagIds: string[]) => void;
  placeholder?: string;
}

const TagSelector = ({ 
  selectedTagIds, 
  onTagsChange, 
  placeholder = "Adicionar tag..." 
}: TagSelectorProps) => {
  const [inputValue, setInputValue] = useState('');
  const { getActiveTags, getTagsByIds, searchTags } = useTags();
  const selectedTags = getTagsByIds(selectedTagIds);
  const availableTags = inputValue ? searchTags(inputValue) : getActiveTags();
  const unselectedTags = availableTags.filter(tag => !selectedTagIds.includes(tag.id));

  const handleAddTag = (tag: Tag) => {
    if (!selectedTagIds.includes(tag.id)) {
      onTagsChange([...selectedTagIds, tag.id]);
    }
    setInputValue('');
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTagIds.filter(id => id !== tagId));
  };

  return (
    <div className="space-y-3">
      {/* Tags selecionadas */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge key={tag.id} className={`text-xs px-2 py-1 flex items-center gap-1 ${tag.cor}`}>
              {tag.nome}
              <Button
                variant="ghost"
                size="icon"
                className="h-3 w-3 p-0 hover:bg-red-100"
                onClick={() => handleRemoveTag(tag.id)}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input para buscar/adicionar tags */}
      <div className="relative">
        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        
        {/* Sugestões de tags */}
        {inputValue && unselectedTags.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-40 overflow-y-auto">
            {unselectedTags.slice(0, 5).map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => handleAddTag(tag)}
              >
                <Badge className={`text-xs px-2 py-1 ${tag.cor}`}>
                  {tag.nome}
                </Badge>
                <Plus className="h-3 w-3 text-gray-400" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagSelector;
