#import <Firebase.h>
#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  
  self.moduleName = @"main";
    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
   UIStoryboard *sb = [UIStoryboard storyboardWithName:@"SplashScreen" bundle:nil];
   UIViewController *vc = [sb instantiateInitialViewController];
   
   ((RCTRootView *)self.window).loadingView = vc.view;
  
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

@end
