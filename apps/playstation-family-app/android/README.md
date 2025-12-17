# Android Native Modules

This directory contains Android-specific native code for the PlayStation Family App.

## Native Module Examples

### Device Info Module

Access device information.

**Usage:**
```kotlin
// DeviceInfoModule.kt
package com.playstationfamilyapp

import com.facebook.react.bridge.*
import android.os.Build

class DeviceInfoModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    override fun getName(): String {
        return "DeviceInfoModule"
    }
    
    @ReactMethod
    fun getDeviceInfo(promise: Promise) {
        try {
            val deviceInfo = Arguments.createMap()
            deviceInfo.putString("model", Build.MODEL)
            deviceInfo.putString("manufacturer", Build.MANUFACTURER)
            deviceInfo.putString("version", Build.VERSION.RELEASE)
            deviceInfo.putInt("sdkInt", Build.VERSION.SDK_INT)
            promise.resolve(deviceInfo)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }
}
```

### Camera Module

Access device camera.

**Usage:**
```kotlin
// CameraModule.kt
package com.playstationfamilyapp

import com.facebook.react.bridge.*
import android.content.Intent
import android.provider.MediaStore

class CameraModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    override fun getName(): String {
        return "CameraModule"
    }
    
    @ReactMethod
    fun openCamera(promise: Promise) {
        val intent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
        val activity = currentActivity
        
        if (activity != null && intent.resolveActivity(activity.packageManager) != null) {
            try {
                activity.startActivityForResult(intent, CAMERA_REQUEST_CODE)
                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject("ERROR", e.message)
            }
        } else {
            promise.reject("ERROR", "Camera not available")
        }
    }
    
    companion object {
        const val CAMERA_REQUEST_CODE = 1001
    }
}
```

### Biometric Auth Module

Fingerprint/Face authentication.

**Usage:**
```kotlin
// BiometricAuthModule.kt
package com.playstationfamilyapp

import com.facebook.react.bridge.*
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity

class BiometricAuthModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    override fun getName(): String {
        return "BiometricAuthModule"
    }
    
    @ReactMethod
    fun authenticate(reason: String, promise: Promise) {
        val activity = currentActivity as? FragmentActivity
        
        if (activity == null) {
            promise.reject("ERROR", "Activity not available")
            return
        }
        
        val executor = ContextCompat.getMainExecutor(activity)
        val biometricPrompt = BiometricPrompt(activity, executor,
            object : BiometricPrompt.AuthenticationCallback() {
                override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                    promise.reject("AUTH_ERROR", errString.toString())
                }
                
                override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                    promise.resolve(true)
                }
                
                override fun onAuthenticationFailed() {
                    promise.reject("AUTH_FAILED", "Authentication failed")
                }
            })
        
        val promptInfo = BiometricPrompt.PromptInfo.Builder()
            .setTitle("Biometric Authentication")
            .setSubtitle(reason)
            .setNegativeButtonText("Cancel")
            .build()
        
        biometricPrompt.authenticate(promptInfo)
    }
}
```

### Push Notifications Module

Handle Firebase Cloud Messaging.

**Usage:**
```kotlin
// PushNotificationsModule.kt
package com.playstationfamilyapp

import com.facebook.react.bridge.*
import com.google.firebase.messaging.FirebaseMessaging

class PushNotificationsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    override fun getName(): String {
        return "PushNotificationsModule"
    }
    
    @ReactMethod
    fun requestPermissions(promise: Promise) {
        FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
            if (task.isSuccessful) {
                val token = task.result
                promise.resolve(token)
            } else {
                promise.reject("ERROR", "Failed to get FCM token")
            }
        }
    }
    
    @ReactMethod
    fun getToken(promise: Promise) {
        FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
            if (task.isSuccessful) {
                promise.resolve(task.result)
            } else {
                promise.reject("ERROR", task.exception?.message)
            }
        }
    }
}
```

## Package Registration

Register modules in the package:

```kotlin
// PlaystationFamilyPackage.kt
package com.playstationfamilyapp

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class PlaystationFamilyPackage : ReactPackage {
    
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(
            DeviceInfoModule(reactContext),
            CameraModule(reactContext),
            BiometricAuthModule(reactContext),
            PushNotificationsModule(reactContext)
        )
    }
    
    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}
```

## MainApplication Configuration

Add package to MainApplication:

```kotlin
// MainApplication.kt
override fun getPackages(): List<ReactPackage> {
    return PackageList(this).packages.apply {
        add(PlaystationFamilyPackage())
    }
}
```

## Integration

Import in React Native:

```typescript
import { NativeModules } from 'react-native';

const { 
  DeviceInfoModule, 
  CameraModule, 
  BiometricAuthModule,
  PushNotificationsModule 
} = NativeModules;

// Usage
const deviceInfo = await DeviceInfoModule.getDeviceInfo();
const authenticated = await BiometricAuthModule.authenticate('Login to PlayStation Family');
const fcmToken = await PushNotificationsModule.getToken();
```

## Permissions

Add required permissions in `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.USE_BIOMETRIC" />
<uses-permission android:name="android.permission.INTERNET" />
```
