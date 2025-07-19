import React, { useState } from 'react';
import { Settings, User, Globe, Shield, Bell, Smartphone, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface AppSettingsProps {
  language: string;
  onLanguageChange: (language: string) => void;
}

const AppSettings: React.FC<AppSettingsProps> = ({ language, onLanguageChange }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [batteryOptimization, setBatteryOptimization] = useState(true);
  const [highPerformanceMode, setHighPerformanceMode] = useState(false);

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        settings: 'Settings',
        userInfo: 'User Information',
        language: 'Language',
        notifications: 'Notifications',
        general: 'General',
        performance: 'Performance',
        security: 'Security & Privacy',
        about: 'About',
        version: 'Version',
        enableNotifications: 'Enable Notifications',
        autoSaveSettings: 'Auto-save Settings',
        darkMode: 'Dark Mode',
        batteryOptimization: 'Battery Optimization',
        highPerformance: 'High Performance Mode',
        dataEncryption: 'Data Encryption',
        anonymousAnalytics: 'Anonymous Analytics',
        selectLanguage: 'Select Language',
        english: 'English',
        traditionalChinese: 'Traditional Chinese',
        appDescription: 'Advanced scene monitoring and change detection application for mobile devices.',
        developer: 'Developed with Lovable'
      },
      zh: {
        settings: '設定',
        userInfo: '用戶資訊',
        language: '語言',
        notifications: '通知',
        general: '一般',
        performance: '效能',
        security: '安全與隱私',
        about: '關於',
        version: '版本',
        enableNotifications: '啟用通知',
        autoSaveSettings: '自動儲存設定',
        darkMode: '深色模式',
        batteryOptimization: '電池最佳化',
        highPerformance: '高效能模式',
        dataEncryption: '資料加密',
        anonymousAnalytics: '匿名分析',
        selectLanguage: '選擇語言',
        english: 'English',
        traditionalChinese: '繁體中文',
        appDescription: '先進的行動裝置場景監控和變化檢測應用程式。',
        developer: '使用 Lovable 開發'
      }
    };
    return translations[language]?.[key] || key;
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="border-primary/50 text-primary hover:bg-primary/10"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            {t('settings')}
          </SheetTitle>
          <SheetDescription>
            {t('appDescription')}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* User Information */}
          <Card className="p-4 bg-card/50">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-4 w-4 text-primary" />
              <h3 className="font-medium">{t('userInfo')}</h3>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Scene Sentinel User</p>
              <Badge variant="secondary">Mobile Version</Badge>
            </div>
          </Card>

          {/* Language Settings */}
          <Card className="p-4 bg-card/50">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="h-4 w-4 text-primary" />
              <h3 className="font-medium">{t('language')}</h3>
            </div>
            <Select value={language} onValueChange={onLanguageChange}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectLanguage')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{t('english')}</SelectItem>
                <SelectItem value="zh">{t('traditionalChinese')}</SelectItem>
              </SelectContent>
            </Select>
          </Card>

          {/* Notifications */}
          <Card className="p-4 bg-card/50">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="h-4 w-4 text-primary" />
              <h3 className="font-medium">{t('notifications')}</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('enableNotifications')}</span>
              <Switch 
                checked={notificationsEnabled} 
                onCheckedChange={setNotificationsEnabled} 
              />
            </div>
          </Card>

          {/* General Settings */}
          <Card className="p-4 bg-card/50">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="h-4 w-4 text-primary" />
              <h3 className="font-medium">{t('general')}</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('autoSaveSettings')}</span>
                <Switch checked={autoSave} onCheckedChange={setAutoSave} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('darkMode')}</span>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </div>
          </Card>

          {/* Performance Settings */}
          <Card className="p-4 bg-card/50">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="h-4 w-4 text-primary" />
              <h3 className="font-medium">{t('performance')}</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('batteryOptimization')}</span>
                <Switch 
                  checked={batteryOptimization} 
                  onCheckedChange={setBatteryOptimization} 
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('highPerformance')}</span>
                <Switch 
                  checked={highPerformanceMode} 
                  onCheckedChange={setHighPerformanceMode} 
                />
              </div>
            </div>
          </Card>

          {/* Security & Privacy */}
          <Card className="p-4 bg-card/50">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-primary" />
              <h3 className="font-medium">{t('security')}</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('dataEncryption')}</span>
                <Badge variant="secondary">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('anonymousAnalytics')}</span>
                <Switch defaultChecked={false} />
              </div>
            </div>
          </Card>

          <Separator />

          {/* About */}
          <Card className="p-4 bg-card/50">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-primary" />
              <h3 className="font-medium">{t('about')}</h3>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>{t('version')}</span>
                <span>1.0.0</span>
              </div>
              <p className="text-xs">{t('developer')}</p>
            </div>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AppSettings;