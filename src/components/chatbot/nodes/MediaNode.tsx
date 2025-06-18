
import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Image, Video, FileText, Upload } from 'lucide-react';

const MediaNode = memo(({ data, id }: any) => {
  const [mediaType, setMediaType] = useState(data.mediaType || 'image');
  const [mediaUrl, setMediaUrl] = useState(data.mediaUrl || '');
  const [caption, setCaption] = useState(data.caption || '');
  const [fileName, setFileName] = useState(data.fileName || '');

  const mediaTypes = [
    { value: 'image', label: 'Imagem', icon: Image },
    { value: 'video', label: 'Vídeo', icon: Video },
    { value: 'document', label: 'Documento', icon: FileText }
  ];

  const handleMediaTypeChange = (value: string) => {
    setMediaType(value);
    data.mediaType = value;
  };

  const handleMediaUrlChange = (value: string) => {
    setMediaUrl(value);
    data.mediaUrl = value;
  };

  const handleCaptionChange = (value: string) => {
    setCaption(value);
    data.caption = value;
  };

  const handleFileNameChange = (value: string) => {
    setFileName(value);
    data.fileName = value;
  };

  const getMediaIcon = () => {
    const mediaTypeObj = mediaTypes.find(type => type.value === mediaType);
    const IconComponent = mediaTypeObj?.icon || Image;
    return <IconComponent className="w-4 h-4 text-white" />;
  };

  return (
    <Card className="w-80 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
            {getMediaIcon()}
          </div>
          <span className="font-medium">Enviar Mídia</span>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Tipo de mídia:</label>
            <Select value={mediaType} onValueChange={handleMediaTypeChange}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mediaTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">URL da mídia:</label>
            <div className="flex gap-2 mt-1">
              <Input
                value={mediaUrl}
                onChange={(e) => handleMediaUrlChange(e.target.value)}
                placeholder="https://exemplo.com/arquivo.jpg"
              />
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {mediaType === 'document' && (
            <div>
              <label className="text-sm font-medium">Nome do arquivo:</label>
              <Input
                value={fileName}
                onChange={(e) => handleFileNameChange(e.target.value)}
                placeholder="documento.pdf"
                className="mt-1"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium">
              {mediaType === 'document' ? 'Descrição:' : 'Legenda:'}
            </label>
            <Textarea
              value={caption}
              onChange={(e) => handleCaptionChange(e.target.value)}
              placeholder={mediaType === 'document' ? 'Descrição do documento...' : 'Legenda da mídia...'}
              className="mt-1 min-h-[60px] resize-none"
            />
          </div>

          {/* Preview */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs font-medium text-gray-500 mb-2">Preview:</div>
            <div className="bg-white rounded-lg p-3 border">
              <div className="flex items-center gap-2 mb-2">
                {getMediaIcon()}
                <span className="text-sm font-medium">
                  {mediaTypes.find(type => type.value === mediaType)?.label}
                </span>
              </div>
              {mediaUrl && (
                <div className="text-xs text-gray-600 mb-1 truncate">
                  {mediaUrl}
                </div>
              )}
              {fileName && mediaType === 'document' && (
                <div className="text-xs font-medium mb-1">
                  {fileName}
                </div>
              )}
              {caption && (
                <div className="text-sm text-gray-700">
                  {caption}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-pink-500 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-pink-500 border-2 border-white"
        />
      </CardContent>
    </Card>
  );
});

MediaNode.displayName = 'MediaNode';

export default MediaNode;
