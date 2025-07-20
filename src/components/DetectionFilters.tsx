import React from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Filter, Eye, Palette, Type } from 'lucide-react';

export interface DetectionSettings {
  pixelDifference: {
    enabled: boolean;
    sensitivity: number;
  };
  colorBlockChange: {
    enabled: boolean;
    threshold: number;
  };
  textContentChange: {
    enabled: boolean;
    confidence: number;
  };
}

interface DetectionFiltersProps {
  settings: DetectionSettings;
  onSettingsChange: (settings: DetectionSettings) => void;
  language: string;
}

const DetectionFilters: React.FC<DetectionFiltersProps> = ({
  settings,
  onSettingsChange,
  language
}) => {
  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        changeTypeFilters: 'Change Type Filters',
        pixelDifference: 'Pixel-level Difference',
        colorBlockChange: 'Color Block Change',
        textContentChange: 'Text Content Change',
        sensitivity: 'Sensitivity',
        threshold: 'Threshold',
        confidence: 'Confidence',
        detectSmallChanges: 'Detect small pixel changes',
        detectLargeChanges: 'Detect large color area changes',
        detectTextChanges: 'Detect text/character changes (experimental)'
      },
      zh: {
        changeTypeFilters: '變化類型篩選器',
        pixelDifference: '像素級差異',
        colorBlockChange: '色塊變化',
        textContentChange: '文字內容變化',
        sensitivity: '敏感度',
        threshold: '閾值',
        confidence: '信心度',
        detectSmallChanges: '檢測小像素變化',
        detectLargeChanges: '檢測大色彩區域變化',
        detectTextChanges: '檢測文字/字符變化（實驗性）'
      }
    };
    return translations[language]?.[key] || key;
  };

  const updateSetting = (
    type: keyof DetectionSettings,
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
        <Filter className="w-4 h-4 text-primary" />
        <h3 className="font-semibold">{t('changeTypeFilters')}</h3>
      </div>

      <div className="space-y-6">
        {/* Pixel Difference Detection */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="pixel-diff"
              checked={settings.pixelDifference.enabled}
              onCheckedChange={(checked) => 
                updateSetting('pixelDifference', 'enabled', checked as boolean)
              }
            />
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <label htmlFor="pixel-diff" className="text-sm font-medium">
                {t('pixelDifference')}
              </label>
            </div>
          </div>
          <p className="text-xs text-muted-foreground ml-6">
            {t('detectSmallChanges')}
          </p>
          {settings.pixelDifference.enabled && (
            <div className="ml-6 space-y-2">
              <label className="text-xs font-medium">
                {t('sensitivity')}: {settings.pixelDifference.sensitivity}%
              </label>
              <Slider
                value={[settings.pixelDifference.sensitivity]}
                onValueChange={(value) => 
                  updateSetting('pixelDifference', 'sensitivity', value[0])
                }
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Color Block Change Detection */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="color-block"
              checked={settings.colorBlockChange.enabled}
              onCheckedChange={(checked) => 
                updateSetting('colorBlockChange', 'enabled', checked as boolean)
              }
            />
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary" />
              <label htmlFor="color-block" className="text-sm font-medium">
                {t('colorBlockChange')}
              </label>
            </div>
          </div>
          <p className="text-xs text-muted-foreground ml-6">
            {t('detectLargeChanges')}
          </p>
          {settings.colorBlockChange.enabled && (
            <div className="ml-6 space-y-2">
              <label className="text-xs font-medium">
                {t('threshold')}: {settings.colorBlockChange.threshold}%
              </label>
              <Slider
                value={[settings.colorBlockChange.threshold]}
                onValueChange={(value) => 
                  updateSetting('colorBlockChange', 'threshold', value[0])
                }
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Text Content Change Detection */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="text-content"
              checked={settings.textContentChange.enabled}
              onCheckedChange={(checked) => 
                updateSetting('textContentChange', 'enabled', checked as boolean)
              }
            />
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-primary" />
              <label htmlFor="text-content" className="text-sm font-medium">
                {t('textContentChange')}
              </label>
            </div>
          </div>
          <p className="text-xs text-muted-foreground ml-6">
            {t('detectTextChanges')}
          </p>
          {settings.textContentChange.enabled && (
            <div className="ml-6 space-y-2">
              <label className="text-xs font-medium">
                {t('confidence')}: {settings.textContentChange.confidence}%
              </label>
              <Slider
                value={[settings.textContentChange.confidence]}
                onValueChange={(value) => 
                  updateSetting('textContentChange', 'confidence', value[0])
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

export default DetectionFilters;