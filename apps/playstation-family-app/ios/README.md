# iOS Native Modules

This directory contains iOS-specific native code for the PlayStation Family App.

## Native Module Examples

### Device Info Module

Access device information like model, OS version, etc.

**Usage:**
```swift
// DeviceInfoModule.swift
import Foundation
import React

@objc(DeviceInfoModule)
class DeviceInfoModule: NSObject {
  @objc
  func getDeviceInfo(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    let deviceInfo = [
      "model": UIDevice.current.model,
      "systemName": UIDevice.current.systemName,
      "systemVersion": UIDevice.current.systemVersion,
    ]
    resolve(deviceInfo)
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
```

### Camera Module

Access device camera for profile pictures.

**Usage:**
```swift
// CameraModule.swift
import UIKit
import React

@objc(CameraModule)
class CameraModule: NSObject {
  @objc
  func openCamera(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      // Present camera
      // Handle image capture
      // Return image data
    }
  }
}
```

### Biometric Auth Module

FaceID/TouchID authentication.

**Usage:**
```swift
// BiometricAuthModule.swift
import LocalAuthentication
import React

@objc(BiometricAuthModule)
class BiometricAuthModule: NSObject {
  @objc
  func authenticate(_ reason: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let context = LAContext()
    var error: NSError?
    
    if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
      context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: reason) { success, error in
        if success {
          resolve(true)
        } else {
          reject("AUTH_FAILED", "Authentication failed", error)
        }
      }
    } else {
      reject("NOT_AVAILABLE", "Biometric authentication not available", error)
    }
  }
}
```

### Push Notifications Module

Handle push notifications.

**Usage:**
```swift
// PushNotificationsModule.swift
import UserNotifications
import React

@objc(PushNotificationsModule)
class PushNotificationsModule: NSObject {
  @objc
  func requestPermissions(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
      if let error = error {
        reject("PERMISSION_ERROR", "Failed to request permissions", error)
      } else {
        resolve(granted)
      }
    }
  }
}
```

## Bridge Configuration

Each native module needs to be exposed to React Native:

```objective-c
// DeviceInfoModule.m
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(DeviceInfoModule, NSObject)
RCT_EXTERN_METHOD(getDeviceInfo:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
@end
```

## Integration

1. Create Swift files in `ios/YourApp/Modules/`
2. Create Objective-C bridge files
3. Import in React Native:

```typescript
import { NativeModules } from 'react-native';

const { DeviceInfoModule, CameraModule, BiometricAuthModule } = NativeModules;

// Usage
const deviceInfo = await DeviceInfoModule.getDeviceInfo();
const authenticated = await BiometricAuthModule.authenticate('Login to PlayStation Family');
```
