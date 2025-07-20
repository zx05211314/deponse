import React, { useState, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Square, Trash2, Edit } from 'lucide-react';

export interface MonitoringRegion {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  isActive: boolean;
}

interface RegionSelectorProps {
  imageUrl: string | null;
  regions: MonitoringRegion[];
  onRegionsChange: (regions: MonitoringRegion[]) => void;
  language: string;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({
  imageUrl,
  regions,
  onRegionsChange,
  language
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentRegion, setCurrentRegion] = useState<MonitoringRegion | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        defineRegion: 'Define Monitoring Region',
        activeRegions: 'Active Regions',
        noRegions: 'No regions defined',
        region: 'Region',
        deleteRegion: 'Delete Region',
        toggleRegion: 'Toggle Region'
      },
      zh: {
        defineRegion: '定義監控區域',
        activeRegions: '活動區域',
        noRegions: '未定義區域',
        region: '區域',
        deleteRegion: '刪除區域',
        toggleRegion: '切換區域'
      }
    };
    return translations[language]?.[key] || key;
  };

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setIsDrawing(true);
    setStartPoint({ x, y });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
    if (!isDrawing || !startPoint || !imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const width = Math.abs(x - startPoint.x);
    const height = Math.abs(y - startPoint.y);
    const left = Math.min(x, startPoint.x);
    const top = Math.min(y, startPoint.y);
    
    setCurrentRegion({
      id: 'temp',
      x: left,
      y: top,
      width,
      height,
      name: `${t('region')} ${regions.length + 1}`,
      isActive: true
    });
  }, [isDrawing, startPoint, regions.length, t]);

  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !currentRegion) return;
    
    if (currentRegion.width > 5 && currentRegion.height > 5) {
      const newRegion: MonitoringRegion = {
        ...currentRegion,
        id: Date.now().toString()
      };
      onRegionsChange([...regions, newRegion]);
    }
    
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentRegion(null);
  }, [isDrawing, currentRegion, regions, onRegionsChange]);

  const deleteRegion = (id: string) => {
    onRegionsChange(regions.filter(region => region.id !== id));
  };

  const toggleRegion = (id: string) => {
    onRegionsChange(regions.map(region => 
      region.id === id ? { ...region, isActive: !region.isActive } : region
    ));
  };

  if (!imageUrl) return null;

  return (
    <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
      <div className="flex items-center gap-2 mb-3">
        <Square className="w-4 h-4 text-primary" />
        <h3 className="font-semibold">{t('defineRegion')}</h3>
      </div>
      
      <div className="relative mb-4">
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Region selection"
          className="w-full rounded-lg border border-border/50 cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          draggable={false}
        />
        
        {/* Render existing regions */}
        {regions.map(region => (
          <div
            key={region.id}
            className={`absolute border-2 ${
              region.isActive ? 'border-primary' : 'border-muted'
            } bg-primary/10 rounded`}
            style={{
              left: `${region.x}%`,
              top: `${region.y}%`,
              width: `${region.width}%`,
              height: `${region.height}%`
            }}
          >
            <div className="absolute -top-6 left-0 text-xs font-medium bg-primary text-primary-foreground px-1 rounded">
              {region.name}
            </div>
          </div>
        ))}
        
        {/* Render current drawing region */}
        {currentRegion && (
          <div
            className="absolute border-2 border-primary bg-primary/20 rounded"
            style={{
              left: `${currentRegion.x}%`,
              top: `${currentRegion.y}%`,
              width: `${currentRegion.width}%`,
              height: `${currentRegion.height}%`
            }}
          />
        )}
      </div>

      {/* Region list */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm">{t('activeRegions')}</h4>
        {regions.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('noRegions')}</p>
        ) : (
          regions.map(region => (
            <div
              key={region.id}
              className="flex items-center justify-between p-2 rounded bg-background/50"
            >
              <div className="flex items-center gap-2">
                <Badge variant={region.isActive ? "default" : "secondary"}>
                  {region.name}
                </Badge>
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleRegion(region.id)}
                  className="h-7 w-7 p-0"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteRegion(region.id)}
                  className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default RegionSelector;