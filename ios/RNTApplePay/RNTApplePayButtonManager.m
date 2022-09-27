//
//  RNTApplePayButtonManager.m
//  Gradebook
//
//  Created by Mahit Mehta on 9/27/22.
//

#import <Foundation/Foundation.h>

#import <PassKit/PassKit.h>

#import <React/RCTViewManager.h>

#import "ApplePayButtonView.h"

@interface RNTApplePayButtonManager : RCTViewManager
@end

@implementation RNTApplePayButtonManager

RCT_EXPORT_MODULE(RNTApplePayButton)

RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)

RCT_CUSTOM_VIEW_PROPERTY(buttonType, NSString, ApplePayButtonView)
{
  if (json) {
    [view setButtonType:[RCTConvert NSString:json]];
  }
}

RCT_CUSTOM_VIEW_PROPERTY(cornerRadius, CGFloat, ApplePayButtonView)
{
  if (json) {
    CGFloat valueAsFloat = [json floatValue];
    CGFloat *pointerToFloat = &valueAsFloat;
    [view setCornerRadius:pointerToFloat];
  }
}

- (UIView *)view
{
  return [ ApplePayButtonView new ];
}

@end

