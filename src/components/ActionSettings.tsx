import React from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Volume2, Vibrate, Bell, Camera, Zap } from 'lucide-react';

export interface ActionSettings {
  playSound: {
    enabled: boolean;
    volume: number;
  };
  vibratePhone: {
    enabled: boolean;
    intensity: number;
  };
  pushAlert: {
    enabled: boolean;
  };
  captureScreenshot: {
    enabled: boolean;
    quality: number;
  };
}

interface ActionSettingsProps {
  settings: ActionSettings;
  onSettingsChange: (settings: ActionSettings) => void;
  language: string;
}

const ActionSettings: React.FC<ActionSettingsProps> = ({
  settings,
  onSettingsChange,
  language
}) => {
  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        actionAfterDetection: 'Action After Detection',
        playSound: 'Play Sound',
        vibratePhone: 'Vibrate Phone',
        pushAlert: 'Send Push Alert',
        captureScreenshot: 'Capture Screenshot',
        volume: 'Volume',
        intensity: 'Intensity',
        quality: 'Quality',
        playSoundDesc: 'Play alert sound when change detected',
        vibrateDesc: 'Vibrate device when change detected',
        pushAlertDesc: 'Send push notification',
        screenshotDesc: 'Automatically capture and save frame'
      },
      zh: {
        actionAfterDetection: '檢測後動作',
        playSound: '播放聲音',
        vibratePhone: '震動手機',
        pushAlert: '發送推播通知',
        captureScreenshot: '擷取螢幕截圖',
        volume: '音量',
        intensity: '強度',
        quality: '品質',
        playSoundDesc: '檢測到變化時播放警示聲',
        vibrateDesc: '檢測到變化時震動裝置',
        pushAlertDesc: '發送推播通知',
        screenshotDesc: '自動擷取並儲存畫面'
      }
    };
    return translations[language]?.[key] || key;
  };

  const updateSetting = (
    type: keyof ActionSettings,
    field: string,
    value: boolean | number
  ) => {
    onSettingsChange({
      ...settings,
      [type]: {
        ...settings[type],
        [field]: value
      }
    });
  };

  return (
    <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-primary" />
        <h3 className="font-semibold">{t('actionAfterDetection')}</h3>
      </div>

      <div className="space-y-6">
        {/* Play Sound */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="play-sound"
              checked={settings.playSound.enabled}
              onCheckedChange={(checked) => 
                updateSetting('playSound', 'enabled', checked as boolean)
              }
            />
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-primary" />
              <label htmlFor="play-sound" className="text-sm font-medium">
                {t('playSound')}
              </label>
            </div>
          </div>
          <p className="text-xs text-muted-foreground ml-6">
            {t('playSoundDesc')}
          </p>
          {settings.playSound.enabled && (
            <div className="ml-6 space-y-2">
              <label className="text-xs font-medium">
                {t('volume')}: {settings.playSound.volume}%
              </label>
              <Slider
                value={[settings.playSound.volume]}
                onValueChange={(value) => 
                  updateSetting('playSound', 'volume', value[0])
                }
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Vibrate Phone */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="vibrate-phone"
              checked={settings.vibratePhone.enabled}
              onCheckedChange={(checked) => 
                updateSetting('vibratePhone', 'enabled', checked as boolean)
              }
            />
            <div className="flex items-center gap-2">
              <Vibrate className="w-4 h-4 text-primary" />
              <label htmlFor="vibrate-phone" className="text-sm font-medium">
                {t('vibratePhone')}
              </label>
            </div>
          </div>
          <p className="text-xs text-muted-foreground ml-6">
            {t('vibrateDesc')}
          </p>
          {settings.vibratePhone.enabled && (
            <div className="ml-6 space-y-2">
              <label className="text-xs font-medium">
                {t('intensity')}: {settings.vibratePhone.intensity}%
              </label>
              <Slider
                value={[settings.vibratePhone.intensity]}
                onValueChange={(value) => 
                  updateSetting('vibratePhone', 'intensity', value[0])
                }
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Push Alert */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="push-alert"
              checked={settings.pushAlert.enabled}
              onCheckedChange={(checked) => 
                updateSetting('pushAlert', 'enabled', checked as boolean)
              }
            />
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <label htmlFor="push-alert" className="text-sm font-medium">
                {t('pushAlert')}
              </label>
            </div>
          </div>
          <p className="text-xs text-muted-foreground ml-6">
            {t('pushAlertDesc')}
          </p>
        </div>

        {/* Capture Screenshot */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="capture-screenshot"
              checked={settings.captureScreenshot.enabled}
              onCheckedChange={(checked) => 
                updateSetting('captureScreenshot', 'enabled', checked as boolean)
              }
            />
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-primary" />
              <label htmlFor="capture-screenshot" className="text-sm font-medium">
                {t('captureScreenshot')}
              </label>
            </div>
          </div>
          <p className="text-xs text-muted-foreground ml-6">
            {t('screenshotDesc')}
          </p>
          {settings.captureScreenshot.enabled && (
            <div className="ml-6 space-y-2">
              <label className="text-xs font-medium">
                {t('quality')}: {settings.captureScreenshot.quality}%
              </label>
              <Slider
                value={[settings.captureScreenshot.quality]}
                onValueChange={(value) => 
                  updateSetting('captureScreenshot', 'quality', value[0])
                }
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ActionSettings;