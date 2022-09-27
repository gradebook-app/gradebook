//
//  ApplePayButtonView.h
//  Gradebook
//
//  Created by Mahit Mehta on 9/27/22.
//

#import <React/RCTView.h>
#import <PassKit/PassKit.h>

@interface ApplePayButtonView : RCTView

@property (nonatomic, readonly) PKPaymentButton *button;
@property (nonatomic, copy) RCTBubblingEventBlock onPress;
@property (nonatomic) NSString *buttonType; 
@property (nonatomic) CGFloat *cornerRadius;

@end
