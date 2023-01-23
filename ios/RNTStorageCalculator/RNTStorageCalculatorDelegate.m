//
//  RNTStorageCalculator.h
//  Gradebook
//
//  Created by Mahit Mehta on 9/30/22.
//

#import <Foundation/Foundation.h>

#import <React/RCTBridgeModule.h>

#import "RNTStorageCalculator.h"

@interface RNTStorageCalculatorDelegate : NSObject <RCTBridgeModule>
@end

@implementation RNTStorageCalculatorDelegate


RCT_EXPORT_MODULE(RNTStorageCalculator);

RCT_EXPORT_METHOD(
    getSizeByKey:(NSString *) key : (RCTPromiseResolveBlock) resolve : (RCTPromiseRejectBlock) reject)
{
  RNTStorageCalculator *RNTSC = [ RNTStorageCalculator new ];

  NSNumber* size = [ RNTSC getSizeByKey : key ];
  
  resolve(size);
}

RCT_EXPORT_METHOD(
    getSizeByBatch:(NSArray<NSString *> *) keys : (RCTPromiseResolveBlock) resolve : (RCTPromiseRejectBlock) reject)
{
  RNTStorageCalculator *RNTSC = [ RNTStorageCalculator new ];
  
  NSNumber* size = [ RNTSC getSizeByBatch : keys ];
  
  resolve(size);
}

RCT_EXPORT_METHOD(getAbsoluteCacheSize : (RCTPromiseResolveBlock) resolve : (RCTPromiseRejectBlock) reject)
{
  RNTStorageCalculator *RNTSC = [ RNTStorageCalculator new ];
  
  NSNumber* size = [ RNTSC getAbsoluteCacheSize ];
  
  resolve(size);
}

@end
