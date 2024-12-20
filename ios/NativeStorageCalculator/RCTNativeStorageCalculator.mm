//
//  RCTStorageCalculator.m
//  Gradebook
//
//  Created by Mahit Mehta on 12/17/24.
//

#import "RCTNativeStorageCalculator.h"
#import "RNTStorageCalculator.h"

@interface RCTNativeStorageCalculator()
@property (strong, nonatomic) RNTStorageCalculator *storageCalculator;
@end

@implementation RCTNativeStorageCalculator

RCT_EXPORT_MODULE(NativeStorageCalculator)

- (id) init {
  if (self = [super init]) {
    _storageCalculator = [ RNTStorageCalculator new ];
  }
  return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeStorageCalculatorSpecJSI>(params);
}

- (NSNumber *)getAbsoluteCacheSize {
  NSNumber* size = [ _storageCalculator getAbsoluteCacheSize ];
  return size;
}

@end
