package com.digiserve.adroit;

import android.app.Application;

import com.facebook.react.ReactApplication;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.horcrux.svg.SvgPackage;
import com.oblador.keychain.KeychainPackage;
import io.sentry.RNSentryPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import io.fixd.rctlocale.RCTLocalePackage;
// import okhttp3.OkHttpClient;

// import com.facebook.stetho.Stetho;
// import com.facebook.stetho.okhttp3.StethoInterceptor;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.devialab.exif.RCTExifPackage;
import org.reactnative.camera.RNCameraPackage;
import com.microsoft.appcenter.reactnative.crashes.AppCenterReactNativeCrashesPackage;
import com.microsoft.appcenter.reactnative.analytics.AppCenterReactNativeAnalyticsPackage;
import com.microsoft.appcenter.reactnative.appcenter.AppCenterReactNativePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ImageResizerPackage(),
            new ReactNativeRestartPackage(),
            new BackgroundTimerPackage(),
            new RNDeviceInfo(),
            new SvgPackage(),
            new KeychainPackage(),
            new RNSentryPackage(),
            new LinearGradientPackage(),
            new RCTLocalePackage(),
            new ReactNativeConfigPackage(),
            new RCTExifPackage(),
            new RNCameraPackage(),
            new AppCenterReactNativeCrashesPackage(MainApplication.this, getResources().getString(R.string.appCenterCrashes_whenToSendCrashes)),
            new AppCenterReactNativeAnalyticsPackage(MainApplication.this, getResources().getString(R.string.appCenterAnalytics_whenToEnableAnalytics)),
            new AppCenterReactNativePackage(MainApplication.this)
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    // Stetho.initializeWithDefaults(this);
    // new OkHttpClient.Builder()
    //   .addNetworkInterceptor(new StethoInterceptor())
    //   .build();
  }
}
