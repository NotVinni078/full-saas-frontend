
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Mic, Square, Play, Pause, Trash2 } from 'lucide-react';
import { cn } from "@/lib/utils";

/**
 * Componente para gravação de áudio
 * Suporte para gravar, pausar, reproduzir e excluir gravações
 * Design responsivo integrado com sistema de cores
 */

interface AudioRecorderProps {
  onAudioReady: (audioBlob: Blob | null) => void;
  className?: string;
}

type RecordingState = 'idle' | 'recording' | 'paused' | 'recorded';

const AudioRecorder = ({ onAudioReady, className }: AudioRecorderProps) => {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  /**
   * Inicia gravação de áudio
   */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        onAudioReady(blob);
        
        // Parar todas as tracks para liberar o microfone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setRecordingState('recording');
      startTimer();
      
    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      alert('Erro ao acessar o microfone. Verifique as permissões.');
    }
  };

  /**
   * Para a gravação
   */
  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop();
      setRecordingState('recorded');
      stopTimer();
    }
  };

  /**
   * Pausa/resume gravação
   */
  const toggleRecording = () => {
    if (!mediaRecorderRef.current) return;
    
    if (recordingState === 'recording') {
      mediaRecorderRef.current.pause();
      setRecordingState('paused');
      stopTimer();
    } else if (recordingState === 'paused') {
      mediaRecorderRef.current.resume();
      setRecordingState('recording');
      startTimer();
    }
  };

  /**
   * Inicia timer da gravação
   */
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  /**
   * Para timer da gravação
   */
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  /**
   * Reseta gravação
   */
  const resetRecording = () => {
    if (timerRef.current) stopTimer();
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    
    setRecordingState('idle');
    setRecordingTime(0);
    setAudioBlob(null);
    setAudioUrl('');
    setIsPlaying(false);
    onAudioReady(null);
  };

  /**
   * Reproduz/pausa áudio gravado
   */
  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  /**
   * Formata tempo em MM:SS
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup ao desmontar componente
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Estado idle - botão iniciar gravação */}
          {recordingState === 'idle' && (
            <div className="text-center">
              <Button
                onClick={startRecording}
                size="lg"
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Mic className="h-5 w-5 mr-2" />
                Iniciar Gravação
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Toque para começar a gravar sua mensagem de áudio
              </p>
            </div>
          )}

          {/* Estado gravando ou pausado */}
          {(recordingState === 'recording' || recordingState === 'paused') && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-mono text-foreground mb-2">
                  {formatTime(recordingTime)}
                </div>
                <Progress value={(recordingTime / 180) * 100} className="w-full mb-4" />
                <div className="flex justify-center gap-2">
                  <Button
                    onClick={toggleRecording}
                    variant={recordingState === 'recording' ? 'secondary' : 'default'}
                    size="sm"
                  >
                    {recordingState === 'recording' ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 mr-2" />
                        Continuar
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={stopRecording}
                    variant="destructive"
                    size="sm"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Parar
                  </Button>
                </div>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                {recordingState === 'recording' && (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Gravando...
                  </span>
                )}
                {recordingState === 'paused' && (
                  <span>Gravação pausada</span>
                )}
              </div>
            </div>
          )}

          {/* Estado gravado - controles de playback */}
          {recordingState === 'recorded' && audioUrl && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-lg font-medium text-foreground mb-2">
                  Áudio gravado - {formatTime(recordingTime)}
                </div>
                
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />
                
                <div className="flex justify-center gap-2">
                  <Button
                    onClick={togglePlayback}
                    variant="default"
                    size="sm"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Reproduzir
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={resetRecording}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Refazer
                  </Button>
                </div>
              </div>
              
              <div className="text-center text-sm text-success">
                ✓ Áudio pronto para agendamento
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioRecorder;
