import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { History, Download, Trash2, Eye, Calendar } from 'lucide-react';

export interface DetectionEvent {
  id: string;
  timestamp: Date;
  type: 'pixel' | 'color' | 'text';
  confidence: number;
  screenshot?: string;
  region?: string;
  description: string;
}

interface DetectionHistoryProps {
  events: DetectionEvent[];
  onClearHistory: () => void;
  onExportHistory: (format: 'txt' | 'csv') => void;
  language: string;
}

const DetectionHistory: React.FC<DetectionHistoryProps> = ({
  events,
  onClearHistory,
  onExportHistory,
  language
}) => {
  const [selectedEvent, setSelectedEvent] = useState<DetectionEvent | null>(null);

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        detectionHistory: 'Detection History',
        noEvents: 'No detection events recorded',
        exportTxt: 'Export as TXT',
        exportCsv: 'Export as CSV',
        clearHistory: 'Clear History',
        viewScreenshot: 'View Screenshot',
        timestamp: 'Timestamp',
        type: 'Type',
        confidence: 'Confidence',
        region: 'Region',
        description: 'Description',
        pixel: 'Pixel Change',
        color: 'Color Change',
        text: 'Text Change',
        events: 'events'
      },
      zh: {
        detectionHistory: '檢測歷史',
        noEvents: '未記錄檢測事件',
        exportTxt: '匯出為 TXT',
        exportCsv: '匯出為 CSV',
        clearHistory: '清除歷史',
        viewScreenshot: '查看截圖',
        timestamp: '時間戳',
        type: '類型',
        confidence: '信心度',
        region: '區域',
        description: '描述',
        pixel: '像素變化',
        color: '顏色變化',
        text: '文字變化',
        events: '事件'
      }
    };
    return translations[language]?.[key] || key;
  };

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      pixel: t('pixel'),
      color: t('color'),
      text: t('text')
    };
    return typeMap[type] || type;
  };

  const getTypeVariant = (type: string) => {
    const variantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pixel: 'default',
      color: 'secondary',
      text: 'outline'
    };
    return variantMap[type] || 'default';
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'zh' ? 'zh-TW' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-primary" />
          <h3 className="font-semibold">{t('detectionHistory')}</h3>
          <Badge variant="outline">{events.length} {t('events')}</Badge>
        </div>
        
        {events.length > 0 && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onExportHistory('txt')}
              className="h-7"
            >
              <Download className="w-3 h-3 mr-1" />
              {t('exportTxt')}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onExportHistory('csv')}
              className="h-7"
            >
              <Download className="w-3 h-3 mr-1" />
              {t('exportCsv')}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onClearHistory}
              className="h-7 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              {t('clearHistory')}
            </Button>
          </div>
        )}
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">{t('noEvents')}</p>
        </div>
      ) : (
        <ScrollArea className="h-64">
          <div className="space-y-2">
            {events.map((event, index) => (
              <div key={event.id} className="space-y-2">
                <div className="flex items-start justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={getTypeVariant(event.type)}>
                        {getTypeLabel(event.type)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(event.timestamp)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {event.confidence}%
                      </Badge>
                    </div>
                    
                    <p className="text-sm">{event.description}</p>
                    
                    {event.region && (
                      <p className="text-xs text-muted-foreground">
                        {t('region')}: {event.region}
                      </p>
                    )}
                  </div>
                  
                  {event.screenshot && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedEvent(event)}
                      className="h-7 w-7 p-0"
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                
                {index < events.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Screenshot Modal */}
      {selectedEvent?.screenshot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-4 rounded-lg max-w-md w-full m-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium">{t('viewScreenshot')}</h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedEvent(null)}
                className="h-7 w-7 p-0"
              >
                ×
              </Button>
            </div>
            <img
              src={selectedEvent.screenshot}
              alt="Detection screenshot"
              className="w-full rounded border"
            />
            <div className="mt-3 text-sm text-muted-foreground">
              <p>{formatTimestamp(selectedEvent.timestamp)}</p>
              <p>{selectedEvent.description}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default DetectionHistory;