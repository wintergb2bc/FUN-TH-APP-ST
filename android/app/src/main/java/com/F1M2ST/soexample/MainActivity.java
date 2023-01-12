package com.F1M2ST.soexample;

import android.app.Application;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.umeng.analytics.MobclickAgent;
import org.devio.rn.splashscreen.SplashScreen;
import com.umeng.message.PushAgent;
import com.F1M2ST.soexample.invokenative.PushModule;

import com.tinstall.tinstall.TInstall;
import org.json.JSONObject;
import org.json.JSONException;

import com.F1M2ST.soexample.MainApplication;

public class MainActivity extends ReactActivity {

  public static String Affcodes = "";

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this);
    super.onCreate(savedInstanceState);
    PushModule.initPushSDK(this);
    PushAgent.getInstance(this).onAppStart();
    getTinstall();
  }

  private void getTinstall() {
    //初始化Tinstall代理码
    TInstall.setHost("https://feaffcodegetm2.com");
    TInstall.init((Application) MainApplication.context,"2O5KVT");

    TInstall.getInstall(this,new TInstall.TInstallCallback() {
      @Override
      public void installBack(JSONObject object) {
        try {
          Affcodes = object.getString("affCode");
        } catch (JSONException e) {
          try {
            Affcodes = object.getString("affcode");
          } catch (JSONException s) {
            try {
              Affcodes = object.getString("aff");
            } catch (JSONException d) {
              Affcodes = "err";
              d.printStackTrace();
            }
            s.printStackTrace();
          }
          e.printStackTrace();
        }


      }
    });
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "FedevProject";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the rendered you wish to use (Fabric or the older renderer).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }

  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }
  }
}
