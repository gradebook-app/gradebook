//
//  ApplePayButtonView.m
//  Gradebook
//
//  Created by Mahit Mehta on 9/27/22.
//

#import <Foundation/Foundation.h>

#import "ApplePayButtonView.h"

@implementation ApplePayButtonView

NSString* DEFAULT_BUTTON_TYPE = @"light";

@synthesize button = _button;
@synthesize cornerRadius = _cornerRadius;
@synthesize buttonType = _buttonType;

- (instancetype) init {
  self = [super init];
  
  if (_buttonType != NULL) {
    [ self setButtonType:_buttonType ];
  } else {
    [ self setButtonType:DEFAULT_BUTTON_TYPE ];
  }
  
  return self;
}

- (void) setButtonType: (NSString*) buttonType {
  
  PKPaymentButtonStyle style;
  PKPaymentButtonType type;
  
  if ([buttonType isEqualToString:@"dark"]) {
    style = PKPaymentButtonStyleBlack;
  } else {
    style = PKPaymentButtonStyleWhite;
  }
  
  if (@available(iOS 14.0, *)) {
    type = PKPaymentButtonTypeContribute;
  } else {
    type = PKPaymentButtonTypePlain;
  }
  
  _button = [[PKPaymentButton alloc] initWithPaymentButtonType:type paymentButtonStyle:style];
  [_button addTarget:self action:@selector(touchUpInside:) forControlEvents:UIControlEventTouchUpInside];
  
  [self addSubview:_button];
}

- (void)touchUpInside:(PKPaymentButton *)button {
  if (self.onPress) {
    self.onPress(nil);
  }
}

- (void)setCornerRadius: (CGFloat *) value {
    if (_cornerRadius != value) {
      [ _button setCornerRadius: *value ];
    }
    
    _cornerRadius = value;
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  _button.frame = self.bounds;
}

@end
