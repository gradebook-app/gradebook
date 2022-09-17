#import "RCTStorage.h"

@implementation RCTStorage

RCT_EXPORT_MODULE(Storage);

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeStorageSpecJSI>(params);
}

- (NSNumber *)get {
  return @4;
}

@end
