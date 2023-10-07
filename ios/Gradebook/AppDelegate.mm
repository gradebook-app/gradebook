#import <Firebase.h>
#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  
  self.moduleName = @"main";
  self.initialProps = @{};
  
  [self.window makeKeyAndVisible];
    
  UIStoryboard *sb = [UIStoryboard storyboardWithName:@"SplashScreen" bundle:nil];
  UIViewController *vc = [sb instantiateInitialViewController];
   
  ((RCTRootView *)self.window).loadingView = vc.view;
  
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
