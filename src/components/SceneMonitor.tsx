import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Camera as CameraIcon, Square, Play, Pause, Settings, AlertTriangle, Battery, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import AppSettings from './AppSettings';
import RegionSelector, { MonitoringRegion } from './RegionSelector';
import DetectionFilters, { DetectionSettings } from './DetectionFilters';
import ActionSettings, { ActionSettings as ActionSettingsType } from './ActionSettings';
import DetectionHistory, { DetectionEvent } from './DetectionHistory';
import SecuritySettings from './SecuritySettings';

interface ChangeDetectionSettings {
  sensitivity: number; // 0-100
  threshold: number; // 0-100 
  alertEnabled: boolean;
}

const SceneMonitor: React.FC = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [monitoringRegions, setMonitoringRegions] = useState<MonitoringRegion[]>([]);
  const [changeDetected, setChangeDetected] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isLocked, setIsLocked] = useState(false);
  const [energySaving, setEnergySaving] = useState(false);
  
  // Detection events history
  const [detectionEvents, setDetectionEvents] = useState<DetectionEvent[]>([]);
  
  // Settings
  const [settings, setSettings] = useState<ChangeDetectionSettings>({
    sensitivity: 50,
    threshold: 25,
    alertEnabled: true,
  });
  
  const [detectionSettings, setDetectionSettings] = useState<DetectionSettings>({
    pixelDifference: { enabled: true, sensitivity: 50 },
    colorBlockChange: { enabled: true, threshold: 30 },
    textContentChange: { enabled: false, confidence: 70 }
  });
  
  const [actionSettings, setActionSettings] = useState<ActionSettingsType>({
    playSound: { enabled: true, volume: 80 },
    vibratePhone: { enabled: true, intensity: 70 },
    pushAlert: { enabled: true },
    captureScreenshot: { enabled: true, quality: 90 }
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const requestPermissions = async () => {
    try {
      await LocalNotifications.requestPermissions();
      console.log('Permissions granted');
    } catch (error) {
      console.error('Permission denied:', error);
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  const captureImage = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });
      
      return image.dataUrl || null;
    } catch (error) {
      console.error('Error capturing image:', error);
      return null;
    }
  };

  const detectChanges = useCallback((img1: string, img2: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        resolve(false);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(false);
        return;
      }

      const image1 = new Image();
      const image2 = new Image();
      let loadedCount = 0;

      const checkBothLoaded = () => {
        loadedCount++;
        if (loadedCount === 2) {
          // Set canvas size to match images
          canvas.width = image1.width;
          canvas.height = image2.height;

          // Draw both images and compare pixels
          ctx.drawImage(image1, 0, 0);
          const imageData1 = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          ctx.drawImage(image2, 0, 0);
          const imageData2 = ctx.getImageData(0, 0, canvas.width, canvas.height);

          let changedPixels = 0;
          const totalPixels = imageData1.data.length / 4;
          const sensitivityFactor = settings.sensitivity / 100;

          for (let i = 0; i < imageData1.data.length; i += 4) {
            const r1 = imageData1.data[i];
            const g1 = imageData1.data[i + 1];
            const b1 = imageData1.data[i + 2];
            
            const r2 = imageData2.data[i];
            const g2 = imageData2.data[i + 1];
            const b2 = imageData2.data[i + 2];

            const diff = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
            
            if (diff > (255 * 3 * sensitivityFactor)) {
              changedPixels++;
            }
          }

          const changePercentage = (changedPixels / totalPixels) * 100;
          resolve(changePercentage > settings.threshold);
        }
      };

      image1.onload = checkBothLoaded;
      image2.onload = checkBothLoaded;
      
      image1.src = img1;
      image2.src = img2;
    });
  }, [settings]);

  const sendAlert = async () => {
    if (!settings.alertEnabled) return;

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: '🚨 Scene Change Detected!',
            body: 'Significant changes detected in monitored area',
            id: Date.now(),
            schedule: { at: new Date(Date.now() + 100) },
            sound: 'default',
            attachments: [],
            actionTypeId: '',
            extra: {}
          }
        ]
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const startMonitoring = async () => {
    const initialImage = await captureImage();
    if (!initialImage) return;
    
    setReferenceImage(initialImage);
    setCurrentImage(initialImage);
    setIsMonitoring(true);
    setChangeDetected(false);

    intervalRef.current = setInterval(async () => {
      const newImage = await captureImage();
      if (!newImage || !referenceImage) return;

      setCurrentImage(newImage);
      
      const hasChanged = await detectChanges(referenceImage, newImage);
      
      if (hasChanged && !changeDetected) {
        setChangeDetected(true);
        await sendAlert();
      }
    }, 2000); // Check every 2 seconds
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    setChangeDetected(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetReference = async () => {
    const newReference = await captureImage();
    if (newReference) {
      setReferenceImage(newReference);
      setChangeDetected(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background p-4 space-y-6">
      {/* Security Lock Overlay */}
      {isLocked && (
        <SecuritySettings
          language={language}
          isLocked={isLocked}
          onLockToggle={setIsLocked}
          onAuthSuccess={() => setIsLocked(false)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-center flex-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Scene Sentinel
          </h1>
          <p className="text-muted-foreground">Advanced Mobile Change Detection</p>
        </div>
        <div className="flex gap-2">
          {energySaving && <Badge variant="outline"><Battery className="w-3 h-3 mr-1" />Power Save</Badge>}
          <AppSettings language={language} onLanguageChange={setLanguage} />
        </div>
      </div>

      {/* Status Card */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-3 h-3 rounded-full",
              isMonitoring ? "bg-accent animate-pulse" : "bg-muted"
            )} />
            <span className="font-medium">
              {isMonitoring ? 'Monitoring Active' : 'Monitoring Inactive'}
            </span>
          </div>
          
          {changeDetected && (
            <Badge variant="destructive" className="animate-pulse">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Change Detected
            </Badge>
          )}
        </div>

        <div className="flex gap-3 mb-4">
          {!isMonitoring ? (
            <Button 
              onClick={startMonitoring}
              className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Monitoring
            </Button>
          ) : (
            <Button 
              onClick={stopMonitoring}
              variant="destructive"
              className="flex-1"
            >
              <Pause className="w-4 h-4 mr-2" />
              Stop Monitoring
            </Button>
          )}
          
          <Button 
            onClick={resetReference}
            variant="outline"
            className="border-primary/50 text-primary"
          >
            <Square className="w-4 h-4 mr-2" />
            Reset Reference
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm">Energy Saving Mode</span>
          <input 
            type="checkbox" 
            checked={energySaving} 
            onChange={(e) => setEnergySaving(e.target.checked)}
            className="ml-auto"
          />
        </div>
      </Card>

      {/* Region Selection */}
      {currentImage && (
        <RegionSelector
          imageUrl={currentImage}
          regions={monitoringRegions}
          onRegionsChange={setMonitoringRegions}
          language={language}
        />
      )}

      {/* Detection Filters */}
      <DetectionFilters
        settings={detectionSettings}
        onSettingsChange={setDetectionSettings}
        language={language}
      />

      {/* Action Settings */}
      <ActionSettings
        settings={actionSettings}
        onSettingsChange={setActionSettings}
        language={language}
      />

      {/* Detection History */}
      <DetectionHistory
        events={detectionEvents}
        onClearHistory={() => setDetectionEvents([])}
        onExportHistory={(format) => {
          const data = format === 'csv' 
            ? detectionEvents.map(e => `${e.timestamp},${e.type},${e.confidence}%,${e.description}`).join('\n')
            : detectionEvents.map(e => `${e.timestamp}: ${e.description} (${e.confidence}%)`).join('\n');
          const blob = new Blob([data], { type: `text/${format}` });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `detection-history.${format}`;
          a.click();
        }}
        language={language}
      />

      {/* Security Settings */}
      <SecuritySettings
        language={language}
        isLocked={false}
        onLockToggle={setIsLocked}
        onAuthSuccess={() => {}}
      />

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default SceneMonitor;