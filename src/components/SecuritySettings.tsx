import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, EyeOff, Fingerprint } from 'lucide-react';

interface SecuritySettingsProps {
  language: string;
  isLocked: boolean;
  onLockToggle: (locked: boolean) => void;
  onAuthSuccess: () => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  language,
  isLocked,
  onLockToggle,
  onAuthSuccess
}) => {
  const [pinEnabled, setPinEnabled] = useState(false);
  const [pin, setPin] = useState('');
  const [tempPin, setTempPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        securityPrivacy: 'Security & Privacy',
        privacyMode: 'Privacy Mode',
        blurFeed: 'Blur live feed when others access',
        pinProtection: 'PIN Protection',
        setPinCode: 'Set PIN Code',
        enterPin: 'Enter PIN',
        confirmPin: 'Confirm PIN',
        biometricAuth: 'Biometric Authentication',
        fingerprintFace: 'Use fingerprint/face unlock',
        lockApp: 'Lock App',
        unlockApp: 'Unlock App',
        enterPinToUnlock: 'Enter PIN to unlock',
        incorrectPin: 'Incorrect PIN',
        pinSet: 'PIN set successfully',
        enabled: 'Enabled',
        disabled: 'Disabled',
        authenticate: 'Authenticate'
      },
      zh: {
        securityPrivacy: '安全與隱私',
        privacyMode: '隱私模式',
        blurFeed: '其他人存取時模糊即時畫面',
        pinProtection: 'PIN 保護',
        setPinCode: '設定 PIN 碼',
        enterPin: '輸入 PIN',
        confirmPin: '確認 PIN',
        biometricAuth: '生物識別驗證',
        fingerprintFace: '使用指紋/臉部解鎖',
        lockApp: '鎖定應用程式',
        unlockApp: '解鎖應用程式',
        enterPinToUnlock: '輸入 PIN 解鎖',
        incorrectPin: 'PIN 錯誤',
        pinSet: 'PIN 設定成功',
        enabled: '已啟用',
        disabled: '已停用',
        authenticate: '驗證'
      }
    };
    return translations[language]?.[key] || key;
  };

  const handleSetPin = () => {
    if (tempPin.length >= 4) {
      setPin(tempPin);
      setPinEnabled(true);
      setTempPin('');
      // Show success message
    }
  };

  const handleUnlock = () => {
    if (tempPin === pin) {
      onAuthSuccess();
      setTempPin('');
    } else {
      // Show error message
      setTempPin('');
    }
  };

  const handleBiometricAuth = async () => {
    // In a real app, this would use Capacitor's BiometricAuth plugin
    try {
      // Simulate biometric authentication
      setTimeout(() => {
        onAuthSuccess();
      }, 1000);
    } catch (error) {
      console.error('Biometric authentication failed:', error);
    }
  };

  if (isLocked) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50">
        <Card className="p-6 w-full max-w-sm mx-4 text-center">
          <Lock className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="text-lg font-semibold mb-2">{t('enterPinToUnlock')}</h2>
          
          <div className="space-y-4">
            <div className="relative">
              <Input
                type={showPin ? 'text' : 'password'}
                value={tempPin}
                onChange={(e) => setTempPin(e.target.value)}
                placeholder={t('enterPin')}
                maxLength={6}
                className="text-center"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
              >
                {showPin ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleUnlock}
                disabled={tempPin.length < 4}
                className="flex-1"
              >
                {t('unlockApp')}
              </Button>
              
              {biometricEnabled && (
                <Button
                  onClick={handleBiometricAuth}
                  variant="outline"
                  className="w-12"
                >
                  <Fingerprint className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-4 h-4 text-primary" />
        <h3 className="font-semibold">{t('securityPrivacy')}</h3>
      </div>

      <div className="space-y-6">
        {/* Privacy Mode */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{t('privacyMode')}</span>
            </div>
            <p className="text-xs text-muted-foreground">{t('blurFeed')}</p>
          </div>
          <Switch
            checked={privacyMode}
            onCheckedChange={setPrivacyMode}
          />
        </div>

        {/* PIN Protection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{t('pinProtection')}</span>
              <Badge variant={pinEnabled ? "default" : "secondary"}>
                {pinEnabled ? t('enabled') : t('disabled')}
              </Badge>
            </div>
            <Switch
              checked={pinEnabled}
              onCheckedChange={setPinEnabled}
            />
          </div>

          {pinEnabled && (
            <div className="space-y-2 ml-6">
              <div className="relative">
                <Input
                  type={showPin ? 'text' : 'password'}
                  value={tempPin}
                  onChange={(e) => setTempPin(e.target.value)}
                  placeholder={pin ? t('enterPin') : t('setPinCode')}
                  maxLength={6}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                >
                  {showPin ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </Button>
              </div>
              <Button
                size="sm"
                onClick={pin ? () => {} : handleSetPin}
                disabled={tempPin.length < 4}
                className="w-full"
              >
                {pin ? t('authenticate') : t('setPinCode')}
              </Button>
            </div>
          )}
        </div>

        {/* Biometric Authentication */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{t('biometricAuth')}</span>
            </div>
            <p className="text-xs text-muted-foreground">{t('fingerprintFace')}</p>
          </div>
          <Switch
            checked={biometricEnabled}
            onCheckedChange={setBiometricEnabled}
          />
        </div>

        {/* Lock/Unlock Button */}
        <Button
          onClick={() => onLockToggle(!isLocked)}
          variant={isLocked ? "default" : "outline"}
          className="w-full"
        >
          <Lock className="w-4 h-4 mr-2" />
          {isLocked ? t('unlockApp') : t('lockApp')}
        </Button>
      </div>
    </Card>
  );
};

export default SecuritySettings;